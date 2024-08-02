
import { defineInt } from "firebase-functions/params";

export class Env {
  // SEARCH_WAIT_TIME
  static get searchWaitTime(): number {
    return defineInt("SEARCH_WAIT_TIME",{default:5000}).value();
  }
}