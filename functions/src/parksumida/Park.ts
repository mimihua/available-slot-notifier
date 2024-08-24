import axios from "axios";

const fetchData = async () => {
  // 获取当前日期时间
  const currentDate = new Date();
  
  // 格式化日期时间为 "Thu, 15 Aug 2024 09:33:56 GMT" 形式
  const localeString = currentDate.toUTCString();
  
  // 构建包含 LocaleString 参数的 URL
  const baseUrl = "https://yoyaku02.city.sumida.lg.jp/Web/StartPage.aspx";
  const startPage = "ModeSelect";
  const url = `${baseUrl}?Startpage=${startPage}&LocaleString=${encodeURIComponent(localeString)}`;
  
  // 发送初始请求
  const sessionID = await axios.get(url)
    .then(response => {
      // 假设会话标识符在响应URL的重定向中
      const redirectURL = response.request.res.responseUrl;
      const sessionIDMatch = redirectURL.match(/\(S\((.*?)\)\)/);
  
      // response的location内容取得
      console.log("sessionIDMatch:", sessionIDMatch[1]);
  
      // 返回会话标识符
      return sessionIDMatch[1];
    });
  
  // 使用上面返回的sessionID 会话标识符发送后续请求
  const urls = [
    `https://yoyaku02.city.sumida.lg.jp/Web/(S(${sessionID}))/Wg_ModeSelect.aspx`,
    `https://yoyaku02.city.sumida.lg.jp/Web/(S(${sessionID}))/Wg_KoukyouShisetsuYoyakuMoushikomi.aspx`,
    `https://yoyaku02.city.sumida.lg.jp/Web/(S(${sessionID}))/Wg_ShisetsuKensaku.aspx`,
    `https://yoyaku02.city.sumida.lg.jp/Web/(S(${sessionID}))/Wg_NichijiSentaku.aspx`,
    `https://yoyaku02.city.sumida.lg.jp/Web/(S(${sessionID}))/Wg_ShisetsubetsuAkiJoukyou.aspx`
  ];
  
  const makeRequest = async (url: string) => {
    try {
      const response = await axios.get(url, { withCredentials: true });
      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
  
  for (const url of urls) {
    const response = await makeRequest(url);
    if (response) {
      console.log("Response data for URL:", url, response.data);
    } else {
      console.error("Failed to get response for URL:", url);
    }
  }
};

// 调用 fetchData 函数
fetchData();

// 使用会话标识符发送后续请求
// return `https://yoyaku02.city.sumida.lg.jp/Web/(S(${sessionIDMatch[1]}))/Wg_ModeSelect.aspx`;
// return `https://yoyaku02.city.sumida.lg.jp/Web/(S(${sessionIDMatch[1]}))/Wg_KoukyouShisetsuYoyakuMoushikomi.aspx` // 公共施設利用メニュー選択後
// return `https://yoyaku02.city.sumida.lg.jp/Web/(S(${sessionIDMatch[1]}))/Wg_ShisetsuKensaku.aspx` //空き照会選択後
// return `https://yoyaku02.city.sumida.lg.jp/Web/(S(${sessionIDMatch[1]}))/Wg_NichijiSentaku.aspx` //公園運動場選択後
// return `https://yoyaku02.city.sumida.lg.jp/Web/(S(${sessionIDMatch[1]}))/Wg_ShisetsubetsuAkiJoukyou.aspx` //土日祝選択後URL