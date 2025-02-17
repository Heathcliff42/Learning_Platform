/*
 * @Author: Lukas Kroczek
 * @Author: Julian Scharf
 * @Date: 2025-02-03
 * @Description: Learning Platform
 * @Version: 1.0.2
 * @LastUpdate: 2025-02-10
 */

import { styleText } from "node:util";
import { displaySelectionMenu, prompt } from "./displaySelectionMenu.js";
import { LearningMode } from "./LearningMode.js";
import { ManagementMode } from "./ManagmentMode.js";
import { MyDatabase } from "./data/database.js";
import { mode, topic, questions } from "./data/testdata.js";
import { _mode, _topic, _question } from "./data/questions.js";
const db = new MyDatabase();

async function databaseSetup() {
  db.initDatabase();
  await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms
  console.log("Database setup completed!");
  db.getOrCreateMode(mode[0]);
  await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms
  console.log("Mode setup completed!");
  db.getOrCreateTopic(topic[0]);
  await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms
  _topic.forEach((element) => {
    db.getOrCreateTopic(element);
  });
  await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms
  console.log("Topic setup completed!");
  db.saveQuestions(questions, topic[0], mode[0]);
  await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms
  for (let i = 0; i < _topic.length; i++) {
    await db.saveQuestions(_question[i], _topic[i], mode[0]);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms
  }
  console.log("Questions setup completed!");
}

/*
 * TODO: Read mode-data from database to list
 * return: modeData
 **/
async function main() {
  let operationData = ["Learning Mode", "Management Mode"];

  console.clear();
  prompt(
    `Welcome to the Learning Platform!\nYou can always exit the programm by typing: "${styleText(
      "red",
      "EXIT"
    )}"! \nPress [Enter] to continue...`
  );

  // let topicIdx = -1;
  // let modeIdx = -1;
  let operatingIdx = -2;
  //let indexOutOfRange;

  while (true) {
    operatingIdx = await displaySelectionMenu(
      [...["Exit"], ...operationData],
      "Please select an operation mode:",
      -1
    );
    switch (operatingIdx) {
      case -1:
        console.clear();
        console.log("Closing...");
        await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms
        console.clear();
        process.exit();
      case 0:
        await LearningMode(db);
        break;
      case 1:
        await ManagementMode(db);
        break;
      default:
        // Index out of range, try again or exit
        break;
    }
  }
}

await db.reset();

await databaseSetup();

//main();

db.close();

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
