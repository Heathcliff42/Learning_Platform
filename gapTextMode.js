/*
 * @Author: Lukas Kroczek
 * @Date: 2025-03-07
 * @Description: Gap Text functionality for Learning Mode
 * @Version: 1.0.1
 * @LastUpdate: 2025-03-10
 */

import { styleText } from "node:util";
import { prompt } from "./displaySelectionMenu.js";

/**
 * Implements the gap text mode functionality
 * @param {Array} gaptexts - Array of gaptext data [text with gaps, solution]
 * @returns {void}
 */
export function GapTextMode(gaptexts) {
  let idx = [];
  let success = 0;

  // Randomize question order
  for (let i = 0; i < gaptexts.length; i++) {
    Math.random() > 0.5 ? idx.push(i) : idx.unshift(i);
  }

  for (let i = 0; i < gaptexts.length; i++) {
    console.clear();

    // Each gaptext[0] contains the text with gaps marked as [___]
    const questionText = gaptexts[idx[i]][0];
    console.log(`Question ${i + 1}:`);
    console.log(questionText);

    // The correct answer is in gaptexts[idx[i]][1]
    const correctAnswer = gaptexts[idx[i]][1];

    console.log("\nFill in the gap:");
    const userAnswer = prompt(" > ");

    console.clear();
    console.log(`Question ${i + 1}:`);

    // Display the question with the user's answer
    const resultText = questionText.replace("[___]", userAnswer);
    console.log(resultText);

    // Check if answer is correct (case insensitive comparison)
    const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();

    if (isCorrect) {
      console.log(styleText("green", "\nCorrect! ✓"));
      success++;
    } else {
      console.log(styleText("red", "\nIncorrect! ✗"));
      console.log(
        `The correct answer was: ${styleText("green", correctAnswer)}`
      );
    }

    prompt("\nPress [Enter] to continue...");
  }

  console.clear();
  const successRate = (success / gaptexts.length) * 100;
  prompt(
    `You answered ${success} out of ${gaptexts.length} questions correctly.\n` +
      `That is a ${successRate.toFixed(2)}% success rate.\n` +
      `Press [Enter] to continue...`
  );
  console.clear();
}
