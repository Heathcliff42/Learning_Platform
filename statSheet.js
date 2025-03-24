/*
 * @Author: Lukas Kroczek
 * @Date: 2025-03-24
 * @Description: Statistics display functionality
 * @Version: 1.0.0
 * @LastUpdate: 2025-03-24
 */

import { styleText } from "node:util";
import { prompt, displaySelectionMenu } from "./displaySelectionMenu.js";

/**
 * Displays statistics for the current user
 * @param {Object} db - Database instance
 * @param {number} userId - Current user ID
 * @returns {Promise<void>}
 */
export async function StatSheet(db, userId) {
  console.clear();
  console.log(styleText("cyan", "Learning Platform - Statistics"));
  console.log("─".repeat(50));

  try {
    // Get user details
    const users = await db.getAllUsers();
    const currentUser = users.find((user) => user.id === userId);
    if (!currentUser) {
      console.log(styleText("red", "User not found!"));
      await prompt("\nPress [Enter] to continue...");
      return;
    }

    console.log(styleText("yellow", `Statistics for: ${currentUser.username}`));
    console.log("─".repeat(50));

    // Get statistics for the user
    const stats = await db.getStatistics(userId);

    // Show menu for stat options
    while (true) {
      const options = [
        "Back to Main Menu",
        "Overall Statistics",
        "Topic-wise Statistics",
        "Mode-wise Statistics",
        "Detailed History",
      ];

      const selectedIdx = await displaySelectionMenu(
        options,
        styleText("cyan", "Select statistics to view:"),
        0
      );

      // Exit condition
      if (selectedIdx === -1 || selectedIdx === 0) {
        return;
      }

      console.clear();
      console.log(styleText("cyan", "Learning Platform - Statistics"));
      console.log(styleText("yellow", `User: ${currentUser.username}`));
      console.log("─".repeat(50));

      switch (selectedIdx) {
        case 1: // Overall Statistics
          await displayOverallStats(stats.overall);
          break;
        case 2: // Topic-wise Statistics
          await displayTopicStats(stats.topicStats);
          break;
        case 3: // Mode-wise Statistics
          await displayModeStats(stats.modeStats);
          break;
        case 4: // Detailed History
          await displayDetailedStats(stats.detailedStats);
          break;
      }
    }
  } catch (error) {
    console.error("Error displaying statistics:", error);
    console.log(
      styleText("red", "An error occurred while retrieving statistics.")
    );
    await prompt("\nPress [Enter] to continue...");
  }
}

/**
 * Displays overall statistics
 * @param {Object} overallStats - The overall statistics data
 * @returns {Promise<void>}
 */
async function displayOverallStats(overallStats) {
  console.log(styleText("cyan", "Overall Statistics"));
  console.log("─".repeat(50));

  if (!overallStats || overallStats.total_attempted === 0) {
    console.log(styleText("yellow", "No statistics available yet."));
    console.log("Complete some learning sessions to generate statistics.");
  } else {
    console.log(`Total Questions Attempted: ${overallStats.total_attempted}`);
    console.log(`Total Correct Answers: ${overallStats.total_correct}`);
    console.log(
      `Overall Success Rate: ${overallStats.overall_success_rate.toFixed(2)}%`
    );

    // Add a visual representation of success rate
    const successRate = overallStats.overall_success_rate;
    let performanceText;

    if (successRate >= 90) {
      performanceText = styleText(
        "green",
        "Outstanding performance! Keep up the great work!"
      );
    } else if (successRate >= 75) {
      performanceText = styleText(
        "green",
        "Good performance! You're doing well."
      );
    } else if (successRate >= 60) {
      performanceText = styleText(
        "yellow",
        "Average performance. Room for improvement."
      );
    } else {
      performanceText = styleText(
        "red",
        "Below average performance. More practice needed."
      );
    }

    console.log(`\nPerformance Assessment: ${performanceText}`);
  }

  await prompt("\nPress [Enter] to continue...");
}

/**
 * Displays topic-wise statistics
 * @param {Array<Object>} topicStats - The topic-wise statistics data
 * @returns {Promise<void>}
 */
async function displayTopicStats(topicStats) {
  console.log(styleText("cyan", "Topic-wise Statistics"));
  console.log("─".repeat(50));

  if (!topicStats || topicStats.length === 0) {
    console.log(styleText("yellow", "No topic statistics available yet."));
  } else {
    console.log(
      styleText("yellow", "Topics ordered by success rate (highest first):\n")
    );

    // Table header
    console.log(
      "Topic".padEnd(20) +
        "Attempted".padEnd(15) +
        "Correct".padEnd(15) +
        "Success Rate"
    );
    console.log("─".repeat(60));

    // Table rows
    topicStats.forEach((topic) => {
      let successRateText;
      if (topic.success_rate >= 80) {
        successRateText = styleText(
          "green",
          `${topic.success_rate.toFixed(2)}%`
        );
      } else if (topic.success_rate >= 60) {
        successRateText = styleText(
          "yellow",
          `${topic.success_rate.toFixed(2)}%`
        );
      } else {
        successRateText = styleText("red", `${topic.success_rate.toFixed(2)}%`);
      }

      console.log(
        topic.topic_name.substring(0, 18).padEnd(20) +
          topic.attempted.toString().padEnd(15) +
          topic.correct.toString().padEnd(15) +
          successRateText
      );
    });

    // Analysis of strongest and weakest topics
    if (topicStats.length > 1) {
      const strongest = topicStats[0];
      const weakest = topicStats[topicStats.length - 1];

      console.log("\nAnalysis:");
      console.log(
        styleText(
          "green",
          `Strongest topic: ${
            strongest.topic_name
          } (${strongest.success_rate.toFixed(2)}%)`
        )
      );
      console.log(
        styleText(
          "red",
          `Topic needing most improvement: ${
            weakest.topic_name
          } (${weakest.success_rate.toFixed(2)}%)`
        )
      );
    }
  }

  await prompt("\nPress [Enter] to continue...");
}

/**
 * Displays mode-wise statistics
 * @param {Array<Object>} modeStats - The mode-wise statistics data
 * @returns {Promise<void>}
 */
async function displayModeStats(modeStats) {
  console.log(styleText("cyan", "Mode-wise Statistics"));
  console.log("─".repeat(50));

  if (!modeStats || modeStats.length === 0) {
    console.log(styleText("yellow", "No mode statistics available yet."));
  } else {
    console.log(
      styleText("yellow", "Learning modes ordered by success rate:\n")
    );

    // Table header
    console.log(
      "Mode".padEnd(20) +
        "Attempted".padEnd(15) +
        "Correct".padEnd(15) +
        "Success Rate"
    );
    console.log("─".repeat(60));

    // Table rows
    modeStats.forEach((mode) => {
      let successRateText;
      if (mode.success_rate >= 80) {
        successRateText = styleText(
          "green",
          `${mode.success_rate.toFixed(2)}%`
        );
      } else if (mode.success_rate >= 60) {
        successRateText = styleText(
          "yellow",
          `${mode.success_rate.toFixed(2)}%`
        );
      } else {
        successRateText = styleText("red", `${mode.success_rate.toFixed(2)}%`);
      }

      console.log(
        mode.mode_name.substring(0, 18).padEnd(20) +
          mode.attempted.toString().padEnd(15) +
          mode.correct.toString().padEnd(15) +
          successRateText
      );
    });

    // Determine strongest/weakest modes
    if (modeStats.length > 1) {
      console.log("\nInsights:");

      const mostUsedMode = [...modeStats].sort(
        (a, b) => b.attempted - a.attempted
      )[0];
      console.log(
        `Most used mode: ${styleText("cyan", mostUsedMode.mode_name)} (${
          mostUsedMode.attempted
        } questions)`
      );

      const bestMode = modeStats[0];
      console.log(
        `Best performance in: ${styleText(
          "green",
          bestMode.mode_name
        )} (${bestMode.success_rate.toFixed(2)}%)`
      );
    }
  }

  await prompt("\nPress [Enter] to continue...");
}

/**
 * Displays detailed statistics history
 * @param {Array<Object>} detailedStats - The detailed statistics data
 * @returns {Promise<void>}
 */
async function displayDetailedStats(detailedStats) {
  console.log(styleText("cyan", "Detailed Learning History"));
  console.log("─".repeat(50));

  if (!detailedStats || detailedStats.length === 0) {
    console.log(styleText("yellow", "No detailed statistics available yet."));
  } else {
    // Show the most recent sessions first
    console.log(styleText("yellow", "Recent learning sessions:\n"));

    // Table header
    console.log(
      "Topic".padEnd(15) +
        "Mode".padEnd(15) +
        "Attempted".padEnd(10) +
        "Correct".padEnd(10) +
        "Avg Score".padEnd(10) +
        "Date"
    );
    console.log("─".repeat(70));

    // Only show the 10 most recent sessions
    const recentSessions = detailedStats.slice(0, 10);

    recentSessions.forEach((session) => {
      // Format the date
      const date = new Date(session.last_played);
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

      let scoreText;
      if (session.avg_score >= 80) {
        scoreText = styleText("green", `${session.avg_score.toFixed(1)}%`);
      } else if (session.avg_score >= 60) {
        scoreText = styleText("yellow", `${session.avg_score.toFixed(1)}%`);
      } else {
        scoreText = styleText("red", `${session.avg_score.toFixed(1)}%`);
      }

      console.log(
        session.topic_name.substring(0, 13).padEnd(15) +
          session.mode_name.substring(0, 13).padEnd(15) +
          session.attempted.toString().padEnd(10) +
          session.correct.toString().padEnd(10) +
          scoreText.padEnd(17) +
          formattedDate
      );
    });

    // Show a summary
    console.log("\nSummary:");
    console.log(
      `Total unique topic-mode combinations: ${detailedStats.length}`
    );

    // Calculate total time spent (estimate)
    const totalAttempted = detailedStats.reduce(
      (sum, session) => sum + session.attempted,
      0
    );
    const estimatedTimeMin = Math.round(totalAttempted * 1.5); // Assuming average 1.5 min per question
    console.log(
      `Estimated total learning time: ~${estimatedTimeMin} minutes (${Math.floor(
        estimatedTimeMin / 60
      )} hours, ${estimatedTimeMin % 60} minutes)`
    );
  }

  await prompt("\nPress [Enter] to continue...");
}
