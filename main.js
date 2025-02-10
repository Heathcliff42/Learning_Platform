/*
 * @Author: Lukas Kroczek
 * @Author: Julian Scharf
 * @Date: 2025-02-03
 * @Description: Learning Platform
 * @Version: 1.0.2
 * @LastUpdate: 2025-02-10
 */

import promtSync from "prompt-sync";
import { styleText } from "node:util";
<<<<<<< HEAD
import { mode } from "./testdata.js";
import { topic } from "./testdata.js";
import { questions } from "./testdata.js";
import { displaySelectionMenu } from "./displaySelectionMenu.js";
=======
import { mode, topic, questions } from "./testdata.js";
>>>>>>> bdaad2927eddc5452781ac932b9a28a22400f428
const PROMPT = promtSync();

function prompt(output) {
  let input = PROMPT(output);
  if (input === "EXIT") {
    console.clear();
    console.log("Goodbye");
    process.exit();
  }
  return input;
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

function StandardMode(questions) {
  let idx = [];
  let success = 0;

  for (let i = 0; i < questions.length; i++) {
    Math.random() > 0.5 ? idx.push(i) : idx.unshift(i);
  }

  for (let i = 0; i < questions.length; i++) {
    let ans = [];
    for (let j = 1; j < questions[i].length; j++) {
      Math.random() > 0.5 ? ans.push(j) : ans.unshift(j);
    }
    console.clear(); // moved back because of updated logic
    console.log(`Question ${i + 1}: ${questions[idx[i]][0]}`);
    for (let j = 1; j < questions[i].length; j++) {
      console.log(` ${j}. ${questions[idx[i]][ans[j - 1]]}`);
    }
    let answer = parseInt(prompt(" > ")) - 1;

    console.clear(); // moved back because of updated logic
    console.log(`Question ${i + 1}: ${questions[idx[i]][0]}`);
    for (let j = 1; j < questions[i].length; j++) {
      if (ans[j - 1] === 1) {
        console.log(
          styleText("green", ` ${j}. ${questions[idx[i]][ans[j - 1]]}`)
        );
      } else if (j - 1 === answer) {
        console.log(
          styleText("red", ` ${j}. ${questions[idx[i]][ans[j - 1]]}`)
        );
      } else {
        console.log(` ${j}. ${questions[idx[i]][ans[j - 1]]}`);
      }
    }
    prompt(" Continue? ");
    if (ans[answer] === 1) {
      success++;
    }
  }
  console.clear();
  prompt(
    `You answered ${success} out of ${
      questions.length
    } questions correctly.\nThat is a ${(
      (success / questions.length) *
      100
    ).toFixed(2)}% success rate.\nPress Enter to continue...`
  );
  console.clear();
}

function ManagementMode(topicData, questions) {
  const ManagementModes = [
    "Exit ManagementMode",
    "Create new Categorie",
    "Rename Category",
    "Edit Questions and Answers",
    "Generate Questions and Answers through AI",
  ];
  let ManagementModeIdex;
  let topicIdx;

  while (true) {
    ManagementModeIdex = displaySelectionMenu(
      ManagementModes,
      "Please select a mode:",
      -1
    );

    if (ManagementModeIdex === -1) {
      break; // Beenden der schleife
    }
    switch (ManagementModeIdex) {
      case 0:
        break;

      case 1:
        topicIdx = displaySelectionMenu(topicData);
        topicData[topicIdx] = prompt(
          `New Category name for ${topicData[topicIdx]}: `
        );
        SaveData();
        break;

      case 2:
        break;

      default:
        break;
    }
  }
}

/*
 * TODO: Read mode-data from database to list
 * return: modeData
 **/

let modeData = ["Leave the Platform"].concat(mode);
let topicData = topic;

console.clear();
prompt(
  `Welcome to the Learning Platform!\nYou can always Exit the programm with: "${styleText(
    "red",
    "EXIT"
  )}"! \nPress Enter to continue...`
);

let topicIdx = -1;
let modeIdx = -1;
let operatingIdx;
let indexOutOfRange;

while (true) {
<<<<<<< HEAD
  modeIdx = displaySelectionMenu(modeData, "Please select a mode:", -1);
  topicData = getAvailableTopics(modeData[modeIdx]);
  if (modeIdx === -1) {
    //programm beenden
    console.clear();
    console.log("Goodbye");
    break;
  }
  switch (modeIdx) {
    case 0:
      topicIdx = displaySelectionMenu(topicData, "Please select a topic:");
      StandardMode(questions);
      break;

=======
  operatingIdx = select(modeData, "Please select an operation mode:");
  switch (operatingIdx) {
    case 0:
      while (true) {
        indexOutOfRange = true;
        while (indexOutOfRange) {
          modeIdx = select(modeData, "Please select a mode:");
          topicData = getAvailableTopics(modeData[modeIdx]);
          topicIdx = select(
            topicData,
            "Please select a topic:\n 0. Choose another mode"
          );
          indexOutOfRange =
            0 <= topicIdx && topicIdx < topicData.length ? false : true;
        }
        switch (modeIdx) {
          case 0:
            StandardMode(questions);
            break;
          case 1:
            // Gap Text Mode
            break;
          case 2:
            // Flashcard Mode
            break;
          case 3:
            // AI-Chat Mode
            break;
          default:
            // Index out of range, try again or exit
            break;
        }
      }
>>>>>>> bdaad2927eddc5452781ac932b9a28a22400f428
    case 1:
      ManagementMode(topicData, questions);
      break;
    default:
      // Index out of range, try again or exit
      break;
  }
}

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
