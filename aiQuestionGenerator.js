/*
 * @Author: Lukas Kroczek
 * @Date: 2025-03-20
 * @Description: AI-powered question generator for Learning Platform
 * @Version: 1.0.2
 * @LastUpdate: 2025-03-30
 */

import dotenv from "dotenv";
import { styleText } from "node:util";
import { prompt, displaySelectionMenu } from "./displaySelectionMenu.js";
import OpenAI from "openai";

// Load environment variables from .env file
dotenv.config();

// Access OpenAI API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Retry API requests with exponential backoff
 * @param {Function} apiCall - Function that makes the API call
 * @param {number} maxRetries - Maximum number of retries
 * @returns {Promise<any>} - API response
 */
async function retryAPIRequest(apiCall, maxRetries = 3) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await apiCall();
    } catch (error) {
      retries++;
      if (retries === maxRetries) throw error;

      const delay = Math.pow(2, retries) * 1000;
      console.log(
        styleText("yellow", `API error. Retrying in ${delay / 1000} seconds...`)
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

/**
 * Generates multiple choice questions for a given topic
 * @param {string} topic - The topic to generate questions for
 * @param {Array} existingQuestions - List of existing questions to avoid duplicates
 * @param {number} count - Number of questions to generate
 * @returns {Promise<Array>} Array of generated questions in the format [question, correct, wrong1, wrong2, wrong3]
 */
export async function generateQuestionsWithAI(topic, existingQuestions, count) {
  console.log(
    styleText("cyan", `Generating ${count} questions for topic: ${topic}`)
  );
  console.log(styleText("yellow", "This may take a moment..."));

  // Extract just the question text from existing questions to check for duplicates
  const existingQuestionTexts = existingQuestions.map((q) => q[0]);

  // Create sample questions from existing ones to establish style and difficulty
  let sampleQuestions = "";
  if (existingQuestions.length > 0) {
    // Get up to 5 samples to establish style
    const samples = existingQuestions.slice(
      0,
      Math.min(5, existingQuestions.length)
    );
    sampleQuestions = samples
      .map(
        (q) =>
          `Question: ${q[0]}\nCorrect Answer: ${q[1]}\nWrong Answers: ${q[2]}, ${q[3]}, ${q[4]}`
      )
      .join("\n\n");
  }

  try {
    const response = await retryAPIRequest(() =>
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert question generator for educational platforms. Your task is to create ${count} unique multiple-choice questions about "${topic}".

For each question:
1. Create a clear, concise question
2. Provide one correct answer
3. Provide three plausible but incorrect answers
4. Make sure answers are roughly the same length and style
5. Use UK English spelling and grammar
6. Make sure questions are factually accurate and unambiguous

${
  existingQuestions.length > 0
    ? `Here are some example questions from the system to establish the appropriate style and difficulty level:\n\n${sampleQuestions}\n\n`
    : ""
}

${
  existingQuestionTexts.length > 0
    ? `IMPORTANT: Avoid generating any of these existing questions:\n${existingQuestionTexts.join(
        "\n"
      )}\n\n`
    : ""
}

Please format your output as a valid JSON array where each element is an array with 5 strings: [question, correct_answer, wrong_answer1, wrong_answer2, wrong_answer3]

For example:
[
  ["What is the capital of France?", "Paris", "Lyon", "Marseille", "Nice"],
  ["Who wrote 'Romeo and Juliet'?", "William Shakespeare", "John Dryden", "Christopher Marlowe", "Ben Johnson"]
]

Return ONLY valid JSON in your response with no other explanatory text.`,
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 4000,
        temperature: 0.7,
      })
    );

    // Parse the JSON response
    try {
      const result = JSON.parse(response.choices[0].message.content);
      if (
        Array.isArray(result) ||
        (result.questions && Array.isArray(result.questions))
      ) {
        const questions = Array.isArray(result) ? result : result.questions;
        console.log(
          styleText(
            "green",
            `Successfully generated ${questions.length} questions!`
          )
        );
        return questions;
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.log(
        styleText("red", `Error parsing generated questions: ${error.message}`)
      );
      console.log("Raw response:", response.choices[0].message.content);
      throw new Error("Failed to parse generated questions");
    }
  } catch (error) {
    console.log(
      styleText("red", `Error generating questions: ${error.message}`)
    );
    throw error;
  }
}

/**
 * Generates gaptexts for a given topic
 * @param {string} topic - The topic to generate gaptexts for
 * @param {Array} existingGaptexts - List of existing gaptexts to avoid duplicates
 * @param {number} count - Number of gaptexts to generate
 * @returns {Promise<Array>} Array of generated gaptexts in the format [text, solution]
 */
export async function generateGaptextsWithAI(topic, existingGaptexts, count) {
  console.log(
    styleText("cyan", `Generating ${count} gaptexts for topic: ${topic}`)
  );
  console.log(styleText("yellow", "This may take a moment..."));

  // Extract existing gaptext content to avoid duplicates
  const existingGaptextTexts = existingGaptexts.map((g) => g[0]);

  // Create sample gaptexts from existing ones to establish style
  let sampleGaptexts = "";
  if (existingGaptexts.length > 0) {
    // Get up to 3 samples to establish style
    const samples = existingGaptexts.slice(
      0,
      Math.min(3, existingGaptexts.length)
    );
    sampleGaptexts = samples
      .map((g) => `Text with gaps: ${g[0]}\nSolutions: ${g[1]}`)
      .join("\n\n");
  }

  try {
    const response = await retryAPIRequest(() =>
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert educational content creator specializing in gap-fill exercises. Your task is to create ${count} unique gap-fill texts about "${topic}".

For each gaptext:
1. Create a paragraph or short passage about the topic
2. Replace key terms or concepts with gaps marked as "_____"
3. The solution should be a single word as well as the only correct answer
4. Make sure the text is educational and factually accurate
5. Use UK English spelling and grammar
6. Create texts of varying difficulty but appropriate for the topic
7. Each gaptext should have one gap

${
  existingGaptexts.length > 0
    ? `Here are some example gaptexts from the system to establish the appropriate style:\n\n${sampleGaptexts}\n\n`
    : ""
}

${
  existingGaptextTexts.length > 0
    ? `IMPORTANT: Avoid generating texts too similar to these existing gaptexts:\n${existingGaptextTexts.join(
        "\n"
      )}\n\n`
    : ""
}

Please format your output as a valid JSON array where each element is an array with 2 strings: [text_with_gap, solution]

For example:
[
  ["The _____ is the capital of France and is known for the Eiffel Tower.", "Paris"],
  ["Water is composed of two elements: _____ and oxygen.", "hydrogen"]
]

Return ONLY valid JSON in your response with no other explanatory text.`,
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000,
        temperature: 0.7,
      })
    );

    // Parse the JSON response
    try {
      const result = JSON.parse(response.choices[0].message.content);
      if (
        Array.isArray(result) ||
        (result.gaptexts && Array.isArray(result.gaptexts))
      ) {
        const gaptexts = Array.isArray(result) ? result : result.gaptexts;
        console.log(
          styleText(
            "green",
            `Successfully generated ${gaptexts.length} gaptexts!`
          )
        );
        return gaptexts;
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.log(
        styleText("red", `Error parsing generated gaptexts: ${error.message}`)
      );
      console.log("Raw response:", response.choices[0].message.content);
      throw new Error("Failed to parse generated gaptexts");
    }
  } catch (error) {
    console.log(
      styleText("red", `Error generating gaptexts: ${error.message}`)
    );
    throw error;
  }
}

/**
 * Allows user to review generated questions and select which ones to save
 * @param {Array} generatedQuestions - Array of generated questions
 * @returns {Promise<Array>} Array of selected questions to save
 */
export async function reviewGeneratedQuestions(generatedQuestions) {
  console.clear();
  console.log(styleText("cyan", "Review Generated Questions"));
  console.log("Select which questions you want to save to the database.\n");

  // Array to store selected questions
  const selectedQuestions = [];

  for (let i = 0; i < generatedQuestions.length; i++) {
    const q = generatedQuestions[i];
    console.log(styleText("green", `Question ${i + 1}:`));
    console.log(q[0]);
    console.log(styleText("cyan", "Correct Answer: ") + q[1]);
    console.log(styleText("yellow", "Wrong Answers:"));
    console.log(`1. ${q[2]}`);
    console.log(`2. ${q[3]}`);
    console.log(`3. ${q[4]}`);

    const saveThis = await prompt("\nSave this question? (y/n/edit): ");

    if (saveThis.toLowerCase() === "y") {
      selectedQuestions.push(q);
      console.log(styleText("green", "Question added to save list."));
    } else if (saveThis.toLowerCase() === "edit") {
      console.log(styleText("yellow", "Edit question:"));

      const editedQuestion = [...q]; // Create a copy of the question

      // Allow editing each part
      editedQuestion[0] = (await prompt(`Edit question (${q[0]}): `)) || q[0];
      editedQuestion[1] =
        (await prompt(`Edit correct answer (${q[1]}): `)) || q[1];
      editedQuestion[2] =
        (await prompt(`Edit wrong answer 1 (${q[2]}): `)) || q[2];
      editedQuestion[3] =
        (await prompt(`Edit wrong answer 2 (${q[3]}): `)) || q[3];
      editedQuestion[4] =
        (await prompt(`Edit wrong answer 3 (${q[4]}): `)) || q[4];

      const confirmSave = await prompt("Save edited question? (y/n): ");
      if (confirmSave.toLowerCase() === "y") {
        selectedQuestions.push(editedQuestion);
        console.log(styleText("green", "Edited question added to save list."));
      } else {
        console.log(styleText("yellow", "Question discarded."));
      }
    } else {
      console.log(styleText("yellow", "Question discarded."));
    }

    console.log("\n" + "-".repeat(50) + "\n");
  }

  return selectedQuestions;
}

/**
 * Allows user to review generated gaptexts and select which ones to save
 * @param {Array} generatedGaptexts - Array of generated gaptexts
 * @returns {Promise<Array>} Array of selected gaptexts to save
 */
export async function reviewGeneratedGaptexts(generatedGaptexts) {
  console.clear();
  console.log(styleText("cyan", "Review Generated Gaptexts"));
  console.log("Select which gaptexts you want to save to the database.\n");

  // Array to store selected gaptexts
  const selectedGaptexts = [];

  for (let i = 0; i < generatedGaptexts.length; i++) {
    const g = generatedGaptexts[i];
    console.log(styleText("green", `Gaptext ${i + 1}:`));

    // Display the gaptext with highlighted gaps
    const highlightedText = g[0].replace(
      /_____/g,
      styleText("yellow", "_____")
    );
    console.log(highlightedText);

    // Display solutions
    console.log(styleText("cyan", "Solutions: ") + g[1]);

    const saveThis = await prompt("\nSave this gaptext? (y/n/edit): ");

    if (saveThis.toLowerCase() === "y") {
      selectedGaptexts.push(g);
      console.log(styleText("green", "Gaptext added to save list."));
    } else if (saveThis.toLowerCase() === "edit") {
      console.log(styleText("yellow", "Edit gaptext:"));

      const editedGaptext = [...g]; // Create a copy of the gaptext

      // Display edit instructions
      console.log("\nCurrent text with gaps:");
      console.log(g[0]);
      console.log("\nEdit the text, keeping the gaps as '_____'");
      console.log("Enter blank line when finished.");

      // Collect multi-line input
      let newText = "";
      let textLine;
      while ((textLine = await prompt("> ")) !== "") {
        newText += (newText ? "\n" : "") + textLine;
      }

      if (newText.trim() !== "") {
        editedGaptext[0] = newText;
      }

      // Edit solutions
      editedGaptext[1] = (await prompt(`Edit solutions (${g[1]}): `)) || g[1];

      const confirmSave = await prompt("Save edited gaptext? (y/n): ");
      if (confirmSave.toLowerCase() === "y") {
        selectedGaptexts.push(editedGaptext);
        console.log(styleText("green", "Edited gaptext added to save list."));
      } else {
        console.log(styleText("yellow", "Gaptext discarded."));
      }
    } else {
      console.log(styleText("yellow", "Gaptext discarded."));
    }

    console.log("\n" + "-".repeat(50) + "\n");
  }

  return selectedGaptexts;
}
