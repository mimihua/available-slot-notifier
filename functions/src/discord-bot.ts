import {Client, GatewayIntentBits, Message} from "discord.js";
import * as dotenv from "dotenv";


// 加载环境变量
dotenv.config();

// DiscordBot 类
export class DiscordBot {
  private static instance: DiscordBot;
  private client: Client;
  private token: string;
  private isLoggedIn: boolean;

  private constructor() {
    this.client = new Client({intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent]});
    this.token = process.env.DISCORD_TOKEN?.toString() ?? "";
    this.isLoggedIn = false;

    this.initialize();
  }

  public static getInstance(): DiscordBot {
    if (!DiscordBot.instance) {
      DiscordBot.instance = new DiscordBot();
    }
    return DiscordBot.instance;
  }

  private initialize() {
    // 当机器人成功登录时触发
    this.client.once("ready", () => {
      this.isLoggedIn = true;
      console.log("Bot is online!");
    });

    // 当机器人接收到消息时触发
    this.client.on("messageCreate", (message: Message) => {
      this.handleMessage(message);
    });

    // 尝试登录到 Discord
    this.client.login(this.token).then(() => {
      console.log("Login successful");
    }).catch((error) => {
      console.error("Failed to login:", error);
      this.isLoggedIn = false;
    });
  }

  // 处理来自channel的消息
  private handleMessage(message: Message) {
    // 忽略来自机器人的消息
    if (message.author.bot) return;

    // 如果消息内容是 'ping'
    if (message.content === "ping") {
      // 回复 'pong'
      message.channel.send("pong");
    }
  }

  public checkLoginStatus(): boolean {
    return this.isLoggedIn;
  }
}
