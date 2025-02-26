import { fileURLToPath } from "url";
import { dirname, join } from "path";
import sqlite3 from "sqlite3";

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class MyDatabase {
  constructor() {
    this.db = new sqlite3.Database(join(__dirname, "learning.db"), (err) => {
      if (err) {
        console.error("Error connecting to database:", err);
      } else {
        // console.log("Connected to database");
        this.initDatabase();
      }
    });
  }

  reset() {
    this.db.run("DROP TABLE IF EXISTS questions");
    this.db.run("DROP TABLE IF EXISTS topics");
    this.db.run("DROP TABLE IF EXISTS modes");
    this.initDatabase();
  }

  initDatabase() {
    // Enable foreign key support
    this.db.run("PRAGMA foreign_keys = ON");

    // Create topics table
    this.db.run(`
            CREATE TABLE IF NOT EXISTS topics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            )
        `);

    // Create modes table
    this.db.run(`
            CREATE TABLE IF NOT EXISTS modes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            )
        `);

    // Create questions table with foreign keys
    this.db.run(`
            CREATE TABLE IF NOT EXISTS questions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                question TEXT NOT NULL,
                correct_answer TEXT NOT NULL,
                wrong_answer1 TEXT NOT NULL,
                wrong_answer2 TEXT NOT NULL,
                wrong_answer3 TEXT NOT NULL,
                topic_id INTEGER NOT NULL,
                mode_id INTEGER NOT NULL,
                FOREIGN KEY (topic_id) REFERENCES topics(id),
                FOREIGN KEY (mode_id) REFERENCES modes(id)
            )
        `);
  }

  async saveQuestions(questions, topicName, modeName) {
    return new Promise((resolve, reject) => {
      this.db.serialize(async () => {
        try {
          this.db.run("BEGIN TRANSACTION");

          // Insert or get topic
          const topicId = await this.getOrCreateTopic(topicName);
          // Insert or get mode
          const modeId = await this.getOrCreateMode(modeName);

          const stmt = this.db.prepare(`
                        INSERT INTO questions (
                            question, correct_answer, wrong_answer1, 
                            wrong_answer2, wrong_answer3, topic_id, mode_id
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    `);

          for (const [question, correct, wrong1, wrong2, wrong3] of questions) {
            await new Promise((resolve, reject) => {
              stmt.run(
                question,
                correct,
                wrong1,
                wrong2,
                wrong3,
                topicId,
                modeId,
                (err) => (err ? reject(err) : resolve())
              );
            });
          }

          stmt.finalize();
          this.db.run("COMMIT");
          resolve();
        } catch (error) {
          this.db.run("ROLLBACK");
          reject(error);
        }
      });
    });
  }

  getOrCreateTopic(topicName) {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT id FROM topics WHERE name = ?",
        [topicName],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          if (row) {
            resolve(row.id);
          } else {
            this.db.run(
              "INSERT INTO topics (name) VALUES (?)",
              [topicName],
              function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
              }
            );
          }
        }
      );
    });
  }

  getOrCreateMode(modeName) {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT id FROM modes WHERE name = ?",
        [modeName],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          if (row) {
            resolve(row.id);
          } else {
            this.db.run(
              "INSERT INTO modes (name) VALUES (?)",
              [modeName],
              function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
              }
            );
          }
        }
      );
    });
  }

  close() {
    this.db.close((err) => {
      if (err) {
        console.error("Error closing database:", err);
      } else {
        //console.log("Database connection closed");
      }
    });
  }

  getAvailableTopics(mode) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `
        SELECT DISTINCT t.name 
        FROM topics t
        JOIN questions q ON t.id = q.topic_id
        JOIN modes m ON q.mode_id = m.id
        WHERE m.name = ?
      `,
        [mode],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows.map((row) => row.name));
        }
      );
    });
  }

  getQuestions(mode, topic) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `
        SELECT q.question, q.correct_answer, q.wrong_answer1, q.wrong_answer2, q.wrong_answer3
        FROM questions q
        JOIN topics t ON q.topic_id = t.id
        JOIN modes m ON q.mode_id = m.id
        WHERE t.name = ?
        AND m.name = ?
      `,
        [topic, mode],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(
            rows.map((row) => [
              row.question,
              row.correct_answer,
              row.wrong_answer1,
              row.wrong_answer2,
              row.wrong_answer3,
            ])
          );
        }
      );
    });
  }

  getAllModes() {
    return new Promise((resolve, reject) => {
      this.db.all(
        `
        SELECT name 
        FROM modes
      `,
        [],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows.map((row) => row.name));
        }
      );
    });
  }

  renameCategory(oldName, newName) {
    return new Promise((resolve, reject) => {
      this.db.run(
        "UPDATE topics SET name = ? WHERE name = ?",
        [newName, oldName],
        function (err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  }

  editQuestion(oldQuestion, newQuestion) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `
        UPDATE questions
        SET question = ?, 
            correct_answer = ?, 
            wrong_answer1 = ?, 
            wrong_answer2 = ?, 
            wrong_answer3 = ?
        WHERE question = ? 
          AND correct_answer = ? 
          AND wrong_answer1 = ? 
          AND wrong_answer2 = ? 
          AND wrong_answer3 = ?
        `,
        [
          // New values
          newQuestion[0],
          newQuestion[1],
          newQuestion[2],
          newQuestion[3],
          newQuestion[4],
          // Old values for matching
          oldQuestion[0],
          oldQuestion[1],
          oldQuestion[2],
          oldQuestion[3],
          oldQuestion[4],
        ],
        function (err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  }
}
