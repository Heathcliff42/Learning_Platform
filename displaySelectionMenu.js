/*
 * @Author: Lukas Kroczek
 * @Author: Julian Scharf
 * @Date: 2025-02-03
 * @Description: Menu display and user input handling utilities
 * @Version: 1.0.2
 * @LastUpdate: 2025-03-05
 */

import readline from "readline";
import { styleText } from "node:util";

/**
 * Gets text input from the user via command line
 * @param {string} text - Text to display as prompt
 * @returns {Promise<string>} User's input
 */
export function prompt(text) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(text);

  return new Promise((resolve) => {
    rl.question("", (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

/**
 * Displays a selection menu and handles user navigation
 * @param {Array<string>} options - Array of menu options
 * @param {string} prompt - Text to display above the menu
 * @param {number} defaultSelection - Initial selection index
 * @returns {Promise<number>} Selected option index
 */
export async function displaySelectionMenu(
  options,
  prompt,
  defaultSelection = 0
) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // To handle raw mode for arrow keys
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);

  let currentSelection = defaultSelection;
  let lastRenderedSelection = -999; // Initialize with a value that doesn't match any valid selection

  // Function to render the menu
  const renderMenu = () => {
    // Only clear and render if the selection has changed
    if (currentSelection !== lastRenderedSelection) {
      console.clear();
      console.log(prompt);

      options.forEach((option, index) => {
        if (index === currentSelection) {
          console.log(`> ${styleText("green", option)}`);
        } else {
          console.log(`  ${option}`);
        }
      });

      lastRenderedSelection = currentSelection;
    }
  };

  renderMenu();

  return new Promise((resolve) => {
    process.stdin.on("keypress", (str, key) => {
      if (key.name === "c" && key.ctrl) {
        process.exit();
      } else if (key.name === "up") {
        currentSelection =
          currentSelection > 0 ? currentSelection - 1 : options.length - 1;
        renderMenu();
      } else if (key.name === "down") {
        currentSelection =
          currentSelection < options.length - 1 ? currentSelection + 1 : 0;
        renderMenu();
      } else if (key.name === "return") {
        process.stdin.removeAllListeners("keypress");
        if (process.stdin.isTTY) process.stdin.setRawMode(false);
        rl.close();
        resolve(currentSelection);
      }
    });
  });
}
