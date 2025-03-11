/*
 * @Author: Lukas Kroczek
 * @Date: 2025-03-07
 * @Description: AI Chat functionality for Learning Mode
 * @Version: 1.0.1
 * @LastUpdate: 2025-03-12
 */

import { styleText } from "node:util";
import { prompt, displaySelectionMenu } from "./displaySelectionMenu.js";
import OpenAI from "openai";

// Securely access the OpenAI API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define difficulty levels and their descriptions
const DIFFICULTY_LEVELS = {
  easy: "Basic knowledge questions suitable for beginners",
  medium: "Moderate complexity questions for intermediate learners",
  hard: "Advanced questions requiring detailed knowledge",
  expert: "Expert-level questions that challenge even subject matter experts",
  adaptive: "Dynamically adjusts difficulty based on your performance"
};

// Define numerical values for each difficulty level for adaptive mode
const DIFFICULTY_VALUES = {
  easy: 1,
  medium: 2,
  hard: 3,
  expert: 4
};

/**
 * Prompts the user to select a difficulty level using the selection menu
 * @returns {Promise<string>} The selected difficulty level
 */
async function selectDifficulty() {
  console.clear();
  const difficultyKeys = Object.keys(DIFFICULTY_LEVELS);
  const difficultyOptions = difficultyKeys.map(level => 
    `${level.charAt(0).toUpperCase() + level.slice(1)}: ${DIFFICULTY_LEVELS[level]}`
  );
  
  const selectedIndex = await displaySelectionMenu(
    difficultyOptions,
    styleText("cyan", "Select Difficulty Level") + "\n---------------------------",
    0
  );
  
  // Check if user canceled
  if (selectedIndex === -1) {
    console.log(styleText("yellow", "Selection cancelled. Using default difficulty (medium)."));
    return "medium";
  }
  
  return difficultyKeys[selectedIndex];
}

/**
 * Prompts the user to select the number of questions
 * @returns {Promise<number>} The selected number of questions
 */
async function selectQuestionCount() {
  console.clear();
  const questionCountOptions = ["5", "10", "15", "20", "25", "30"];
  
  const selectedIndex = await displaySelectionMenu(
    questionCountOptions,
    styleText("cyan", "How many questions would you like to answer?") + "\n------------------------------------------",
    3 // Default to 20 questions (index 3)
  );
  
  // Check if user canceled
  if (selectedIndex === -1) {
    console.log(styleText("yellow", "Selection cancelled. Using default count (20 questions)."));
    return 20;
  }
  
  return parseInt(questionCountOptions[selectedIndex]);
}

/**
 * Implements the AI-powered chat mode functionality
 * @param {string} topic - The topic for the AI to generate questions
 * @returns {void}
 */
export async function AIChatMode(topic) {
  // Let the user select difficulty
  const selectedDifficulty = await selectDifficulty();
  
  // Let the user select the number of questions
  const totalQuestions = await selectQuestionCount();
  
  let score = 0;
  let currentQuestionIndex = 0;
  let currentDifficulty = selectedDifficulty;
  let adaptiveHistory = [];
  
  // For adaptive mode, start with medium difficulty
  if (selectedDifficulty === 'adaptive') {
    currentDifficulty = 'medium';
    console.log(styleText("cyan", "Adaptive Difficulty selected. Starting with Medium difficulty."));
    await prompt("\nPress [Enter] to continue...");
  }
  
  // Generate initial set of questions or batches for adaptive mode
  let questions;
  if (selectedDifficulty === 'adaptive') {
    // Generate first batch of questions (5 questions per batch in adaptive mode)
    questions = await generateQuestions(topic, 5, currentDifficulty);
  } else {
    // Generate all questions at once for static difficulty
    questions = await generateQuestions(topic, totalQuestions, currentDifficulty);
  }

  console.clear();
  console.log(styleText("cyan", `AI Chat Mode - ${selectedDifficulty === 'adaptive' ? 'ADAPTIVE' : currentDifficulty.toUpperCase()} Difficulty`));
  console.log("The AI will ask questions based on your selected topic.");
  console.log(
    "Answer in your own words, and the AI will evaluate your response."
  );
  
  if (selectedDifficulty === 'adaptive') {
    console.log(styleText("yellow", "\nADAPTIVE MODE: Difficulty will adjust based on your performance."));
  }
  
  console.log(styleText("cyan", `\nYou will answer ${totalQuestions} questions in this session.`));
  await prompt("\nPress [Enter] to begin conversation with AI...");

  while (currentQuestionIndex < totalQuestions) {
    // In adaptive mode, generate new questions when current batch is exhausted
    if (selectedDifficulty === 'adaptive' && currentQuestionIndex % 5 === 0 && currentQuestionIndex > 0) {
      // Adjust difficulty based on recent performance
      const recentPerformance = adaptiveHistory.slice(-5);
      const avgScore = recentPerformance.reduce((sum, item) => sum + item.score, 0) / recentPerformance.length;
      
      const currentLevel = DIFFICULTY_VALUES[currentDifficulty];
      let newLevel = currentLevel;
      
      if (avgScore >= 85) {
        newLevel = Math.min(currentLevel + 1, 4); // Increase difficulty, max is 4 (expert)
      } else if (avgScore <= 40) {
        newLevel = Math.max(currentLevel - 1, 1); // Decrease difficulty, min is 1 (easy)
      }
      
      // Convert numerical level back to difficulty name
      const difficultyNames = Object.keys(DIFFICULTY_VALUES);
      currentDifficulty = difficultyNames.find(key => DIFFICULTY_VALUES[key] === newLevel);
      
      console.log(styleText("cyan", `\nAdjusting difficulty to ${currentDifficulty.toUpperCase()} based on your performance.`));
      await prompt("\nPress [Enter] to continue with new questions...");
      
      // Generate next batch of questions
      questions = await generateQuestions(topic, 5, currentDifficulty);
    }

    console.clear();
    console.log(
      styleText(
        "cyan",
        `AI Chat Mode - ${selectedDifficulty === 'adaptive' ? 'ADAPTIVE (' + currentDifficulty.toUpperCase() + ')' : currentDifficulty.toUpperCase()} Difficulty - Question ${currentQuestionIndex + 1} of ${totalQuestions}`
      )
    );

    // Display the AI's question
    const question = questions[currentQuestionIndex % questions.length];
    console.log(styleText("green", "AI: ") + question);

    // Get user's answer - FIXED: Using await to wait for user input
    console.log(styleText("yellow", "You: "));
    const userAnswer = await prompt("> ");

    // Use OpenAI API to evaluate the answer
    const evaluation = await evaluateAnswerWithAI(question, userAnswer, currentDifficulty);

    console.clear();
    console.log(
      styleText(
        "cyan",
        `AI Chat Mode - ${selectedDifficulty === 'adaptive' ? 'ADAPTIVE (' + currentDifficulty.toUpperCase() + ')' : currentDifficulty.toUpperCase()} Difficulty - Question ${currentQuestionIndex + 1} of ${totalQuestions}`
      )
    );
    console.log(styleText("green", "AI: ") + question);
    console.log(styleText("yellow", "You: ") + userAnswer);

    // Display AI's feedback
    console.log(
      styleText("green", "\nAI Evaluation: ") +
        evaluation.status +
        " | Score: " +
        evaluation.percentage.toFixed(1) +
        "%"
    );
    console.log(styleText("blue", "AI Feedback: ") + evaluation.feedback);

    // Track performance for adaptive mode
    if (selectedDifficulty === 'adaptive') {
      adaptiveHistory.push({
        difficulty: currentDifficulty,
        score: evaluation.percentage,
        questionIndex: currentQuestionIndex
      });
    }

    score += evaluation.percentage;
    currentQuestionIndex++;

    await prompt("\nPress [Enter] to continue...");
  }

  const averageScore = score / totalQuestions;

  console.clear();
  console.log(styleText("cyan", `AI Chat Session Complete! (${selectedDifficulty === 'adaptive' ? 'ADAPTIVE' : currentDifficulty.toUpperCase()} Difficulty)`));
  console.log(`Your average score: ${averageScore.toFixed(1)}%`);

  // Give overall feedback based on average score
  if (averageScore >= 90) {
    console.log(
      styleText(
        "green",
        "Outstanding! You have excellent knowledge of this topic!"
      )
    );
  } else if (averageScore >= 75) {
    console.log(
      styleText(
        "green",
        "Great job! You have a solid understanding of this topic."
      )
    );
  } else if (averageScore >= 60) {
    console.log(
      styleText(
        "yellow",
        "Good effort! You have a decent grasp of the topic with some areas to improve."
      )
    );
  } else {
    console.log(
      styleText(
        "red",
        "Keep studying! This topic requires more review to master."
      )
    );
  }
  
  // Show difficulty progression for adaptive mode
  if (selectedDifficulty === 'adaptive' && adaptiveHistory.length > 0) {
    console.log("\n" + styleText("cyan", "Difficulty Progression:"));
    
    let currentBatch = 1;
    for (let i = 0; i < adaptiveHistory.length; i += 5) {
      const batchItems = adaptiveHistory.slice(i, Math.min(i + 5, adaptiveHistory.length));
      const batchDifficulty = batchItems[0].difficulty;
      const batchAvg = batchItems.reduce((sum, item) => sum + item.score, 0) / batchItems.length;
      
      console.log(`Batch ${currentBatch}: ${batchDifficulty.toUpperCase()} - Avg Score: ${batchAvg.toFixed(1)}%`);
      currentBatch++;
    }
  }

  await prompt("\nPress [Enter] to return to the main menu...");
  console.clear();
}

/**
 * Generates questions using OpenAI API based on the given topic and difficulty
 * @param {string} topic - The topic for generating questions
 * @param {number} count - The number of questions to generate
 * @param {string} difficulty - The difficulty level (easy, medium, hard, expert)
 * @returns {Array} Array of generated questions
 */
async function generateQuestions(topic, count, difficulty) {
  // Create difficulty-specific prompt
  let difficultyPrompt;
  switch (difficulty) {
    case 'easy':
      difficultyPrompt = "Generate basic, entry-level questions that cover fundamental concepts. Use simple vocabulary and straightforward questions.";
      break;
    case 'medium':
      difficultyPrompt = "Generate intermediate-level questions that require good understanding of the topic. Include some specific details but keep questions accessible.";
      break;
    case 'hard':
      difficultyPrompt = "Generate challenging questions that test deep understanding. Include specific details, dates, and connections between concepts.";
      break;
    case 'expert':
      difficultyPrompt = "Generate expert-level questions that would challenge even subject matter experts. Focus on obscure details, complex relationships, and nuanced understanding.";
      break;
  }

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `Generate ${count} ${difficulty} difficulty questions on the topic: ${topic}. ${difficultyPrompt} Format the response as one question per line, without empty lines in between to avoid having these lines be interpreted as questions. Please provide additional context needed to correctly answer the question.`,
      },
    ],
    max_tokens: 1500,
    temperature: 0.7,
  });

  return response.choices[0].message.content
    .trim()
    .split("\n")
    .filter((q) => q);
}

/**
 * Evaluates the user's answer using OpenAI API with consideration for difficulty
 * @param {string} question - The AI's question
 * @param {string} userAnswer - The user's provided answer
 * @param {string} difficulty - The difficulty level (easy, medium, hard, expert)
 * @returns {Object} Evaluation results including status, percentage and feedback
 */
async function evaluateAnswerWithAI(question, userAnswer, difficulty) {
  // Create difficulty-specific evaluation criteria
  let evaluationCriteria;
  switch (difficulty) {
    case 'easy':
      evaluationCriteria = "Be lenient in scoring. Focus on basic understanding rather than details. Accept partial answers if they show basic comprehension.";
      break;
    case 'medium':
      evaluationCriteria = "Use standard scoring. Answers should demonstrate clear understanding but don't require every detail to be perfect.";
      break;
    case 'hard':
      evaluationCriteria = "Apply rigorous scoring. Expect detailed answers with specific facts and good reasoning. Minor errors are acceptable but should impact score.";
      break;
    case 'expert':
      evaluationCriteria = "Use very strict scoring. Expect comprehensive, precise answers with specific details and excellent reasoning. Even small errors should impact the score.";
      break;
  }

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `Evaluate the following answer for a ${difficulty} difficulty question:\n\nQuestion: ${question}\nAnswer: ${userAnswer}\n\n${evaluationCriteria}\nIgnore typos that don't impact the meaning.\nProvide a score out of 100, a status (Correct, Partially Correct, Incorrect), and feedback in the form of: 'Status: <status>\\nPercentage: <score>\\nFeedback: <feedback>'.`,
      },
    ],
    max_tokens: 250,
    temperature: 0.3,
  });

  const evaluationText = response.choices[0].message.content.trim();
  const [status, percentage, feedback] = evaluationText
    .split("\n")
    .map((line) => line.split(": ")[1]);

  return {
    status,
    percentage: parseFloat(percentage),
    feedback,
  };
}
