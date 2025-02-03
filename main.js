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

function getMode(data) {
  console.clear();
  console.log("Please select a mode:");

  if (data.length < 9) {
    for (let i = 0; i < data.length; i++) {
      console.log(` ${i + 1}. ${data[i]}`);
    }
  } else {
    for (let i = 0; i < 9; i++) {
      console.log(` ${i + 1}. ${data[i]}`);
    }
    for (let i = 9; i < data.length; i++) {
      console.log(`${i + 1}. ${data[i]}`);
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

function getTopic(data) {
  console.log("Please select a topic:");
  console.log(" 0. Choose another mode");

  if (data.length < 9) {
    for (let i = 0; i < data.length; i++) {
      console.log(` ${i + 1}. ${data[i]}`);
    }
  } else {
    for (let i = 0; i < 9; i++) {
      console.log(` ${i + 1}. ${data[i]}`);
    }
    for (let i = 9; i < data.length; i++) {
      console.log(`${i + 1}. ${data[i]}`);
    }
  }

  return parseInt(prompt(" > ")) - 1;
}

function StandardMode(questions){
  let idx = [];
  
  for (let i = 0; i < questions.length; i++) {
    Math.random() > 0.5 ? idx.push(i) : idx.unshift(i);
  }
  
  console.clear();// moved because the answer got also cleared
  for (let i = 0; i < questions.length; i++) {
    console.log(`Question ${i + 1}: ${questions[idx[i]][0]}`);
    let ans = [];
    for (let j = 1; j < questions[i].length; j++) {
      Math.random() > 0.5 ? ans.push(j) : ans.unshift(j);
    }
    for (let j = 1; j < questions[i].length; j++) {
      console.log(` ${j}. ${questions[idx[i]][ans[j - 1]]}`);
    }
    let answer = parseInt(prompt(" > "));
    
    if (questions[idx[i]][ans[answer - 1]] === questions[idx[i]][1]) {
      console.log(styleText("green","Correct!"));
    } else {
      console.log(styleText("red",`Incorrect! The Right number was ${ans.indexOf(1)+1} with ${questions[idx[i]][1]}`));
    }
  }
}

/*
 * TODO: Read mode-data from database to list
 * return: modeData
 **/

let modeData = mode;
let topicData = topic;
let topicIdx = -1;

console.log("Welcome to the Learning Platform!");
while (topicIdx === -1) {
  let modeIdx = getMode(modeData);
  topicData = getAvailableTopics(modeData[modeIdx]);
  topicIdx = getTopic(topicData);
  switch(topicIdx){
    case 0:
      StandardMode(questions);
      break;


    default:
      break;
  }
}

