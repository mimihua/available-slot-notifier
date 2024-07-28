import {DiscordBot} from "./discord-bot";

import * as dotenv from "dotenv";


// 加载环境变量
dotenv.config();

export async function helloworld() {
  console.log("Hello, DiscordBot!");

  // 实例化对象并调用异步初始化方法
  // const bot = new DiscordBot();

  // await bot.initialize();
  // bot.sendMessage("Hello, World!");

  // const token = process.env.DISCORD_TOKEN?.toString() ?? "";
  // 检查机器人是否成功登录
  const bot = DiscordBot.getInstance();
  setTimeout(() => {
    if (!bot.checkLoginStatus()) {
      console.log("Failed to login to Discord.");
    } else {
      console.log("Successfully logged in to Discord.");
    }
  }, 5000);
}

helloworld();
