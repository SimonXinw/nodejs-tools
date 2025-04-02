/**
 * 触发案例
 */
// 在浏览器控制台运行的完整测试用例
// (function () {
//   // 配置参数
//   const SECRET = "mysecret"; // 与代码中的SECRET保持一致
//   const PORT = 3001;
//   const PAYLOAD = {
//     ref: "refs/heads/qa",
//     repository: {
//       name: "showroom-ui",
//       full_name: "chendianWeprotalk/showroom-ui",
//     },
//     pusher: {
//       name: "test-user",
//       email: "test@example.com",
//     },
//     commits: [
//       {
//         id: "abc123",
//         message: "Test commit",
//       },
//     ],
//   };

//   // 生成 HMAC-SHA256 签名（浏览器兼容版）
//   async function generateSignature(secret, payload) {
//     const encoder = new TextEncoder();
//     const key = await crypto.subtle.importKey(
//       "raw",
//       encoder.encode(secret),
//       { name: "HMAC", hash: { name: "SHA-256" } },
//       false,
//       ["sign"]
//     );
//     const data = encoder.encode(JSON.stringify(payload));
//     const signature = await crypto.subtle.sign("HMAC", key, data);
//     return Array.from(new Uint8Array(signature))
//       .map((b) => b.toString(16).padStart(2, "0"))
//       .join("");
//   }

//   // 发送测试请求
//   (async function sendTestRequest() {
//     try {
//       // 生成签名
//       const signature = await generateSignature(SECRET, PAYLOAD);

//       // 构造请求选项
//       const requestOptions = {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Hub-Signature-256": `sha256=${signature}`,
//         },
//         body: JSON.stringify(PAYLOAD),
//       };

//       // 发送请求
//       const response = await fetch(
//         `http://localhost:${PORT}/github-webhook`,
//         requestOptions
//       );
//       const text = await response.text();

//       // 输出结果
//       console.log("✅ 请求成功:", text);
//     } catch (error) {
//       console.error("❌ 请求失败:", error.message);
//     }
//   })();
// })();

/**
 * curl
 */
// curl -v -X POST http://localhost:3000/github-webhook \
//   -H "Content-Type: application/json" \
//   -d '{
//     "ref": "refs/heads/qa",
//     "repository": { "name": "showroom-ui" },
//     "pusher": { "name": "test-user" }
//   }'
