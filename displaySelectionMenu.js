import Inquirer from "inquirer";
import promtSync from "prompt-sync";
import { prompt } from "./main.js";
export { displaySelectionMenu };

function displaySelectionMenu(data, Message, startIndex = 0) {
  //TODO The Inquirers make the code stop without using async/await, callback or promise because they make the code overcomplicated
  //I sat there for almost 3 hours trying to find a solution but I didn't really find anything

  // console.clear();
  // Inquirer.prompt([
  //   {
  //     type: "list",
  //     name: "selected",
  //     message: "Message",
  //     choices: data,
  //   },
  // ]).then((answer) => {
  //   console.log(`Du hast gewählt: ${answer.selected}`);
  // });

  // return; //data.indexOf(answer.selected) + startIndex;

  console.clear();
  console.log(Message);

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
