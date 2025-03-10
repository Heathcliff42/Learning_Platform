/*
 * @Author: Lukas Kroczek
 * @Author: Julian Scharf
 * @Date: 2025-02-03
 * @Description: Learning Mode functionality
 * @Version: 1.0.3
 * @LastUpdate: 2025-03-10
 */

import { displaySelectionMenu } from "./displaySelectionMenu.js";
import { MultipleChoiceMode } from "./multipleChoice.js";
import { GapTextMode } from "./gapTextMode.js";
import { FlashcardMode } from "./flashcardMode.js";
import { AIChatMode } from "./aiChatMode.js";

export { LearningMode };

/**
 * Main entry point for Learning Mode
 * @param {Object} db - Database instance
 * @returns {Promise<void>}
 */
async function LearningMode(db) {
  let topicData;
  const modeData = await db.getAllModes();

  while (true) {
    // Mode selection
    const modeIdx = await displaySelectionMenu(
      [...["Back to main menu"], ...modeData],
      "Please select a mode:",
      0
    );

    // Exit condition - User pressed ESC or selected "Back to main menu"
    if (modeIdx === -1 || modeIdx === 0) {
      return;
    }

    // Get the selected mode (accounting for the "Back" option at index 0)
    const actualModeIdx = modeIdx - 1;
    const selectedMode = modeData[actualModeIdx];

    // Get available topics for selected mode
    topicData = await db.getAvailableTopics(selectedMode);

    // Topic selection
    const topicIdx = await displaySelectionMenu(
      [...["Back to mode selection"], ...topicData],
      `Please select a topic for ${selectedMode}:`,
      0
    );

    // If user wants to go back to mode selection or pressed ESC
    if (topicIdx === -1 || topicIdx === 0) {
      continue; // Go back to the top of the while loop (mode selection)
    }

    // Get the selected topic (accounting for the "Back" option at index 0)
    const actualTopicIdx = topicIdx - 1;
    const selectedTopic = topicData[actualTopicIdx];

    try {
      // For Gaptext mode, use the special getGaptexts method
      if (selectedMode === "Gaptext") {
        const gaptexts = await db.getGaptexts(selectedTopic);
        await GapTextMode(gaptexts);
      }
      // For AI Chat, no need to retrieve questions
      else if (selectedMode === "AI Chat") {
        await AIChatMode(selectedTopic);
      }
      // For other modes (Multiple Choice and Flashcard), use getQuestions method
      else {
        const questions = await db.getQuestions(selectedMode, selectedTopic);

        if (selectedMode === "Multiple Choice") {
          await MultipleChoiceMode(questions);
        } else if (selectedMode === "Flashcard") {
          await FlashcardMode(questions);
        }
      }
    } catch (error) {
      console.error(`Error in ${selectedMode} mode:`, error);
    }
  }
}
