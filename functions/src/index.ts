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
import {checkAndNotifyTennisSlots} from "./checkAndNotifyTennisSlots";
import {onRequest } from "firebase-functions/v2/https";
import { exec } from "child_process";
import { GlobalOptions } from "firebase-functions/v2/options";
import { defineInt } from "firebase-functions/params";
// import {onCall, onRequest} from "firebase-functions/v2/https";
// import { getFirestore } from "firebase-admin/firestore";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

const config : GlobalOptions = {
  memory: "1GiB",
  timeoutSeconds: 300,
  maxInstances: 1,
}
defineInt("SEARCH_WAIT_TIME");

export const scheduledFunction = onSchedule({
  schedule: "0 6-23 * * *",
  timeZone: "Asia/Tokyo",
  ...config
}, async () => {
  logger.log("Schedule function triggered!");

  await installChrome();
  await checkAndNotifyTennisSlots();

  logger.log("Schedule function completed!");
});

export const helloWorld = onRequest({
  ...config
},async (_req, res) => {

  await installChrome();
  await checkAndNotifyTennisSlots();

  res.send(`${defineInt("SEARCH_WAIT_TIME").value()}! I am a function.`);
});


// Function to execute a shell command and return a promise
function execCommand(command: string): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

// Function to install Chrome using Puppeteer
async function installChrome() {
  logger.log("Installing Chrome...");
  try {
    const { stdout, stderr } = await execCommand("npx puppeteer browsers install chrome");
    if (stdout) logger.log(stdout);
    if (stderr) logger.warn(stderr);
  } catch (error) {
    logger.error("Error installing Chrome:" , error);
  }
  logger.log("Chrome installed!");
}