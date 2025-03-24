/*
 * @Author: Lukas Kroczek
 * @Author: Julian Scharf
 * @Date: 2025-02-08
 * @Description: Management Mode functionality
 * @Version: 1.0.3
 * @LastUpdate: 2025-03-25
 */

import { displaySelectionMenu, prompt } from "./displaySelectionMenu.js";
import { styleText } from "node:util";
import {
  generateQuestionsWithAI,
  reviewGeneratedQuestions,
  generateGaptextsWithAI,
  reviewGeneratedGaptexts,
} from "./aiQuestionGenerator.js";

export { ManagementMode };

/**
 * Main entry point for Management Mode
 * @param {Object} db - Database instance
 * @returns {Promise<void>}
 */
async function ManagementMode(db) {
  // Start with mode selection - first layer
  await selectMode(db);
}

/**
 * Layer 1: Mode Selection
 * @param {Object} db - Database instance
 * @returns {Promise<void>}
 */
async function selectMode(db) {
  // Get available modes from database
  const availableModes = await db.getAllModes();
  if (!availableModes || availableModes.length === 0) {
    console.log("No modes available in the database.");
    return;
  }

  while (true) {
    console.clear();
    // Add "Exit" option at the beginning
    const modeOptions = ["Exit Management Mode", ...availableModes];

    const modeIdx = await displaySelectionMenu(
      modeOptions,
      "Management Mode - Select a mode to manage:",
      -1
    );

    if (modeIdx === -1 || modeIdx === 0) {
      return; // User wants to exit
    }

    // Selected a valid mode, move to topic selection (layer 2)
    const selectedMode = availableModes[modeIdx - 1];
    await selectTopic(db, selectedMode);
  }
}

/**
 * Layer 2: Topic Selection
 * @param {Object} db - Database instance
 * @param {string} mode - Selected mode
 * @returns {Promise<void>}
 */
async function selectTopic(db, mode) {
  async function getTopicData() {
    // Get available topics for the selected mode
    const topicData = await db.getAvailableTopics(mode);

    if (!topicData || topicData.length === 0) {
      return [];
    }
    return topicData;
  }

  let topicData = await getTopicData();

  while (true) {
    console.clear();
    // Add navigation options at the beginning
    const topicOptions = [
      "Go back to mode selection",
      "Create new topic",
      ...topicData,
    ];

    const topicIdx = await displaySelectionMenu(
      topicOptions,
      `Mode: ${styleText("green", mode)} - Select a topic to manage:`,
      -1
    );

    if (topicIdx === -1 || topicIdx === 0) {
      return; // Go back to mode selection
    }

    if (topicIdx === 1) {
      // Create new topic
      console.clear();
      const newTopicName = await prompt("Enter name for new topic: ");
      if (newTopicName && newTopicName.trim() !== "") {
        try {
          if (mode === "Gaptext") {
            await addGaptext(db, topic);
          } else {
            await addQuestion(db, mode, newTopicName);
          }
          topicData = await getTopicData();
        } catch (error) {
          console.error("Error creating new topic:", error);
          await prompt("Press Enter to continue...");
        }
      }
      continue;
    }

    // Selected a valid topic, move to question management (layer 3)
    const selectedTopic = topicData[topicIdx - 2]; // Adjust for the two navigation options
    const answer = await manageQuestions(db, mode, selectedTopic);
    if (!answer) {
      topicData = await getTopicData();
    }
  }
}

/**
 * Layer 3: Question Management for a specific topic
 * @param {Object} db - Database instance
 * @param {string} mode - Selected mode
 * @param {string} topic - Selected topic
 * @returns {Promise<void>}
 */
async function manageQuestions(db, mode, topic) {
  while (true) {
    console.clear();
    let managementOptions = [
      "Go back to topic selection",
      "View and edit questions",
    ];

    // Determine which options to show based on the mode
    if (mode === "Gaptext") {
      managementOptions.push("Add new gaptext", "Generate gaptexts with AI");
    } else {
      managementOptions.push("Add new question", "Generate questions with AI");
    }

    managementOptions.push("Rename this topic", "Delete this topic");

    const actionIdx = await displaySelectionMenu(
      managementOptions,
      `Mode: ${styleText("green", mode)} | Topic: ${styleText(
        "blue",
        topic
      )} - Choose an action:`,
      -1
    );

    if (actionIdx === -1 || actionIdx === 0) {
      return; // Go back to topic selection
    }

    switch (actionIdx) {
      case 1: // Edit questions/gaptexts
        if (mode === "Gaptext") {
          await editGaptexts(db, topic);
        } else {
          await editQuestions(db, mode, topic);
        }
        break;

      case 2: // Add new question/gaptext
        if (mode === "Gaptext") {
          await addGaptext(db, topic);
        } else {
          await addQuestion(db, mode, topic);
        }
        break;

      case 3: // Generate with AI
        if (mode === "Gaptext") {
          await generateAIGaptexts(db, topic);
        } else {
          await generateAIQuestions(db, mode, topic);
        }
        break;

      case 4: // Rename topic
        const newName = await prompt(`Enter new name for topic "${topic}": `);
        if (newName && newName.trim() !== "") {
          try {
            await db.renameCategory(topic, newName);
            console.log(
              `Topic renamed from "${topic}" to "${newName}" successfully`
            );
            topic = newName; // Update the current topic name
          } catch (error) {
            console.error("Error renaming topic:", error);
          }
          await prompt("Press Enter to continue...");
        }
        break;

      case 5: // Delete topic
        await deleteTopic(db, topic);
        return "DELETE";
    }
  }
}

/**
 * Layer 4: Edit questions within a topic
 * @param {Object} db - Database instance
 * @param {string} mode - Selected mode
 * @param {string} topic - Selected topic
 * @returns {Promise<void>}
 */
async function editQuestions(db, mode, topic) {
  // Get questions for this topic and mode
  const questions = await db.getQuestions(mode, topic);

  if (!questions || questions.length === 0) {
    console.log(
      `No questions available for topic "${topic}" in mode "${mode}".`
    );
    await prompt("Press Enter to continue...");
    return;
  }

  // Apply styling to questions for better display
  const displayQuestions = questions.map((q) => {
    return [
      styleText("blue", q[0]), // Question in blue
      styleText("green", q[1]), // Correct answer in green
      q[2],
      q[3],
      q[4], // Wrong answers in normal text
    ];
  });

  while (true) {
    console.clear();
    // Show questions with a back option
    const options = [
      "Go back to topic management",
      ...displayQuestions.map((q) => `${q[0]},${q[1]},${q[2]},${q[3]},${q[4]}`),
    ];

    const questionIdx = await displaySelectionMenu(
      options,
      `Mode: ${styleText("green", mode)} | Topic: ${styleText(
        "blue",
        topic
      )} - Select a question to edit:`,
      -1
    );

    if (questionIdx === -1 || questionIdx === 0) {
      return; // Go back to topic management
    }

    // Edit the selected question - layer 4
    const selectedQuestionIdx = questionIdx - 1;
    await editSingleQuestion(db, mode, topic, questions, selectedQuestionIdx);

    // Refresh questions after editing
    const updatedQuestions = await db.getQuestions(mode, topic);
    questions.splice(0, questions.length, ...updatedQuestions);

    // Update display questions
    displayQuestions.splice(0, displayQuestions.length);
    questions.forEach((q) => {
      displayQuestions.push([
        styleText("blue", q[0]),
        styleText("green", q[1]),
        q[2],
        q[3],
        q[4],
      ]);
    });
  }
}

/**
 * Layer 4: Edit a single question
 * @param {Object} db - Database instance
 * @param {string} mode - Selected mode
 * @param {string} topic - Selected topic
 * @param {Array} questions - List of questions
 * @param {number} questionIdx - Index of the question to edit
 * @returns {Promise<void>}
 */
async function editSingleQuestion(db, mode, topic, questions, questionIdx) {
  const question = questions[questionIdx];

  while (true) {
    console.clear();

    // Define edit options
    const editOptions = [
      "Go back to question list",
      `Edit question text:  ${styleText("blue", question[0])}`,
      `Edit correct answer: ${styleText("green", question[1])}`,
      `Edit wrong answer 1: ${question[2]}`,
      `Edit wrong answer 2: ${question[3]}`,
      `Edit wrong answer 3: ${question[4]}`,
      "Delete this question",
    ];

    const editChoice = await displaySelectionMenu(
      editOptions,
      "Select what you want to edit:",
      -1
    );

    if (editChoice === -1 || editChoice === 0) {
      return; // Go back to question list
    }

    if (editChoice === 6) {
      // Delete question
      const confirmation = await prompt(
        "Are you sure you want to delete this question? (y/n): "
      );
      if (confirmation.toLowerCase() === "y") {
        try {
          // TODO: Implement proper question deletion in the database class
          // For now, we'll replace with a placeholder to indicate deletion
          const oldQuestion = [...question];
          question[0] = "DELETED - " + question[0];
          await db.editQuestion(oldQuestion, question);
          console.log("Question marked for deletion.");
          await prompt("Press Enter to continue...");
          return; // Go back after deletion
        } catch (error) {
          console.error("Error deleting question:", error);
          await prompt("Press Enter to continue...");
        }
      }
      continue;
    }

    // Edit the selected field
    const fieldIdx = editChoice - 1;
    const fieldNames = [
      "question",
      "correct answer",
      "wrong answer 1",
      "wrong answer 2",
      "wrong answer 3",
    ];

    const oldValue = question[fieldIdx];
    const newValue = await prompt(
      `Enter new ${fieldNames[fieldIdx]} (current: ${oldValue}): `
    );

    if (newValue && newValue.trim() !== "") {
      // Save the old question for database update
      const oldQuestion = [...question];
      question[fieldIdx] = newValue;

      try {
        await db.editQuestion(oldQuestion, question);
        console.log(`${fieldNames[fieldIdx]} updated successfully.`);
      } catch (error) {
        // Revert the change on error
        question[fieldIdx] = oldValue;
        console.error("Error updating question:", error);
      }
      await prompt("Press Enter to continue...");
    }
  }
}

/**
 * Edit gaptexts for a specific topic
 * @param {Object} db - Database instance
 * @param {string} topic - Selected topic
 * @returns {Promise<void>}
 */
async function editGaptexts(db, topic) {
  // Get gaptexts for this topic
  const gaptexts = await db.getGaptexts(topic);

  if (!gaptexts || gaptexts.length === 0) {
    console.log(`No gaptexts available for topic "${topic}".`);
    await prompt("Press Enter to continue...");
    return;
  }

  // Format gaptexts for display - show first 40 chars of text and solution
  const displayGaptexts = gaptexts.map((g) => {
    const textPreview = g[0].length > 40 ? g[0].substring(0, 40) + "..." : g[0];
    return `${styleText("blue", textPreview)} | ${styleText("green", g[1])}`;
  });

  while (true) {
    console.clear();
    // Show gaptexts with a back option
    const options = ["Go back to topic management", ...displayGaptexts];

    const gaptextIdx = await displaySelectionMenu(
      options,
      `Gaptext Mode | Topic: ${styleText(
        "blue",
        topic
      )} - Select a gaptext to edit:`,
      -1
    );

    if (gaptextIdx === -1 || gaptextIdx === 0) {
      return; // Go back to topic management
    }

    // Edit the selected gaptext
    const selectedGaptextIdx = gaptextIdx - 1;
    await editSingleGaptext(db, topic, gaptexts, selectedGaptextIdx);

    // Refresh gaptexts after editing
    const updatedGaptexts = await db.getGaptexts(topic);
    gaptexts.splice(0, gaptexts.length, ...updatedGaptexts);

    // Update display gaptexts
    displayGaptexts.splice(0, displayGaptexts.length);
    gaptexts.forEach((g) => {
      const textPreview =
        g[0].length > 40 ? g[0].substring(0, 40) + "..." : g[0];
      displayGaptexts.push(
        `${styleText("blue", textPreview)} | ${styleText("green", g[1])}`
      );
    });
  }
}

/**
 * Edit a single gaptext
 * @param {Object} db - Database instance
 * @param {string} topic - Selected topic
 * @param {Array} gaptexts - List of gaptexts
 * @param {number} gaptextIdx - Index of the gaptext to edit
 * @returns {Promise<void>}
 */
async function editSingleGaptext(db, topic, gaptexts, gaptextIdx) {
  const gaptext = gaptexts[gaptextIdx];

  while (true) {
    console.clear();
    console.log(
      styleText("cyan", `Editing Gaptext - Topic: ${styleText("blue", topic)}`)
    );

    // Show current gaptext
    console.log("\nCurrent Gaptext:");
    console.log(styleText("blue", "Text: ") + gaptext[0]);
    console.log(styleText("green", "Solution: ") + gaptext[1]);
    console.log();

    // Define edit options
    const editOptions = [
      "Go back to gaptext list",
      "Edit text",
      "Edit solution",
      "Delete this gaptext",
    ];

    const editChoice = await displaySelectionMenu(
      editOptions,
      "Select what you want to edit:",
      -1
    );

    if (editChoice === -1 || editChoice === 0) {
      return; // Go back to gaptext list
    }

    if (editChoice === 3) {
      // Delete gaptext
      const confirmation = await prompt(
        "Are you sure you want to delete this gaptext? (y/n): "
      );
      if (confirmation.toLowerCase() === "y") {
        try {
          await db.deleteGaptext(gaptext[0], gaptext[1]);
          console.log("Gaptext deleted successfully.");
          await prompt("Press Enter to continue...");
          return; // Go back after deletion
        } catch (error) {
          console.error("Error deleting gaptext:", error);
          await prompt("Press Enter to continue...");
        }
      }
      continue;
    }

    // Edit the selected field
    const fieldIdx = editChoice - 1;
    const fieldNames = ["text", "solution"];

    const oldValue = gaptext[fieldIdx];

    // For text, provide a larger input area
    if (fieldIdx === 0) {
      console.log(styleText("yellow", "\nCurrent text:"));
      console.log(oldValue);
      console.log(
        styleText("yellow", "\nEnter new text (blank line to finish):")
      );

      let newText = "";
      let line;
      while ((line = await prompt("> ")) !== "") {
        newText += (newText ? "\n" : "") + line;
      }

      if (newText) {
        // Save the old gaptext for database update
        const oldGaptext = [...gaptext];
        gaptext[fieldIdx] = newText;

        try {
          await db.editGaptext(oldGaptext, gaptext);
          console.log(`Gaptext ${fieldNames[fieldIdx]} updated successfully.`);
        } catch (error) {
          // Revert the change on error
          gaptext[fieldIdx] = oldValue;
          console.error("Error updating gaptext:", error);
        }
        await prompt("Press Enter to continue...");
      }
    } else {
      // For solution, simpler input
      const newValue = await prompt(
        `Enter new ${fieldNames[fieldIdx]} (current: ${oldValue}): `
      );

      if (newValue && newValue.trim() !== "") {
        // Save the old gaptext for database update
        const oldGaptext = [...gaptext];
        gaptext[fieldIdx] = newValue;

        try {
          await db.editGaptext(oldGaptext, gaptext);
          console.log(`Gaptext ${fieldNames[fieldIdx]} updated successfully.`);
        } catch (error) {
          // Revert the change on error
          gaptext[fieldIdx] = oldValue;
          console.error("Error updating gaptext:", error);
        }
        await prompt("Press Enter to continue...");
      }
    }
  }
}

/**
 * Add a new gaptext to a topic
 * @param {Object} db - Database instance
 * @param {string} topic - Selected topic
 * @returns {Promise<void>}
 */
async function addGaptext(db, topic) {
  console.clear();
  console.log(
    styleText("cyan", `Adding New Gaptext - Topic: ${styleText("blue", topic)}`)
  );
  console.log(
    styleText("yellow", "\nEnter text with [gaps] in square brackets:")
  );
  console.log("Example: The capital of France is [Paris].");
  console.log("\nType your text (empty line to finish):");

  let gaptextWithGaps = "";
  let line;
  while ((line = await prompt("> ")) !== "") {
    gaptextWithGaps += (gaptextWithGaps ? "\n" : "") + line;
  }

  if (!gaptextWithGaps || gaptextWithGaps.trim() === "") {
    console.log("Cancelled adding new gaptext.");
    await prompt("Press Enter to continue...");
    return;
  }

  // Extract solutions from the text
  const matches = gaptextWithGaps.match(/\[([^\]]+)\]/g) || [];

  if (matches.length === 0) {
    console.log(
      styleText(
        "red",
        "Error: No gaps found in the text. Use [square brackets] to mark gaps."
      )
    );
    await prompt("Press Enter to continue...");
    return;
  }

  // Create the gaptext and solution
  const gapTextForDB = gaptextWithGaps.replace(/\[([^\]]+)\]/g, "_____");
  const solutionText = matches.map((match) => match.slice(1, -1)).join("|");

  try {
    await db.saveGaptexts([[gapTextForDB, solutionText]], topic);
    console.log(styleText("green", "Gaptext added successfully!"));
    console.log("\nStored as:");
    console.log(styleText("blue", "Text: ") + gapTextForDB);
    console.log(styleText("green", "Solution: ") + solutionText);
  } catch (error) {
    console.error("Error adding gaptext:", error);
  }

  await prompt("\nPress Enter to continue...");
}

/**
 * Add a new question to a topic
 * @param {Object} db - Database instance
 * @param {string} mode - Selected mode
 * @param {string} topic - Selected topic
 * @returns {Promise<void>}
 */
async function addQuestion(db, mode, topic) {
  console.clear();
  console.log(
    `Adding new question to Mode: ${styleText(
      "green",
      mode
    )} | Topic: ${styleText("blue", topic)}\n`
  );

  const question = await prompt(
    "Enter question text (or type 'cancel' to go back): "
  );

  if (!question || question.toLowerCase() === "cancel") {
    return;
  }

  const correctAnswer = await prompt("Enter correct answer: ");
  const wrongAnswer1 = await prompt("Enter wrong answer 1: ");
  const wrongAnswer2 = await prompt("Enter wrong answer 2: ");
  const wrongAnswer3 = await prompt("Enter wrong answer 3: ");

  const newQuestion = [
    question,
    correctAnswer,
    wrongAnswer1,
    wrongAnswer2,
    wrongAnswer3,
  ];

  try {
    await db.saveQuestions([newQuestion], topic, mode);
    console.log("Question added successfully.");
  } catch (error) {
    console.error("Error adding question:", error);
  }

  await prompt("Press Enter to continue...");
}

/**
 * Deletes a topic and all its associated questions
 * @param {Object} db - Database instance
 * @param {string} topic - Topic to delete
 * @returns {Promise<void>}
 */
async function deleteTopic(db, topic) {
  console.clear();
  const answer = await prompt(
    `Are you sure you want to delete the topic "${styleText(
      "blue",
      topic
    )}" with all Questions?(y/n)`
  );
  if (answer === "y") {
    try {
      const TopicData = await db.getTopicByName(topic);

      await db.deleteQuestionByTopcID(TopicData.id).then((deletedRows) => {
        console.log(`${deletedRows} Questions got deleted`);
      });
      db.deleteTopicByName(topic);
      await prompt("topic and all questions got deleted");
    } catch (error) {
      console.log(error);
      await prompt("Something went wrong");
    }
  }
}

/**
 * Generate questions using AI
 * @param {Object} db - Database instance
 * @param {string} mode - Selected mode
 * @param {string} topic - Selected topic
 * @returns {Promise<void>}
 */
async function generateAIQuestions(db, mode, topic) {
  console.clear();
  console.log(styleText("cyan", "AI Question Generator"));
  console.log(
    `Generating questions for Mode: ${styleText(
      "green",
      mode
    )} | Topic: ${styleText("blue", topic)}\n`
  );

  try {
    // Check if OpenAI API key is set
    if (!process.env.OPENAI_API_KEY) {
      console.log(styleText("red", "ERROR: OpenAI API key not found!"));
      console.log("Please set your OPENAI_API_KEY environment variable.");
      await prompt("Press Enter to continue...");
      return;
    }

    // Get existing questions to avoid duplicates
    const existingQuestions = await db.getQuestions(mode, topic);

    if (!existingQuestions) {
      console.log(
        styleText(
          "yellow",
          "No existing questions found. Creating new questions from scratch."
        )
      );
    } else {
      console.log(
        styleText(
          "green",
          `Found ${existingQuestions.length} existing questions for this topic.`
        )
      );
    }

    // Select number of questions to generate
    const questionCount = await selectQuestionCount();

    // Generate questions
    const generatedQuestions = await generateQuestionsWithAI(
      topic,
      existingQuestions || [],
      questionCount
    );

    if (!generatedQuestions || generatedQuestions.length === 0) {
      console.log(styleText("red", "No questions were generated."));
      await prompt("Press Enter to continue...");
      return;
    }

    // Review and save questions
    console.log(
      styleText(
        "green",
        `Successfully generated ${generatedQuestions.length} questions!`
      )
    );
    console.log("Let's review them before saving to the database.");
    await prompt("Press Enter to review questions...");

    const selectedQuestions = await reviewGeneratedQuestions(
      generatedQuestions
    );

    if (selectedQuestions.length === 0) {
      console.log(styleText("yellow", "No questions were selected to save."));
      await prompt("Press Enter to continue...");
      return;
    }

    // Save selected questions to database
    await db.saveQuestions(selectedQuestions, topic, mode);
    console.log(
      styleText(
        "green",
        `${selectedQuestions.length} questions saved successfully!`
      )
    );
  } catch (error) {
    console.log(
      styleText("red", `Error generating questions: ${error.message}`)
    );
  }

  await prompt("Press Enter to continue...");
}

/**
 * Generate gaptexts using AI
 * @param {Object} db - Database instance
 * @param {string} topic - Selected topic
 * @returns {Promise<void>}
 */
async function generateAIGaptexts(db, topic) {
  console.clear();
  console.log(styleText("cyan", "AI Gaptext Generator"));
  console.log(`Generating gaptexts for Topic: ${styleText("blue", topic)}\n`);

  try {
    // Check if OpenAI API key is set
    if (!process.env.OPENAI_API_KEY) {
      console.log(styleText("red", "ERROR: OpenAI API key not found!"));
      console.log("Please set your OPENAI_API_KEY environment variable.");
      await prompt("Press Enter to continue...");
      return;
    }

    // Get existing gaptexts to avoid duplicates
    const existingGaptexts = await db.getGaptexts(topic);

    if (!existingGaptexts) {
      console.log(
        styleText(
          "yellow",
          "No existing gaptexts found. Creating new gaptexts from scratch."
        )
      );
    } else {
      console.log(
        styleText(
          "green",
          `Found ${existingGaptexts.length} existing gaptexts for this topic.`
        )
      );
    }

    // Select number of gaptexts to generate
    const gaptextCount = await selectGaptextCount();

    // Generate gaptexts
    const generatedGaptexts = await generateGaptextsWithAI(
      topic,
      existingGaptexts || [],
      gaptextCount
    );

    if (!generatedGaptexts || generatedGaptexts.length === 0) {
      console.log(styleText("red", "No gaptexts were generated."));
      await prompt("Press Enter to continue...");
      return;
    }

    // Review and save gaptexts
    console.log(
      styleText(
        "green",
        `Successfully generated ${generatedGaptexts.length} gaptexts!`
      )
    );
    console.log("Let's review them before saving to the database.");
    await prompt("Press Enter to review gaptexts...");

    const selectedGaptexts = await reviewGeneratedGaptexts(generatedGaptexts);

    if (selectedGaptexts.length === 0) {
      console.log(styleText("yellow", "No gaptexts were selected to save."));
      await prompt("Press Enter to continue...");
      return;
    }

    // Save selected gaptexts to database
    await db.saveGaptexts(selectedGaptexts, topic);
    console.log(
      styleText(
        "green",
        `${selectedGaptexts.length} gaptexts saved successfully!`
      )
    );
  } catch (error) {
    console.log(
      styleText("red", `Error generating gaptexts: ${error.message}`)
    );
  }

  await prompt("Press Enter to continue...");
}

/**
 * Helper function for selectQuestionCount
 * Imported from aiQuestionGenerator.js for convenience
 */
async function selectQuestionCount() {
  console.clear();
  const questionCountOptions = ["5", "10", "15", "20"];

  const selectedIndex = await displaySelectionMenu(
    questionCountOptions,
    styleText("cyan", "How many questions would you like to generate?") +
      "\n------------------------------------------",
    0 // Default to 5 questions (index 0)
  );

  // Check if user canceled
  if (selectedIndex === -1) {
    console.log(
      styleText(
        "yellow",
        "Selection cancelled. Using default count (5 questions)."
      )
    );
    return 5;
  }

  return parseInt(questionCountOptions[selectedIndex]);
}

/**
 * Helper function for selecting gaptext count
 */
async function selectGaptextCount() {
  console.clear();
  const gaptextCountOptions = ["3", "5", "7", "10"];

  const selectedIndex = await displaySelectionMenu(
    gaptextCountOptions,
    styleText("cyan", "How many gaptexts would you like to generate?") +
      "\n------------------------------------------",
    1 // Default to 5 gaptexts (index 1)
  );

  // Check if user canceled
  if (selectedIndex === -1) {
    console.log(
      styleText(
        "yellow",
        "Selection cancelled. Using default count (5 gaptexts)."
      )
    );
    return 5;
  }

  return parseInt(gaptextCountOptions[selectedIndex]);
}
