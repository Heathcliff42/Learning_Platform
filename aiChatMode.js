/*
 * @Author: Lukas Kroczek
 * @Date: 2025-03-07
 * @Description: AI Chat functionality for Learning Mode
 * @Version: 1.0.0
 * @LastUpdate: 2025-03-07
 */

import { styleText } from "node:util";
import { prompt } from "./displaySelectionMenu.js";
import OpenAI from "openai";

// Securely access the OpenAI API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Implements the AI-powered chat mode functionality
 * @param {string} topic - The topic for the AI to generate questions
 * @returns {void}
 */
export async function AIChatMode(topic) {
  let score = 0;
  const questions = await generateQuestions(topic, 20);

  console.clear();
  console.log(styleText("cyan", "AI Chat Mode"));
  console.log("The AI will ask questions based on your selected topic.");
  console.log(
    "Answer in your own words, and the AI will evaluate your response."
  );
  prompt("\nPress [Enter] to begin conversation with AI...");

  for (let i = 0; i < questions.length; i++) {
    console.clear();
    console.log(
      styleText(
        "cyan",
        "AI Chat Mode - Question " + (i + 1) + " of " + questions.length
      )
    );

    // Display the AI's question
    const question = questions[i];
    console.log(styleText("green", "AI: ") + question);

    // Get user's answer
    console.log(styleText("yellow", "You: "));
    const userAnswer = prompt("> ");

    // Use OpenAI API to evaluate the answer
    const evaluation = await evaluateAnswerWithAI(question, userAnswer);

    console.clear();
    console.log(
      styleText(
        "cyan",
        "AI Chat Mode - Question " + (i + 1) + " of " + questions.length
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

    score += evaluation.percentage;

    prompt("\nPress [Enter] to continue...");
  }

  const averageScore = score / questions.length;

  console.clear();
  console.log(styleText("cyan", "AI Chat Session Complete!"));
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

  prompt("\nPress [Enter] to return to the main menu...");
  console.clear();
}

/**
 * Generates questions using OpenAI API based on the given topic
 * @param {string} topic - The topic for generating questions
 * @param {number} count - The number of questions to generate
 * @returns {Array} Array of generated questions
 */
async function generateQuestions(topic, count) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `Generate ${count} questions on the topic: ${topic}. Format the response as one question per line.`,
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
 * Evaluates the user's answer using OpenAI API
 * @param {string} question - The AI's question
 * @param {string} userAnswer - The user's provided answer
 * @returns {Object} Evaluation results including status, percentage and feedback
 */
async function evaluateAnswerWithAI(question, userAnswer) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `Evaluate the following answer:\n\nQuestion: ${question}\nAnswer: ${userAnswer}\n\nProvide a score out of 100, a status (Correct, Partially Correct, Incorrect), and feedback in the form of: 'Status: <status>\\nPercentage: <score>\\nFeedback: <feedback>'.`,
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
