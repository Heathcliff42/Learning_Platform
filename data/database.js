import sqlite3 from "sqlite3";
import { mode, topic, questions } from "./testdata.js";
export { getAvailableTopics, SaveData, getQuestions, getModeData };

export class Database {
  constructor() {
    this.db = new sqlite3.Database("learning.db", (err) => {
      if (err) {
        console.error("Error connecting to database:", err);
      } else {
        console.log("Connected to database");
        this.initDatabase();
      }
    });
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
}

function getAvailableTopics(mode) {
  /*
   * TODO: Read available topics from database to list
   * (join tables to get topics for the selected mode)
   * input:
   *   mode: string
   *     (selected mode)
   * return:
   *   topicData: array of strings
   *     (topics available for the selected mode)
   **/
  return topic;
}

function getQuestions(topic) {
  /*
   * TODO Get the Questions on the DB
   */

  return questions;
}

function getModeData() {
  /*
   * TODO get available Lerning Mode Data
   */
  return mode;
}

function SaveData() {
  /*
   * TODO: Save Data
   *
   * Create a new category/question:
   * INSERT INTO Category/Question (column1, column2, column3, ...) VALUES (value1, value2, value3, ...);
   *
   * Rename/Edit a category/question:
   * UPDATE Category/Question SET column1 = value1, column2 = value2, ...;
   *
   */
  return;
}
