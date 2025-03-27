/*
 * @Author: Lukas Kroczek
 * @Date: 2025-03-07
 * @Description: Gap Text functionality for Learning Mode
 * @Version: 1.0.2
 * @LastUpdate: 2025-03-24
 */

import { styleText } from "node:util";
import { prompt } from "./displaySelectionMenu.js";

/**
 * Implements the gap text mode functionality
 * @param {Array} gaptexts - Array of gaptext data [text with gaps, solution]
 * @returns {Promise<Object>} - Statistics from the session
 */
<<<<<<< HEAD
export async function GapTextMode(gaptexts) {
=======
export async function gapTextMode(gaptexts) {
>>>>>>> 0328022f2680b57ca3304448675672009d540037
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
    const userAnswer = await prompt(" > ");

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

    await prompt("\nPress [Enter] to continue...");
  }

  console.clear();
  const successRate = (success / gaptexts.length) * 100;
<<<<<<< HEAD
  await prompt(
    `You answered ${success} out of ${gaptexts.length} questions correctly.\n` +
      `That is a ${successRate.toFixed(2)}% success rate.\n` +
      `Press [Enter] to continue...`
=======
  console.log(styleText("cyan", "Gap Text Exercise Complete!"));
  console.log(
    `You answered ${success} out of ${gaptexts.length} questions correctly.`
>>>>>>> 0328022f2680b57ca3304448675672009d540037
  );
  console.log(`That is a ${successRate.toFixed(2)}% success rate.`);

  await prompt("\nPress [Enter] to continue...");
  console.clear();

  // Return statistics for this session
  return {
    totalQuestions: gaptexts.length,
    correctAnswers: success,
    averageScore: successRate,
  };
}
