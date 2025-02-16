import { displaySelectionMenu, prompt } from "./displaySelectionMenu.js";
import { styleText } from "node:util";
import {
  getAvailableTopics,
  getModeData,
  getQuestions,
} from "./data/database.js";
import { questions } from "./data/testdata.js";

export { ManagementMode };

async function ManagementMode() {
  const ManagementModes = [
    "Exit ManagementMode",
    "Create new Categorie",
    "Rename Category",
    "Edit Questions and Answers",
    "Generate Questions and Answers through AI",
  ];
  let ManagementModeIdex;
  let topicIdx;
  const topicData = getAvailableTopics();

  while (true) {
    ManagementModeIdex = await displaySelectionMenu(
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
        topicIdx = await displaySelectionMenu(
          [...["Choose another mode"], ...topicData],
          "Please select a topic:",
          -1
        );
        if (topicIdx > 0) {
          topicData[topicIdx] = prompt(
            `New Category name for ${topicData[topicIdx]}: `
          );
          SaveData();
        }
        break;

      case 2:
        topicIdx = await displaySelectionMenu(
          [...["Choose another mode"], ...topicData],
          "Please select the topic:",
          -1
        );
        if (topicIdx >= 0) {
          await EditQuestionsAndAnswers(getQuestions(topicData[topicIdx]));
          //TODO Save topicData[topicIdx]
        }

        break;

      default:
        break;
    }
  }
}

async function EditQuestionsAndAnswers(Data) {
  let index = -2;
  let questionData = structuredClone(Data);
  let changedQuestion = [];

  do {
    questionData.forEach((element) => {
      element[0] = styleText("blue", element[0]);
      element[1] = styleText("green", element[1]);
    });

    index = await displaySelectionMenu(
      [
        ...[
          `${styleText("red", "Don´t save changes and Choose another mode")}`,
        ],
        ...questionData,
        ...[`${styleText("magenta", "Save changes")}`],
      ],
      "Please select the question and answer you want to change:",
      -1
    );
    console;
    if (index === questionData.length) {
      let save = NaN;
      console.clear();
      changedQuestion.forEach((element) => console.log(`${element}`));
      console.log(
        "Are you shure you want to save thise changes?\n0: don`t save\n1: Save"
      );

      while (isNaN(save)) {
        save = parseInt(prompt(" > "));
      }

      if (save === 1) {
        Data = questionData.map((row) =>
          row.map((item) => item.replace(/\x1B\[[0-9;]*m/g, ""))
        );
      }

      index = -1;
    }
    if (index !== -1) {
      let questionindex = await displaySelectionMenu(
        [
          ...[`${styleText("red", "Choose another question")}`],
          ...questionData[index],
        ],
        "Please select what you want to change:",
        -1
      );
      if (questionindex !== -1) {
        let questionTypeoutput;
        changedQuestion.push(questionData[index]);
        switch (questionindex) {
          case 0:
            questionTypeoutput = "question";
            break;
          case 1:
            questionTypeoutput = "right answer";
            break;
          default:
            questionTypeoutput = "wrong answer";
            break;
        }

        changedQuestion[changedQuestion.length - 1][questionindex] = prompt(
          `The new ${questionTypeoutput} is: `
        );

        questionData[index] = changedQuestion[changedQuestion.length - 1];
      }
    }
  } while (index !== -1);
  return;
}
