import { displaySelectionMenu, prompt } from "./displaySelectionMenu.js";
import {
  getAvailableTopics,
  getModeData,
  getQuestions,
} from "./data/database.js";

export { ManagementMode };

async function ManagementMode() {
  const ManagementModes = [
    "Exit ManagementMode",
    "Create new Categorie",
    "Rename Category",
    "Edit Questions and Answers",
    "Generate Questions and Answers through AI",
  ];
  let ManagementModeIdex;
  let topicIdx;
  const topicData = getAvailableTopics();

  while (true) {
    ManagementModeIdex = await displaySelectionMenu(
      ManagementModes,
      "Please select a mode:",
      -1
    );

    if (ManagementModeIdex === -1) {
      break; // Beenden der schleife
    }
    switch (ManagementModeIdex) {
      case 0:
        break;

      case 1:
        topicIdx = await displaySelectionMenu(topicData);
        topicData[topicIdx] = prompt(
          `New Category name for ${topicData[topicIdx]}: `
        );
        SaveData();
        break;

      case 2:
        break;

      default:
        break;
    }
  }
}
