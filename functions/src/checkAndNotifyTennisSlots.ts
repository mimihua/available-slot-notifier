
import * as dotenv from "dotenv";
import { Webhooks } from "./webhook";
import { findAvailableTennisSlots } from "./findAvailableTennisSlots";


// 加载环境变量
dotenv.config();

// 网球场空位查找
export async function checkAndNotifyTennisSlots() {
  console.log("Hello, World!");

  // discord-bot.ts 保留
  // // 检查机器人是否成功登录
  // const bot = DiscordBot.getInstance();
  // setTimeout(() => {
  //   if (!bot.checkLoginStatus()) {
  //     console.log("Failed to login to Discord.");
  //   } else {
  //     console.log("Successfully logged in to Discord.");
  //   }
  // }, 5000);

  // puppeteer-script.ts 
  // 利用 Puppeteer 获取网页内容并返回内容
  findAvailableTennisSlots();

  // webhook.ts
  // 发送简单消息
  Webhooks.sendSimpleMessage();

}

checkAndNotifyTennisSlots();
