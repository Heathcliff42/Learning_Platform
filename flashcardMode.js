/*
 * @Author: Lukas Kroczek
 * @Date: 2025-03-07
 * @Description: Flashcard functionality for Learning Mode
 * @Version: 1.0.1
 * @LastUpdate: 2025-03-24
 */

import { styleText } from "node:util";
import { prompt } from "./displaySelectionMenu.js";

/**
 * Implements the flashcard mode functionality
 * @param {Array} questions - Array of question data
 * @returns {Promise<Object>} - Statistics from the session
 */
export async function flashcardMode(questions) {
  let idx = [];
  let selfRatedSuccess = 0;

  // Randomize flashcard order
  for (let i = 0; i < questions.length; i++) {
    Math.random() > 0.5 ? idx.push(i) : idx.unshift(i);
  }

  console.log(styleText("cyan", "Flashcard Mode Instructions:"));
  console.log("Each flashcard will show the front side first.");
  console.log("Press [Enter] to flip the card and see the answer.");
  console.log("After seeing the answer, press [Enter] to go to the next card.");
  prompt("\nPress [Enter] to begin...");

  for (let i = 0; i < questions.length; i++) {
    // Front side of flashcard (question)
    console.clear();
    console.log(`Card ${i + 1} of ${questions.length}`);
    console.log("─".repeat(30));
    console.log(styleText("yellow", "\nQuestion:"));
    console.log(questions[idx[i]][0]);
    prompt("\nPress [Enter] to reveal answer...");

    // Back side of flashcard (answer)
    console.clear();
    console.log(`Card ${i + 1} of ${questions.length}`);
    console.log("─".repeat(30));
    console.log(styleText("yellow", "\nQuestion:"));
    console.log(questions[idx[i]][0]);
    console.log(styleText("green", "\nAnswer:"));
    console.log(questions[idx[i]][1]);

    if (i < questions.length - 1) {
      prompt("\nPress [Enter] for next card...");
    } else {
      prompt("\nPress [Enter] to finish flashcard review...");
    }
  }

  // After the last card, ask users to rate their own performance
  console.clear();
  console.log(styleText("cyan", "Flashcard Review Complete!"));
  console.log("How many flashcards do you think you knew correctly?");
  const userInput = await prompt(`Enter a number (0-${questions.length}): `);

  // Parse user input, with validation
  const parsedInput = parseInt(userInput);
  if (
    !isNaN(parsedInput) &&
    parsedInput >= 0 &&
    parsedInput <= questions.length
  ) {
    selfRatedSuccess = parsedInput;
  } else {
    console.log(
      styleText("yellow", "Invalid input. Assuming 50% success rate.")
    );
    selfRatedSuccess = Math.floor(questions.length / 2);
  }

  const successRate = (selfRatedSuccess / questions.length) * 100;
  console.log(
    `\nYou reported knowing ${selfRatedSuccess} out of ${questions.length} flashcards.`
  );
  console.log(`That is a ${successRate.toFixed(2)}% self-rated success rate.`);

  await prompt("\nPress [Enter] to continue...");
  console.clear();

  // Return statistics for this session
  return {
    totalQuestions: questions.length,
    correctAnswers: selfRatedSuccess,
    averageScore: successRate,
  };
}
