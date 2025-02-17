import { styleText } from "node:util";
import { displaySelectionMenu, prompt } from "./displaySelectionMenu.js";

export { LearningMode };

async function LearningMode(db) {
  let indexOutOfRange;
  let topicIdx = -1;
  let modeIdx = -1;
  let topicData;
  const modeData = db.getAllMode();

  while (true) {
    indexOutOfRange = true;
    while (indexOutOfRange) {
      modeIdx = await displaySelectionMenu(
        [...["Choose another mode of operation"], ...modeData],
        "Please select a mode:",
        -1
      );
      if (modeIdx === -1) {
        break;
      }
      topicData = db.getAvailableTopics(modeData[modeIdx]);
      topicIdx = await displaySelectionMenu(
        [...["Choose another mode"], ...topicData],
        "Please select a topic:",
        -1
      );
      indexOutOfRange =
        0 <= topicIdx && topicIdx < topicData.length ? false : true;
    }
    if (modeIdx === -1) {
      break;
    }
    const questions = db.getQuestions(modeData[modeIdx], topicData[topicIdx]);
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
    ).toFixed(2)}% success rate.\nPress [Enter] to continue...`
  );
  console.clear();
}
