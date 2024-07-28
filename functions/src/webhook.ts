import * as axios from "axios";

const webhookUrl = "https://discord.com/api/webhooks/1267023633793028177/cFbEvAR6ZmJl_A1Lhkn26Rm1O_OPFZYo8d4YcHe1yEsOK072tVOsHjZ1XkHXKYwebhDH";

// 发送简单文本消息
const sendSimpleMessage = async () => {
  try {
    const response = await axios.post(webhookUrl, {
      content: "这是一个测试消息",
    });
    if (response.status === 204) {
      console.log("消息发送成功");
    }
  } catch (error) {
    console.error("消息发送失败", error);
  }
};

// 发送带有嵌入内容的消息
const sendEmbedMessage = async () => {
  try {
    const response = await axios.post(webhookUrl, {
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
};

// 调用函数发送消息
sendSimpleMessage();
sendEmbedMessage();
