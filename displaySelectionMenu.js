/*
 * @Author: Lukas Kroczek
 * @Author: Julian Scharf
 * @Date: 2025-02-03
 * @Description: Menu display and user input handling utilities
 * @Version: 1.0.4
 * @LastUpdate: 2025-03-10
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
      // Check for exit command
      if (answer.toUpperCase() === "EXIT") {
        console.clear();
        console.log("Exiting program...");
        process.exit(0);
      }
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

  // Validate defaultSelection to be within bounds
  let currentSelection = defaultSelection;
  if (currentSelection < 0) currentSelection = 0;
  if (currentSelection >= options.length) currentSelection = options.length - 1;

  let lastRenderedSelection = -999; // Initialize with a value that doesn't match any valid selection

  // Function to render the menu
  const renderMenu = () => {
    // Only clear and render if the selection has changed
    if (currentSelection !== lastRenderedSelection) {
      console.clear();
      console.log(prompt);

      // Render each option with the current selection highlighted
      options.forEach((option, index) => {
        if (index === currentSelection) {
          console.log(`> ${styleText("green", option)}`);
        } else {
          console.log(`  ${option}`);
        }
      });

      console.log("\nUse arrow keys to navigate and Enter to select");
      lastRenderedSelection = currentSelection;
    }
  };

  renderMenu();

  return new Promise((resolve) => {
    const keyHandler = (str, key) => {
      if (key.name === "c" && key.ctrl) {
        cleanup();
        process.exit(0);
      } else if (key.name === "up") {
        currentSelection =
          currentSelection > 0 ? currentSelection - 1 : options.length - 1;
        renderMenu();
      } else if (key.name === "down") {
        currentSelection =
          currentSelection < options.length - 1 ? currentSelection + 1 : 0;
        renderMenu();
      } else if (key.name === "return" || key.name === "enter") {
        cleanup();
        // Ensure we're resolving with the current highlighted selection
        resolve(currentSelection);
      } else if (key.name === "escape") {
        cleanup();
        resolve(-1); // Return -1 to indicate cancellation
      } else if (key.name >= "1" && key.name <= "9") {
        // Allow numeric selection for options 1-9
        const numSelection = parseInt(key.name) - 1;
        if (numSelection < options.length) {
          currentSelection = numSelection;
          renderMenu();
          // Don't select immediately, just navigate to the option
        }
      }
    };

    // Clean up event listeners and restore terminal settings
    const cleanup = () => {
      process.stdin.removeListener("keypress", keyHandler);
      if (process.stdin.isTTY) process.stdin.setRawMode(false);
      rl.close();
    };

    process.stdin.on("keypress", keyHandler);
  });
}
