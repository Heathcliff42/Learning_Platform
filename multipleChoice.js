/*
 * @Author: Lukas Kroczek
 * @Author: Julian Scharf
 * @Date: 2025-03-05
 * @Description: Multiple Choice functionality for Learning Mode
 * @Version: 1.0.2
 * @LastUpdate: 2025-03-24
 */

import { styleText } from "node:util";
import { prompt, displaySelectionMenu } from "./displaySelectionMenu.js";

/**
 * Implements the standard quiz mode functionality (multiple choice)
 * @param {Array} questions - Array of question data
 * @returns {Promise<Object>} - Statistics from the session
 */
export async function MultipleChoiceMode(questions) {
  let idx = [];
  let success = 0;

  // Randomize question order
  for (let i = 0; i < questions.length; i++) {
    Math.random() > 0.5 ? idx.push(i) : idx.unshift(i);
  }

  for (let i = 0; i < questions.length; i++) {
    // Create array with indices 1-4 (for answer options)
    let ans = [];
    for (let j = 1; j < questions[idx[i]].length; j++) {
      Math.random() > 0.5 ? ans.push(j) : ans.unshift(j);
    }

    console.clear();
    console.log(`Question ${i + 1} of ${questions.length}:`);
    console.log(styleText("cyan", questions[idx[i]][0]));
    console.log(""); // Add a blank line

    // Create options for the selection menu
    const options = [];
    for (let j = 1; j < questions[idx[i]].length; j++) {
      options.push(questions[idx[i]][ans[j - 1]]);
    }

    // Use the selection menu for a better UI experience
    const selectedAnswer = await displaySelectionMenu(
      options,
      questions[idx[i]][0],
      0
    );

    // If user pressed escape, treat as wrong answer but continue
    if (selectedAnswer === -1) {
      continue;
    }

    console.clear();
    console.log(`Question ${i + 1} of ${questions.length}:`);
    console.log(styleText("cyan", questions[idx[i]][0]));
    console.log(""); // Add a blank line

    // Show all options with the correct one highlighted
    for (let j = 0; j < options.length; j++) {
      if (ans[j] === 1) {
        // Correct answer
        console.log(styleText("green", `✓ ${options[j]}`));
      } else if (j === selectedAnswer) {
        // Wrong selected answer
        console.log(styleText("red", `✗ ${options[j]}`));
      } else {
        // Other wrong answers
        console.log(`  ${options[j]}`);
      }
    }

    // Check if answer is correct
    if (ans[selectedAnswer] === 1) {
      console.log("\n" + styleText("green", "Correct!"));
      success++;
    } else {
      console.log("\n" + styleText("red", "Incorrect!"));
    }

    await prompt("\nPress [Enter] to continue...");
  }

  console.clear();
  const successRate = (success / questions.length) * 100;
  console.log(styleText("cyan", "Quiz Complete!"));
  console.log(
    `You answered ${success} out of ${questions.length} questions correctly.`
  );
  console.log(`That is a ${successRate.toFixed(2)}% success rate.`);

  await prompt("\nPress [Enter] to continue...");
  console.clear();

  // Return statistics for this session
  return {
    totalQuestions: questions.length,
    correctAnswers: success,
    averageScore: successRate,
  };
}
