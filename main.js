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
import promtSync from "prompt-sync";
const PROMPT = promtSync();

/*
 * TODO: Read mode-data from database to list
 * return: modeData
 **/
async function main() {
  let operationData = ["Learning Mode", "Management Mode"];

  console.clear();
  prompt(
    `Welcome to the Learning Platform!\nYou can always Exit the programm with: "${styleText(
      "red",
      "EXIT"
    )}"! \nPress Enter to continue...`
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
        PROMPT("Goodbye");
        console.clear();
        process.exit();
      case 0:
        await LearningMode();
        break;
      case 1:
        await ManagementMode();
        break;
      default:
        // Index out of range, try again or exit
        break;
    }
  }
}

main();

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
