/*
 * @Author: Lukas Kroczek
 * @Date: 2025-03-07
 * @Description: Flashcard functionality for Learning Mode
 * @Version: 1.0.0
 * @LastUpdate: 2025-03-07
 */

import { styleText } from "node:util";
import { prompt } from "./displaySelectionMenu.js";

/**
 * Implements the flashcard mode functionality
 * @param {Array} questions - Array of question data
 * @returns {void}
 */
export function FlashcardMode(questions) {
  let idx = [];
  
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
  
  console.clear();
  console.log(styleText("cyan", "Flashcard Review Complete!"));
  prompt("Press [Enter] to return to the main menu...");
  console.clear();
}
