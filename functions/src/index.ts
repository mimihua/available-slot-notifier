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
import { defineInt, defineSecret } from "firebase-functions/params";

const config : GlobalOptions = {
  memory: "1GiB",
  timeoutSeconds: 300,
  maxInstances: 1,
}
defineInt("SEARCH_WAIT_TIME");
// Cloud Functions

export const scheduledFunction = onSchedule({
  schedule: "0,20 6-23,0-1 * * *",
  timeZone: "Asia/Tokyo",
  secrets: [defineSecret("WEBHOOK_URL")],
  ...config
}, async () => {
  logger.log("Schedule function triggered!");

  await installChrome();
  await checkAndNotifyTennisSlots();

  logger.log("Schedule function completed!");
});

export const helloWorld = onRequest({
  secrets: [defineSecret("WEBHOOK_URL")],
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
logger.log("Installing Chrome...");
async function installChrome() {
  try {
    const { stdout, stderr } = await execCommand("npx puppeteer browsers install chrome");
    if (stdout) logger.log(stdout);
    if (stderr) logger.warn(stderr);
  } catch (error) {
    logger.error("Error installing Chrome:" , error);
  }
  logger.log("Chrome installed!");
}

// debug code
// (cd src && ts-node index.ts)
// checkAndNotifyTennisSlots();
