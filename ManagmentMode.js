import { displaySelectionMenu, prompt } from "./displaySelectionMenu.js";
import { styleText } from "node:util";

export { ManagementMode };

/**
 * TODO: Finish updating to make everything work with changes to database.js
 */

async function ManagementMode(db) {
  const ManagementModes = [
    "Exit ManagementMode",
    "Create new Categorie",
    "Rename Category",
    "Edit Questions and Answers",
    "Generate Questions and Answers through AI",
  ];
  let ManagementModeIdex;
  let topicIdx;
  const topicData = db.getAvailableTopics();

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
        await EditQuestionsAndAnswers(topicData);
        //TODO Save topicData[topicIdx]

        break;

      default:
        break;
    }
  }
}

async function EditQuestionsAndAnswers(topicData) {
  function styleQuestionsAndAnswers(questions) {
    questions.forEach((element) => {
      element[0] = styleText("blue", element[0]);
      element[1] = styleText("green", element[1]);
    });
    return questions;
  }
  function saveQuestions(Data, questionData, changedQuestion) {
    styleQuestionsAndAnswers(changedQuestion);
    let save;
    console.clear();
    changedQuestion.forEach((element) => console.log(`${element}`));
    console.log(
      "Are you shure you want to save these changes?\n 0: Don`t save\n 1: Save"
    );
    while (isNaN(save)) {
      save = parseInt(prompt(" > "));
    }
    if (save === 1) {
      Data = questionData.map(
        (row) => row.map((item) => item.replace(/\x1B\[[0-9;]*m/g, "")) // style = none
      );
      // TODO Save on the DB
      return false;
    }
    return true;
  }
  async function changeQuestionsAndAnswers(questionData, changedQuestion) {
    let index;
    do {
      styleQuestionsAndAnswers(questionData);

      index = await displaySelectionMenu(
        [...["Choose another changing mode"], ...questionData],
        "Please select the question and answer you want to change:",
        -1
      );

      if (index !== -1) {
        let questionindex = await displaySelectionMenu(
          [
            ...[`${styleText("red", "Choose another question")}`],
            ...questionData[index],
          ],
          "Please select a changing mode:",
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
  }
  async function addQuestions(questionData, changedQuestion) {
    do {
      console.clear();
      console.log("Type 0 to exit the Add Questions mode");
      const question = prompt("The new question: ");

      if (parseInt(question) === 0) {
        return;
      }
      const rightAnswer = prompt("Right answer: ");
      const wrong_answer1 = prompt("Wrong answer 1/3: ");
      const wrong_answer2 = prompt("Wrong answer 2/3: ");
      const wrong_answer3 = prompt("Wrong answer 3/3: ");
      let newQuestion = [
        question,
        rightAnswer,
        wrong_answer1,
        wrong_answer2,
        wrong_answer3,
      ];

      changedQuestion.push(newQuestion);
      questionData.push(newQuestion);
    } while (true);
  }
  async function deleteQuestions(questionData, changedQuestion) {
    styleQuestionsAndAnswers(questionData);
    let Deleteindex = await displaySelectionMenu(
      [...["Exit"], ...questionData],
      "Which question do you want to delete",
      -1
    );
    if (Deleteindex !== -1) {
      let data = questionData[Deleteindex];
      let deletedQuestion = structuredClone(data);

      deletedQuestion = deletedQuestion.map((item) => styleText("bgRed", item));
      changedQuestion.push(deletedQuestion);
      questionData.splice(Deleteindex, 1);
    }
  }

  let topicIdx = await displaySelectionMenu(
    [...["Choose another mode"], ...topicData],
    "Please select the topic:",
    -1
  );
  if (topicIdx !== -1) {
    let Data = db.getQuestions(topicData[topicIdx]);
    let questionData = structuredClone(Data);
    let changedQuestion = [];
    let editModeLoop = true;

    do {
      let editMode = await displaySelectionMenu(
        [
          styleText("red", "Don't save changes and exit the mode"),
          styleText("blue", "Change questions and answers"),
          styleText("blue", "Add questions"),
          styleText("red", "Delete questions"),
          styleText("green", "Save changes"),
        ],
        "Please select the question and answer you want to change:",
        -1
      );
      switch (editMode) {
        case 0:
          await changeQuestionsAndAnswers(questionData, changedQuestion);
          break;

        case 1:
          await addQuestions(questionData, changedQuestion);
          break;

        case 2:
          await deleteQuestions(questionData, changedQuestion);
          break;

        case 3:
          editModeLoop = saveQuestions(Data, questionData, changedQuestion);
          break;

        default:
          editModeLoop = false;
          break;
      }
    } while (editModeLoop);
  }
}
