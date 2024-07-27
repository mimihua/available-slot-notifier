import {Client, GatewayIntentBits} from "discord.js";
import * as dotenv from "dotenv";


// 加载环境变量
dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent],
});

const token = process.env.DISCORD_TOKEN;
const channelId = "1266637509740462113";

client.once("ready", () => {
  console.log("Bot is ready!");
});

async function sendNotification(message: string) {
  try {
    const channel = await client.channels.fetch(channelId);
    if (channel && channel.isTextBased()) {
      channel.send(message);
    } else {
      console.error("The channel is not found or not a text channel");
    }
  } catch (error) {
    console.error("Error fetching the channel:", error);
  }
}

client.login(token).then(() => {
  sendNotification("Hello, this is a test notification!");
});
