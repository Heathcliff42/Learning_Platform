/*
 * @Author: Lukas Kroczek
 * @Author: Julian Scharf
 * @Date: 2025-02-03
 * @Description: Learning Mode functionality
 * @Version: 1.0.1
 * @LastUpdate: 2025-03-05
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
  let indexOutOfRange;
  let topicIdx = -1;
  let modeIdx = -1;
  let topicData;
  const modeData = await db.getAllModes(); // Updated to use promise

  while (true) {
    indexOutOfRange = true;
    while (indexOutOfRange) {
      modeIdx = await displaySelectionMenu(
        [...["Choose another mode of operation"], ...modeData],
        "Please select a mode:",
        -1
      );
      if (modeIdx === -1) {
        break;
      }
      topicData = await db.getAvailableTopics(modeData[modeIdx]); // Updated to use promise
      topicIdx = await displaySelectionMenu(
        [...["Choose another mode"], ...topicData],
        "Please select a topic:",
        -1
      );
      indexOutOfRange =
        0 <= topicIdx && topicIdx < topicData.length ? false : true;
    }
    if (modeIdx === -1) {
      break;
    }
    const questions = await db.getQuestions(
      modeData[modeIdx],
      topicData[topicIdx]
    ); // Updated to use promise
    switch (modeIdx) {
      case 0:
        MultipleChoiceMode(questions);
        break;
      case 1:
        GapTextMode(questions);
        break;
      case 2:
        FlashcardMode(questions);
        break;
      case 3:
        await AIChatMode(questions);
        break;
      default:
        // Index out of range, try again or exit
        break;
    }
  }
}
