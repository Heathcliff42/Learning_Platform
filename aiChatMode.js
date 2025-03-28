/*
 * @Author: Lukas Kroczek
 * @Date: 2025-03-07
 * @Description: AI Chat functionality for Learning Mode
 * @Version: 1.0.4
 * @LastUpdate: 2025-03-24
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
  adaptive: "Dynamically adjusts difficulty based on your performance",
};

// Define numerical values for each difficulty level for adaptive mode
const DIFFICULTY_VALUES = {
  easy: 1,
  medium: 2,
  hard: 3,
  expert: 4,
};

/**
 * Prompts the user to select a difficulty level using the selection menu
 * @returns {Promise<string>} The selected difficulty level
 */
async function selectDifficulty() {
  console.clear();
  const difficultyKeys = Object.keys(DIFFICULTY_LEVELS);
  const difficultyOptions = difficultyKeys.map(
    (level) =>
      `${level.charAt(0).toUpperCase() + level.slice(1)}: ${
        DIFFICULTY_LEVELS[level]
      }`
  );

  const selectedIndex = await displaySelectionMenu(
    difficultyOptions,
    styleText("cyan", "Select Difficulty Level") +
      "\n---------------------------",
    0
  );

  // Check if user canceled
  if (selectedIndex === -1) {
    console.log(
      styleText(
        "yellow",
        "Selection cancelled. Using default difficulty (medium)."
      )
    );
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
  const questionCountOptions = ["5", "10", "15", "20"];

  const selectedIndex = await displaySelectionMenu(
    questionCountOptions,
    styleText("cyan", "How many questions would you like to answer?") +
      "\n------------------------------------------",
    1 // Default to 10 questions (index 1)
  );

  // Check if user canceled
  if (selectedIndex === -1) {
    console.log(
      styleText(
        "yellow",
        "Selection cancelled. Using default count (10 questions)."
      )
    );
    return 10;
  }

  return parseInt(questionCountOptions[selectedIndex]);
}

/**
 * Implements the AI-powered chat mode functionality
 * @param {string} topic - The topic for the AI to generate questions
 * @returns {Promise<Object>} - Statistics from the session
 */
export async function aiChatMode(topic) {
  // Let the user select difficulty
  const selectedDifficulty = await selectDifficulty();

  // Let the user select the number of questions
  const totalQuestions = await selectQuestionCount();

  let score = 0;
  let currentQuestionIndex = 0;
  let currentDifficulty = selectedDifficulty;
  let adaptiveHistory = [];

  // Track topics the user struggles with
  let topicPerformance = {};
  let skippedTopics = new Set();

  // Create a set to track asked questions and prevent duplicates
  let askedQuestions = new Set();

  // For adaptive mode, start with medium difficulty
  if (selectedDifficulty === "adaptive") {
    currentDifficulty = "medium";
    console.log(
      styleText(
        "cyan",
        "Adaptive Difficulty selected. Starting with Medium difficulty."
      )
    );
    await prompt("\nPress [Enter] to continue...");
  }

  console.clear();
  console.log(
    styleText(
      "cyan",
      `AI Chat Mode - ${
        selectedDifficulty === "adaptive"
          ? "ADAPTIVE"
          : currentDifficulty.toUpperCase()
      } Difficulty`
    )
  );
  console.log("The AI will ask questions based on your selected topic.");
  console.log(
    "Answer in your own words, and the AI will evaluate your response."
  );
  console.log(
    styleText(
      "yellow",
      '\nTIP: Type "I don\'t know [topic]" to skip a question on a specific topic.'
    )
  );

  if (selectedDifficulty === "adaptive") {
    console.log(
      styleText(
        "yellow",
        "\nADAPTIVE MODE: Difficulty will adjust based on your performance."
      )
    );
  }

  console.log(
    styleText(
      "cyan",
      `\nYou will answer ${totalQuestions} questions in this session.`
    )
  );
  await prompt("\nPress [Enter] to begin conversation with AI...");

  while (currentQuestionIndex < totalQuestions) {
    console.clear();
    console.log(
      styleText(
        "cyan",
        `AI Chat Mode - ${
          selectedDifficulty === "adaptive"
            ? "ADAPTIVE (" + currentDifficulty.toUpperCase() + ")"
            : currentDifficulty.toUpperCase()
        } Difficulty - Question ${
          currentQuestionIndex + 1
        } of ${totalQuestions}`
      )
    );

    // Generate a single question (avoid duplicates)
    const questionData = await generateSingleQuestion(
      topic,
      currentDifficulty,
      skippedTopics,
      askedQuestions
    );
    const question = questionData.question;
    const questionTopic = questionData.subtopic;

    // Add the question to our set of asked questions
    askedQuestions.add(question);

    // Display the AI's question
    console.log(styleText("green", "AI: ") + question);

    // Get user's answer - Make sure we're actually waiting for input
    console.log(styleText("yellow", "You: "));
    let userAnswer;
    try {
      userAnswer = await prompt("> ");
    } catch (error) {
      console.log(styleText("red", "Error getting input. Please try again."));
      await prompt("Press [Enter] to retry...");
      continue;
    }

    // Check if the answer is empty
    if (!userAnswer || userAnswer.trim() === "") {
      console.log(
        styleText("yellow", "Your answer was empty. Please try again.")
      );
      await prompt("Press [Enter] to retry the question...");
      continue;
    }

    // Check if the user wants to skip this topic
    const dontKnowMatch = userAnswer.match(/^i don'?t know\s+(.+)$/i);
    if (dontKnowMatch) {
      const skippedTopic = dontKnowMatch[1].trim();
      console.log(
        styleText(
          "yellow",
          `Skipping questions related to "${skippedTopic}"...`
        )
      );
      skippedTopics.add(skippedTopic.toLowerCase());

      await prompt("\nPress [Enter] to continue...");
      continue; // Skip to the next question without counting this one
    }

    // Use OpenAI API to evaluate the answer
    try {
      const evaluation = await evaluateAnswerWithAI(
        question,
        userAnswer,
        currentDifficulty,
        questionTopic
      );

      console.clear();
      console.log(
        styleText(
          "cyan",
          `AI Chat Mode - ${
            selectedDifficulty === "adaptive"
              ? "ADAPTIVE (" + currentDifficulty.toUpperCase() + ")"
              : currentDifficulty.toUpperCase()
          } Difficulty - Question ${
            currentQuestionIndex + 1
          } of ${totalQuestions}`
        )
      );
      console.log(styleText("green", "AI: ") + question);
      console.log(styleText("cyan", `[Topic: ${questionTopic}]`));
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

      // Track performance for adaptive mode and topic-specific performance
      if (!topicPerformance[questionTopic]) {
        topicPerformance[questionTopic] = {
          count: 0,
          totalScore: 0,
          questions: [],
        };
      }

      topicPerformance[questionTopic].count++;
      topicPerformance[questionTopic].totalScore += evaluation.percentage;
      topicPerformance[questionTopic].questions.push({
        question,
        answer: userAnswer,
        score: evaluation.percentage,
      });

      adaptiveHistory.push({
        difficulty: currentDifficulty,
        score: evaluation.percentage,
        questionIndex: currentQuestionIndex,
        topic: questionTopic,
      });

      score += evaluation.percentage;
      currentQuestionIndex++;

      // Adjust difficulty in adaptive mode after every 3 questions
      if (selectedDifficulty === "adaptive" && currentQuestionIndex % 3 === 0) {
        // Get the last 3 questions' performance
        const recentPerformance = adaptiveHistory.slice(-3);
        const avgScore =
          recentPerformance.reduce((sum, item) => sum + item.score, 0) /
          recentPerformance.length;

        const currentLevel = DIFFICULTY_VALUES[currentDifficulty];
        let newLevel = currentLevel;

        if (avgScore >= 85) {
          newLevel = Math.min(currentLevel + 1, 4); // Increase difficulty, max is 4 (expert)
        } else if (avgScore <= 40) {
          newLevel = Math.max(currentLevel - 1, 1); // Decrease difficulty, min is 1 (easy)
        }

        // Convert numerical level back to difficulty name
        const difficultyNames = Object.keys(DIFFICULTY_VALUES);
        const newDifficulty = difficultyNames.find(
          (key) => DIFFICULTY_VALUES[key] === newLevel
        );

        if (newDifficulty !== currentDifficulty) {
          currentDifficulty = newDifficulty;
          console.log(
            styleText(
              "cyan",
              `\nAdjusting difficulty to ${currentDifficulty.toUpperCase()} based on your performance.`
            )
          );
        }
      }

      await prompt("\nPress [Enter] to continue...");
    } catch (error) {
      console.log(
        styleText(
          "red",
          `An error occurred while evaluating your answer: ${error.message}`
        )
      );
      console.log(styleText("yellow", "Let's try another question."));
      await prompt("Press [Enter] to continue...");
    }
  }

  const averageScore = score / totalQuestions;

  console.clear();
  console.log(
    styleText(
      "cyan",
      `AI Chat Session Complete! (${
        selectedDifficulty === "adaptive"
          ? "ADAPTIVE"
          : selectedDifficulty.toUpperCase()
      } Difficulty)`
    )
  );
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
  if (selectedDifficulty === "adaptive" && adaptiveHistory.length > 0) {
    console.log("\n" + styleText("cyan", "Difficulty Progression:"));

    let currentBatch = 1;
    for (let i = 0; i < adaptiveHistory.length; i += 3) {
      const batchItems = adaptiveHistory.slice(
        i,
        Math.min(i + 3, adaptiveHistory.length)
      );
      const batchDifficulty = batchItems[0].difficulty;
      const batchAvg =
        batchItems.reduce((sum, item) => sum + item.score, 0) /
        batchItems.length;

      console.log(
        `Batch ${currentBatch}: ${batchDifficulty.toUpperCase()} - Avg Score: ${batchAvg.toFixed(
          1
        )}%`
      );
      currentBatch++;
    }
  }

  // Show topic-specific performance
  console.log("\n" + styleText("cyan", "Topic-Specific Performance:"));
  const sortedTopics = Object.entries(topicPerformance).sort(
    (a, b) => a[1].totalScore / a[1].count - b[1].totalScore / b[1].count
  );

  for (const [subtopic, data] of sortedTopics) {
    const avgScore = data.totalScore / data.count;
    let performanceIndicator;

    if (avgScore >= 80) performanceIndicator = styleText("green", "✓ Strong");
    else if (avgScore >= 60)
      performanceIndicator = styleText("yellow", "△ Average");
    else performanceIndicator = styleText("red", "✗ Needs Work");

    console.log(
      `${subtopic}: ${avgScore.toFixed(1)}% [${performanceIndicator}] (${
        data.count
      } questions)`
    );
  }

  if (skippedTopics.size > 0) {
    console.log("\n" + styleText("yellow", "Topics you chose to skip:"));
    for (const topic of skippedTopics) {
      console.log(`- ${topic}`);
    }
  }

  await prompt("\nPress [Enter] to return to the main menu...");
  console.clear();

  // Return statistics for this session
  return {
    totalQuestions: totalQuestions,
    correctAnswers: Math.round((score / 100) * totalQuestions), // Convert percentage score to questions
    averageScore: averageScore,
  };
}

/**
 * Generates a single question using OpenAI API based on the topic and difficulty
 * @param {string} topic - The main topic for generating questions
 * @param {string} difficulty - The difficulty level
 * @param {Set} skippedTopics - Topics to avoid in question generation
 * @param {Set} askedQuestions - Set of previously asked questions to avoid duplicates
 * @returns {Object} The generated question and its subtopic
 */
async function generateSingleQuestion(
  topic,
  difficulty,
  skippedTopics,
  askedQuestions = new Set()
) {
  // Create difficulty-specific prompt
  let difficultyPrompt;
  switch (difficulty) {
    case "easy":
      difficultyPrompt =
        "Generate a basic, entry-level question that covers fundamental concepts. Use simple vocabulary and straightforward phrasing.";
      break;
    case "medium":
      difficultyPrompt =
        "Generate an intermediate-level question that requires above-average understanding of the topic. Include some specific details but keep the question accessible.";
      break;
    case "hard":
      difficultyPrompt =
        "Generate a challenging question that tests deep understanding. Include specific details and connections between concepts.";
      break;
    case "expert":
      difficultyPrompt =
        "Generate an expert-level question that would challenge even subject matter experts. Focus on obscure details, complex relationships, and nuanced understanding.";
      break;
  }

  const skipTopicsText =
    skippedTopics.size > 0
      ? `Avoid questions related to the following subtopics: ${Array.from(
          skippedTopics
        ).join(", ")}.`
      : "";

  // Added instruction to avoid previous questions
  const uniqueInstructionText =
    askedQuestions.size > 0
      ? `Do not generate any of these previously asked questions: ${Array.from(
          askedQuestions
        ).join(" | ")}.`
      : "";

  try {
    const response = await retryAPIRequest(() =>
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Generate a ${difficulty} difficulty question on the topic: ${topic}. ${difficultyPrompt} ${skipTopicsText}
          
          ${uniqueInstructionText}
          
          Use UK English and keep the question clear, concise and answerable in few words.

          Don't concentrate on knowlege that is specific to a certain region or country.

          Also identify what specific subtopic within ${topic} this question addresses.
          Format your response as a JSON object with two fields:
          {
            "question": "The full question text",
            "subtopic": "The specific subtopic this question addresses"
          }

          Return only valid JSON in your response.`,
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 500,
        temperature: 0.7,
      })
    );

    try {
      const result = JSON.parse(response.choices[0].message.content);

      return {
        question: result.question,
        subtopic: result.subtopic,
      };
    } catch (error) {
      console.log(
        styleText(
          "yellow",
          "Warning: Could not parse question as JSON. Using raw response."
        )
      );
      // Fallback in case parsing fails
      return {
        question: response.choices[0].message.content,
        subtopic: topic,
      };
    }
  } catch (error) {
    console.log(
      styleText("red", `Error generating question: ${error.message}`)
    );
    // Return a simple fallback question to avoid crashing
    return {
      question: `Let's discuss ${topic}. Can you explain a key concept from this subject?`,
      subtopic: topic,
    };
  }
}

/**
 * Evaluates the user's answer using OpenAI API with consideration for difficulty
 * @param {string} question - The AI's question
 * @param {string} userAnswer - The user's provided answer
 * @param {string} difficulty - The difficulty level (easy, medium, hard, expert)
 * @param {string} subtopic - The specific subtopic of the question
 * @returns {Object} Evaluation results including status, percentage and feedback
 */
async function evaluateAnswerWithAI(
  question,
  userAnswer,
  difficulty,
  subtopic
) {
  // Create difficulty-specific evaluation criteria
  let evaluationCriteria;
  switch (difficulty) {
    case "easy":
      evaluationCriteria =
        "Be lenient in scoring. Focus on basic understanding rather than details. Minor errors should not impact the score.";
      break;
    case "medium":
      evaluationCriteria =
        "Use standard scoring. Answers should demonstrate clear understanding but don't require detail to be perfect.";
      break;
    case "hard":
      evaluationCriteria =
        "Apply rigorous scoring. Expect clear answers with some detail. Minor errors are acceptable but should impact the score.";
      break;
    case "expert":
      evaluationCriteria =
        "Use very strict scoring. Expect precise answers with specific details. Even small errors should impact the score.";
      break;
  }

  try {
    const response = await retryAPIRequest(() =>
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Evaluate the following answer for the following question:
          
          Question: ${question}
          Answer: ${userAnswer}

          ${evaluationCriteria}

          Use UK English and ignore spelling mistakes that don't impact the meaning for scoring purposes (this also counts for e.g. names missing a single letter).

          Provide a score out of 100, a status (Correct, Partially Correct, or Incorrect), and feedback (with right answer if the question was answered wrong).
          
          Return your evaluation as a JSON object in the following format:
          {
            "status": "status text",
            "percentage": score number,
            "feedback": "detailed feedback"
          }

          You must return only valid JSON in your response.`,
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 500,
        temperature: 0.3,
      })
    );

    try {
      const result = JSON.parse(response.choices[0].message.content);
      return {
        status: result.status,
        percentage: parseFloat(result.percentage),
        feedback: result.feedback,
      };
    } catch (error) {
      console.log(
        styleText(
          "yellow",
          "Warning: Could not parse evaluation as JSON. Using fallback method."
        )
      );
      // Fallback in case parsing fails
      const evaluationText = response.choices[0].message.content.trim();
      const [status, percentage, feedback] = evaluationText
        .split("\n")
        .map((line) => line.split(": ")[1]);

      return {
        status: status || "Partially Correct",
        percentage: parseFloat(percentage) || 50,
        feedback: feedback || "Unable to parse evaluation properly.",
      };
    }
  } catch (error) {
    console.log(styleText("red", `Error evaluating answer: ${error.message}`));
    await prompt("Press [Enter] to continue...");
    // Return a generic evaluation to avoid crashing
    return {
      status: "Evaluated",
      percentage: 50,
      feedback:
        "Unable to evaluate your answer due to a technical issue. Let's continue with the next question.",
    };
  }
}

/**
 * Retries an API request with exponential backoff
 * @param {Function} apiCall - The API call to retry
 * @param {number} maxRetries - Maximum number of retries
 * @returns {Promise<any>} - The API response
 */
async function retryAPIRequest(apiCall, maxRetries = 3) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
      console.log(
        styleText(
          "yellow",
          `API request failed, retrying in ${delay / 1000} seconds...`
        )
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}
