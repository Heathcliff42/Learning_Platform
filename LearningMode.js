/*
 * @Author: Lukas Kroczek
 * @Author: Julian Scharf
 * @Date: 2025-02-03
 * @Description: Learning Mode functionality
 * @Version: 1.0.4
 * @LastUpdate: 2025-03-24
 */

import { displaySelectionMenu, prompt } from "./displaySelectionMenu.js";
import { MultipleChoiceMode } from "./multipleChoice.js";
import { GapTextMode } from "./gapTextMode.js";
import { FlashcardMode } from "./flashcardMode.js";
import { AIChatMode } from "./aiChatMode.js";

export { LearningMode };

/**
 * Main entry point for Learning Mode
 * @param {Object} db - Database instance
 * @param {number} userId - Current user ID
 * @returns {Promise<void>}
 */
async function LearningMode(db, userId) {
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

    // Topic selection - Add "Custom topic" option for AI Chat mode
    const topicSelectionOptions = [...["Back to mode selection"], ...topicData];
    if (selectedMode === "AI Chat") {
      topicSelectionOptions.push("Custom topic");
    }

    const topicIdx = await displaySelectionMenu(
      topicSelectionOptions,
      `Please select a topic for ${selectedMode}:`,
      0
    );

    // If user wants to go back to mode selection or pressed ESC
    if (topicIdx === -1 || topicIdx === 0) {
      continue; // Go back to the top of the while loop (mode selection)
    }

    // Handle custom topic option for AI Chat mode
    let selectedTopic;

    if (
      selectedMode === "AI Chat" &&
      topicIdx === topicSelectionOptions.length - 1
    ) {
      // User selected "Custom topic" option
      selectedTopic = await prompt("Enter your custom topic: ");
      if (!selectedTopic) {
        console.log("No topic entered. Returning to topic selection.");
        continue;
      }
    } else {
      // Get the selected topic (accounting for the "Back" option at index 0)
      const actualTopicIdx = topicIdx - 1;
      selectedTopic = topicData[actualTopicIdx];
    }

    try {
      let results = null;

      // For Gaptext mode, use the special getGaptexts method
      if (selectedMode === "Gaptext") {
        const gaptexts = await db.getGaptexts(selectedTopic);
        results = await GapTextMode(gaptexts);
      }
      // For AI Chat, no need to retrieve questions
      else if (selectedMode === "AI Chat") {
        results = await AIChatMode(selectedTopic);
      }
      // For other modes (Multiple Choice and Flashcard), use getQuestions method
      else {
        const questions = await db.getQuestions(selectedMode, selectedTopic);

        if (selectedMode === "Multiple Choice") {
          results = await MultipleChoiceMode(questions);
        } else if (selectedMode === "Flashcard") {
          results = await FlashcardMode(questions);
        }
      }

      // Update statistics if results are available
      if (results && userId) {
        await db.updateStatistics(
          userId,
          selectedMode,
          selectedTopic,
          results.totalQuestions,
          results.correctAnswers,
          results.averageScore
        );
      }
    } catch (error) {
      console.error(`Error in ${selectedMode} mode:`, error);
    }
  }
}
