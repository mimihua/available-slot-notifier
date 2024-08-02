
import * as dotenv from "dotenv";
import { Park } from "./park/Park";


// 加载环境变量
dotenv.config();

// 网球场空位查找
export async function checkAndNotifyTennisSlots() {

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
  const park = new Park();
  await park.findAvailableTennisSlots();
  
}
