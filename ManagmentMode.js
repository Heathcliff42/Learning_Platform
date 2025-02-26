import { displaySelectionMenu, prompt } from "./displaySelectionMenu.js";
import { styleText } from "node:util";

export { ManagementMode };

/**
 * Main entry point for Management Mode
 */
async function ManagementMode(db) {
  // Start with mode selection - first layer
  await selectMode(db);
}

/**
 * Layer 1: Mode Selection
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
 */
async function selectTopic(db, mode) {
  // Get available topics for the selected mode
  const topicData = await db.getAvailableTopics(mode);
  
  if (!topicData || topicData.length === 0) {
    console.log(`No topics available for mode "${mode}".`);
    prompt("Press Enter to continue...");
    return; // Go back to mode selection
  }
  
  while (true) {
    console.clear();
    // Add navigation options at the beginning
    const topicOptions = ["Go back to mode selection", "Create new topic", ...topicData];
    
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
      const newTopicName = prompt("Enter name for new topic: ");
      if (newTopicName && newTopicName.trim() !== "") {
        try {
          // Create topic by saving a placeholder question
          const placeholderQuestion = ["(Placeholder question)", "(Answer)", "(Wrong 1)", "(Wrong 2)", "(Wrong 3)"];
          await db.saveQuestions([placeholderQuestion], newTopicName, mode);
          console.log(`Topic "${newTopicName}" created successfully.`);
          prompt("Press Enter to continue...");
        } catch (error) {
          console.error("Error creating new topic:", error);
          prompt("Press Enter to continue...");
        }
      }
      continue;
    }
    
    // Selected a valid topic, move to question management (layer 3)
    const selectedTopic = topicData[topicIdx - 3]; // Adjust for the two navigation options
    await manageQuestions(db, mode, selectedTopic);
  }
}

/**
 * Layer 3: Question Management for a specific topic
 */
async function manageQuestions(db, mode, topic) {
  while (true) {
    console.clear();
    const managementOptions = [
      "Go back to topic selection",
      "View and edit questions",
      "Add new question",
      "Rename this topic",
      "Delete this topic (not implemented)"
    ];
    
    const actionIdx = await displaySelectionMenu(
      managementOptions,
      `Mode: ${styleText("green", mode)} | Topic: ${styleText("blue", topic)} - Choose an action:`,
      -1
    );
    
    if (actionIdx === -1 || actionIdx === 0) {
      return; // Go back to topic selection
    }
    
    switch (actionIdx) {
      case 1: // Edit questions
        await editQuestions(db, mode, topic);
        break;
      
      case 2: // Add question
        await addQuestion(db, mode, topic);
        break;
      
      case 3: // Rename topic
        const newName = prompt(`Enter new name for topic "${topic}": `);
        if (newName && newName.trim() !== "") {
          try {
            await db.renameCategory(topic, newName);
            console.log(`Topic renamed from "${topic}" to "${newName}" successfully`);
            topic = newName; // Update the current topic name
          } catch (error) {
            console.error("Error renaming topic:", error);
          }
          prompt("Press Enter to continue...");
        }
        break;
        
      case 4: // Delete topic (not implemented)
        console.log("This feature is not implemented yet.");
        prompt("Press Enter to continue...");
        break;
    }
  }
}

/**
 * Layer 4: Edit questions within a topic
 */
async function editQuestions(db, mode, topic) {
  // Get questions for this topic and mode
  const questions = await db.getQuestions(mode, topic);
  
  if (!questions || questions.length === 0) {
    console.log(`No questions available for topic "${topic}" in mode "${mode}".`);
    prompt("Press Enter to continue...");
    return;
  }
  
  // Apply styling to questions for better display
  const displayQuestions = questions.map(q => {
    return [
      styleText("blue", q[0]), // Question in blue
      styleText("green", q[1]), // Correct answer in green
      q[2], q[3], q[4]         // Wrong answers in normal text
    ];
  });
  
  while (true) {
    console.clear();
    // Show questions with a back option
    const options = ["Go back to topic management", ...displayQuestions.map(q => q[0])];
    
    const questionIdx = await displaySelectionMenu(
      options,
      `Mode: ${styleText("green", mode)} | Topic: ${styleText("blue", topic)} - Select a question to edit:`,
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
    questions.forEach(q => {
      displayQuestions.push([
        styleText("blue", q[0]), 
        styleText("green", q[1]),
        q[2], q[3], q[4]
      ]);
    });
  }
}

/**
 * Layer 4: Edit a single question
 */
async function editSingleQuestion(db, mode, topic, questions, questionIdx) {
  const question = questions[questionIdx];
  
  while (true) {
    console.clear();
    console.log(`Editing question in Mode: ${styleText("green", mode)} | Topic: ${styleText("blue", topic)}\n`);
    
    // Display the current question
    console.log(`Question: ${styleText("blue", question[0])}`);
    console.log(`Correct answer: ${styleText("green", question[1])}`);
    console.log(`Wrong answer 1: ${question[2]}`);
    console.log(`Wrong answer 2: ${question[3]}`);
    console.log(`Wrong answer 3: ${question[4]}`);
    console.log("\n");
    
    // Define edit options
    const editOptions = [
      "Go back to question list",
      "Edit question text",
      "Edit correct answer",
      "Edit wrong answer 1",
      "Edit wrong answer 2",
      "Edit wrong answer 3",
      "Delete this question"
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
      const confirmation = prompt("Are you sure you want to delete this question? (y/n): ");
      if (confirmation.toLowerCase() === 'y') {
        try {
          // TODO: Implement proper question deletion in the database class
          // For now, we'll replace with a placeholder to indicate deletion
          const oldQuestion = [...question];
          question[0] = "DELETED - " + question[0];
          await db.editQuestion(oldQuestion, question);
          console.log("Question marked for deletion.");
          prompt("Press Enter to continue...");
          return; // Go back after deletion
        } catch (error) {
          console.error("Error deleting question:", error);
          prompt("Press Enter to continue...");
        }
      }
      continue;
    }
    
    // Edit the selected field
    const fieldIdx = editChoice - 1;
    const fieldNames = ["question", "correct answer", "wrong answer 1", "wrong answer 2", "wrong answer 3"];
    
    const oldValue = question[fieldIdx];
    const newValue = prompt(`Enter new ${fieldNames[fieldIdx]} (current: ${oldValue}): `);
    
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
      prompt("Press Enter to continue...");
    }
  }
}

/**
 * Add a new question to a topic
 */
async function addQuestion(db, mode, topic) {
  console.clear();
  console.log(`Adding new question to Mode: ${styleText("green", mode)} | Topic: ${styleText("blue", topic)}\n`);
  
  const question = prompt("Enter question text (or type 'cancel' to go back): ");
  
  if (!question || question.toLowerCase() === 'cancel') {
    return;
  }
  
  const correctAnswer = prompt("Enter correct answer: ");
  const wrongAnswer1 = prompt("Enter wrong answer 1: ");
  const wrongAnswer2 = prompt("Enter wrong answer 2: ");
  const wrongAnswer3 = prompt("Enter wrong answer 3: ");
  
  const newQuestion = [question, correctAnswer, wrongAnswer1, wrongAnswer2, wrongAnswer3];
  
  try {
    await db.saveQuestions([newQuestion], topic, mode);
    console.log("Question added successfully.");
  } catch (error) {
    console.error("Error adding question:", error);
  }
  
  prompt("Press Enter to continue...");
}
