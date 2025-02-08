/*
 * @Author: Lukas Kroczek
 * @Date: 2025-02-03
 * @Description: Learning Platform
 * @Version: 1.0.0
 * @LastUpdate: 2025-02-03
 */

import promtSync from "prompt-sync";
import { styleText } from "node:util";
import { mode } from "./testdata.js";
import { topic } from "./testdata.js";
import { questions } from "./testdata.js";
const PROMPT = promtSync();

function prompt(output) {
  let input = PROMPT(output);
  if (input === "EXIT") {
    console.log("Goodbye");
    process.exit();
  }
  return input;
}

function select(data, additionalOutput, startIndex = 0) {
  console.clear();
  console.log(additionalOutput);

  if (data.length + startIndex < 9) {
    for (let i = 0; i < data.length; i++) {
      console.log(` ${i + 1 + startIndex}. ${data[i]}`);
    }
  } else {
    for (let i = 0; i < 9; i++) {
      console.log(` ${i + 1 + startIndex}. ${data[i]}`);
    }
    for (let i = 9; i < data.length; i++) {
      console.log(`${i + 1 + startIndex}. ${data[i]}`);
    }
  }

  return parseInt(prompt(" > ")) - 1;
}

function getAvailableTopics(mode) {
  /*
   * TODO: Read available topics from database to list
   * (join tables to get topics for the selected mode)
   * input: mode
   * return: topicData
   **/
  return topic;
}

function SafeData() {
  /*
   *TODO: Save Data
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
    "new Categorie",
    "Rename Category",
    "Eddit Questions and Answers",
    "Generate Questions and Answers through AI ",
  ];
  let ManagementModeIdex;
  let topicIdx;

  while (true) {
    ManagementModeIdex = select(ManagementModes, "Please select a mode:", -1);

    if (ManagementModeIdex === -1) {
      break; // Beenden der schleife
    }
    switch (ManagementModeIdex) {
      case 0:
        break;

      case 1:
        topicIdx = select(topicData);
        topicData[topicIdx] = prompt(
          `new Category name for ${topicData[topicIdx]}: `
        );
        SafeData();
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

while (true) {
  modeIdx = select(modeData, "Please select a mode:", -1);
  topicData = getAvailableTopics(modeData[modeIdx]);
  if (modeIdx === -1) {
    //programm beenden
    console.clear();
    console.log("Goodbye");
    break;
  }
  switch (modeIdx) {
    case 0:
      topicIdx = select(topicData, "Please select a topic:");
      StandardMode(questions);
      break;

    case 1:
      ManagementMode(topicData, questions);
      break;

    default:
      break;
  }
}
