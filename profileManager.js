/*
 * @Author: Lukas Kroczek
 * @Date: 2025-03-24
 * @Description: User profile management functionality
 * @Version: 1.0.0
 * @LastUpdate: 2025-03-24
 */

import { styleText } from "node:util";
import { prompt, displaySelectionMenu } from "./displaySelectionMenu.js";

/**
 * Manages user profiles - create, select, etc.
 * @param {Object} db - Database instance
 * @returns {Promise<number>} - The selected user ID
 */
export async function selectUserProfile(db) {
  console.clear();
  console.log(styleText("cyan", "Learning Platform - User Profiles"));
  console.log("─".repeat(50));

  // Get all existing users
  const users = await db.getAllUsers();

  // Prepare options for menu
  let options = ["Create New Profile"];
  if (users.length > 0) {
    users.forEach((user) => {
      options.push(`${user.username}`);
    });
  }

  const selectedIdx = await displaySelectionMenu(
    options,
    styleText("cyan", "Select a user profile:") +
      "\n" +
      styleText("yellow", "Select an existing profile or create a new one."),
    0
  );

  // If user pressed ESC, provide a default profile
  if (selectedIdx === -1) {
    console.log(
      styleText("yellow", "No profile selected. Using 'Default' profile.")
    );

    // Check if default profile exists, if not create it
    const defaultUser = users.find((user) => user.username === "Default");
    if (defaultUser) {
      return defaultUser.id;
    } else {
      const newUserId = await db.createUser("Default");
      console.log(styleText("green", "Default profile created."));
      return newUserId;
    }
  }

  // Create a new profile
  if (selectedIdx === 0) {
    return await createNewProfile(db);
  }

  // Return the selected user ID
  return users[selectedIdx - 1].id;
}

/**
 * Creates a new user profile
 * @param {Object} db - Database instance
 * @returns {Promise<number>} - The new user ID
 */
async function createNewProfile(db) {
  console.clear();
  console.log(styleText("cyan", "Create New Profile"));
  console.log("─".repeat(50));

  let username = "";
  let isValidUsername = false;

  while (!isValidUsername) {
    console.log(
      "Please enter a username (3-20 characters, letters and numbers only):"
    );
    username = await prompt("> ");

    // Check for cancel
    if (username.toLowerCase() === "exit") {
      console.log(
        styleText(
          "yellow",
          "Profile creation cancelled. Using 'Default' profile."
        )
      );

      // Check if default profile exists, if not create it
      const users = await db.getAllUsers();
      const defaultUser = users.find((user) => user.username === "Default");
      if (defaultUser) {
        return defaultUser.id;
      } else {
        const newUserId = await db.createUser("Default");
        console.log(styleText("green", "Default profile created."));
        return newUserId;
      }
    }

    // Validate username
    if (username.length < 3 || username.length > 20) {
      console.log(
        styleText("red", "Username must be between 3 and 20 characters.")
      );
      continue;
    }

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      console.log(
        styleText("red", "Username can only contain letters and numbers.")
      );
      continue;
    }

    // Check if username already exists
    const users = await db.getAllUsers();
    const exists = users.some(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
    if (exists) {
      console.log(
        styleText("red", "This username already exists. Please choose another.")
      );
      continue;
    }

    isValidUsername = true;
  }

  try {
    const newUserId = await db.createUser(username);
    console.log(
      styleText("green", `Profile '${username}' created successfully!`)
    );
    await prompt("\nPress [Enter] to continue...");
    return newUserId;
  } catch (error) {
    console.error("Error creating profile:", error);
    console.log(
      styleText("red", "Failed to create profile. Using 'Default' profile.")
    );

    // Check if default profile exists, if not create it
    const users = await db.getAllUsers();
    const defaultUser = users.find((user) => user.username === "Default");
    if (defaultUser) {
      return defaultUser.id;
    } else {
      const newUserId = await db.createUser("Default");
      console.log(styleText("green", "Default profile created."));
      return newUserId;
    }
  }
}
