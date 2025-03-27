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

  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);

  let currentSelection = Math.max(
    0,
    Math.min(defaultSelection, options.length - 1)
  );

  const calculateVisibleCount = () => {
    // Dynamically calculate visibleCount based on console height
    const consoleHeight = process.stdout.rows || 24; // Default to 24 if rows is undefined
    const reservedLines = 5; // Lines reserved for prompt, instructions, etc.
    return Math.max(1, consoleHeight - reservedLines);
  };

  let visibleCount = calculateVisibleCount();
  let offset = Math.max(0, currentSelection - Math.floor(visibleCount / 2));

  const renderMenu = () => {
    visibleCount = calculateVisibleCount(); // Recalculate in case console size changes
    console.clear();
    console.log(prompt);

    // Scrollbar logic: Ensure the current selection is visible
    if (currentSelection < offset) {
      offset = currentSelection;
    } else if (currentSelection >= offset + visibleCount) {
      offset = currentSelection - visibleCount + 1;
    }

    const end = Math.min(offset + visibleCount, options.length);
    for (let i = offset; i < end; i++) {
      console.log(
        i === currentSelection
          ? `> ${styleText("green", options[i])}`
          : `  ${options[i]}`
      );
    }

    console.log("\nUse arrow keys to navigate and Enter to select");
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
        resolve(currentSelection);
      } else if (key.name === "escape") {
        cleanup();
        resolve(-1);
      } else if (key.name >= "1" && key.name <= "9") {
        const numSelection = parseInt(key.name) - 1;
        if (numSelection < options.length) {
          currentSelection = numSelection;
          renderMenu();
        }
      }
    };

    const cleanup = () => {
      process.stdin.removeListener("keypress", keyHandler);
      if (process.stdin.isTTY) process.stdin.setRawMode(false);
      rl.close();
    };

    process.stdin.on("keypress", keyHandler);
  });
}
