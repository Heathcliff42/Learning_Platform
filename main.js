/*
 * @Author: Lukas Kroczek
 * @Author: Julian Scharf
 * @Date: 2025-02-03
 * @Description: Learning Platform
 * @Version: 1.0.4
 * @LastUpdate: 2025-02-10
 */

import { styleText } from "node:util";
import { displaySelectionMenu, prompt } from "./displaySelectionMenu.js";
import { LearningMode } from "./LearningMode.js";
import { ManagementMode } from "./ManagmentMode.js";
import { MyDatabase } from "./data/database.js";
import { _mode, _topic, _question } from "./data/questions.js";
const db = await new MyDatabase();

/**
 * Sets up the database with test data
 * @returns {Promise<void>}
 */
async function databaseSetup() {
  db.initDatabase();
  await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms
  console.log("Database setup completed!");
  db.getOrCreateMode(_mode[0]);
  db.getOrCreateMode("AI Chat");
  db.getOrCreateMode("Flashcard");
  db.getOrCreateMode("Gaptext");
  await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms
  console.log("Mode setup completed!");
  await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms
  _topic.forEach((element) => {
    db.getOrCreateTopic(element);
  });
  await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms
  console.log("Topic setup completed!");
  await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms
  for (let i = 0; i < _topic.length; i++) {
    await db.saveQuestions(_question[i], _topic[i], _mode[0]);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms
  }
  console.log("Questions setup completed!");
}

/**
 * Main entry point for the application
 * @returns {Promise<void>}
 */
async function main() {
  let operationData = ["Learning Mode", "Management Mode"];

  console.clear();
  await prompt(
    `Welcome to the Learning Platform!\nYou can always exit the programm by typing: "${styleText(
      "red",
      "EXIT"
    )}"! \nPress [Enter] to continue...`
  );

  let operatingIdx = -1;

  while (true) {
    operatingIdx = await displaySelectionMenu(
      [...["Exit"], ...operationData],
      "Please select an operation mode:",
      0
    );
    switch (operatingIdx) {
      case -1:
      case 0:
        console.clear();
        console.log("Exiting...");
        await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms
        console.clear();
        process.exit();
      case 1:
        await LearningMode(db);
        break;
      case 2:
        await ManagementMode(db);
        break;
      default:
        // Index out of range, try again or exit
        break;
    }
  }
}
/*
await db.reset();
await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms
await databaseSetup();
/**/

main();

/*
db.close();
*/
/*
while (true) {
  operationidx = select operation mode
  switch (operationidx) {
    case 0:
      while (true) {
        topicidx = -1
        while (topicidx === -1) {
          modeidx = select mode
          topicdata = getAvailableTopics(modedata[modeidx])
          topicidx = select topicdata
        }
        switch (modeidx) {
          case 0:
            start multiple choice with questions of topic[topicidx]
            break
          case 1:
            start gap text with questions of topic[topicidx]
            break
          default:
            index out of range, try again or exit
            break
        }
      }
      break
    case 1:
      while (true) {
        manageidx = select management mode
        switch (manageidx) {
          case 0:
            Create a new category and save it
            break
          case 1:
            Rename a category and save it
            break
          case 2:
            Edit questions and answers and save them
            break
          case 3:
            Generate questions and answers through AI and save them
            break
          case >= 4:
            Somthing else
            break
          default:
            break
        }
      }
      break
    default:
      process.exit()
      break
  }
}
*/
