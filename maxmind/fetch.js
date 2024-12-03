// 替换为你的 MaxMind 账户 ID 和许可密钥
const accountId = "1094661"; // 替换为实际的 account ID
const licenseKey = ""; // 替换为实际的 license key

// 替换为你要查询的 IP 地址
const ipAddress = "181.215.229.164"; // 示例 IP 地址

// 构建请求 URL
const url = `https://geoip.maxmind.com/geoip/v2.1/country/${ipAddress}?pretty`;

// 配置基本认证的用户名和密码
const auth =
  "Basic " + Buffer.from(`${accountId}:${licenseKey}`).toString("base64");

// 使用 try-catch 结构
async function fetchGeoIPData() {
  try {
    const startTime = Date.now();
    // 发送 GET 请求
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: auth,
      },
    });

    if (!response.ok) {
      // 如果响应不是 2xx 状态码，抛出错误
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const latency = Date.now() - startTime;

    const data = await response.json(); // 解析 JSON 响应

    console.log("Response:", data); // 输出 API 响应数据
  } catch (error) {
    console.error("Error:", error); // 错误处理
  }
}

fetchGeoIPData(); // 调用函数
