/*
 * @Author: Lukas Kroczek
 * @Author: Julian Scharf
 * @Date: 2025-02-03
 * @Description: Learning Platform
 * @Version: 1.0.5
 * @LastUpdate: 2025-03-24
 */

import { styleText } from "node:util";
import { displaySelectionMenu, prompt } from "./displaySelectionMenu.js";
import { learningMode } from "./learningMode.js";
import { managementMode } from "./managementMode.js";
import { statSheet } from "./statSheet.js";
import { selectUserProfile } from "./profileManager.js";
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
  let operationData = ["Learning Mode", "Management Mode", "Statistics"];
  let currentUserId = null;

  console.clear();
  await prompt(
    `Welcome to the Learning Platform!\nYou can always exit the programm by typing: "${styleText(
      "red",
      "EXIT"
    )}"! \nPress [Enter] to continue...`
  );

  // Profile selection at startup
  try {
    currentUserId = await selectUserProfile(db);

    // Get the username for welcome message
    const users = await db.getAllUsers();
    const currentUser = users.find((user) => user.id === currentUserId);

    console.clear();
    console.log(styleText("green", `Welcome, ${currentUser.username}!`));
    await prompt("Press [Enter] to continue...");
  } catch (error) {
    console.error("Error during profile selection:", error);
    console.log(
      styleText("red", "Error loading profiles. Using default settings.")
    );
    await prompt("Press [Enter] to continue...");
  }

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
        await learningMode(db, currentUserId);
        break;
      case 2:
        await managementMode(db);
        break;
      case 3:
        await statSheet(db, currentUserId);
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
