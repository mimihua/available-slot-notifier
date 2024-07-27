/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as logger from "firebase-functions/logger";

import {onSchedule} from "firebase-functions/v2/scheduler";
import {helloworld} from "./puppeteer_script";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const scheduledFunction = onSchedule("* * * * *", async () => {
  logger.log("Schedule function triggered!");
  // Fetch all user details.
  await helloworld();

  logger.log("Schedule function completed!");
});
