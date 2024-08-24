import axios from "axios";
import dotenv from "dotenv";
import { defineString } from "firebase-functions/params";

dotenv.config();

export class Webhooks {
  
  private readonly webhookUrl: string = defineString("WEBHOOK_URL",{default:""}).value();

  public async sendSimpleMessage(info: string) {
    try {
      const response = await axios.post(this.webhookUrl, {
        content: info,
      });
      if (response.status === 204) {
        console.log("消息发送成功");
      }
    } catch (error) {
      console.error("消息发送失败", error);
    }
  }

  public async sendEmbedMessage() {
    try {
      const response = await axios.post(this.webhookUrl, {
        content: "这是一个带有嵌入内容的消息",
        embeds: [
          {
            title: "嵌入标题",
            description: "嵌入描述",
            url: "https://example.com",
            color: 14177041, // 十六进制颜色代码
            fields: [
              {
                name: "字段1",
                value: "字段值1",
                inline: true,
              },
              {
                name: "字段2",
                value: "字段值2",
                inline: true,
              },
            ],
            thumbnail: {
              url: "https://example.com/thumbnail.jpg",
            },
            image: {
              url: "https://example.com/image.jpg",
            },
            footer: {
              text: "页脚文本",
              icon_url: "https://example.com/footer_icon.jpg",
            },
          },
        ],
      });
      if (response.status === 204) {
        console.log("消息发送成功");
      }
    } catch (error) {
      console.error("消息发送失败", error);
    }
  }

}

// test
// const webhooks = new Webhooks();
// webhooks.sendSimpleMessage("这是一个简单的消息");