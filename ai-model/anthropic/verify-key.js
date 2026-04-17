import axios from "axios";

const ANTHROPIC_MESSAGES_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

/** 最小请求：便宜模型 + 极少 token */
const VERIFY_MODEL = "claude-3-haiku-20240307";

const apiKey = process.env.ANTHROPIC_API_KEY?.trim();

if (!apiKey) {
  console.error(
    "缺少环境变量 ANTHROPIC_API_KEY。示例（PowerShell）：\n" +
      '  $env:ANTHROPIC_API_KEY="你的key"; node ai-model/anthropic/verify-key.js'
  );

  process.exit(1);
}

const main = async () => {
  try {
    const { data } = await axios.post(
      ANTHROPIC_MESSAGES_URL,
      {
        model: VERIFY_MODEL,
        max_tokens: 8,
        messages: [{ role: "user", content: "只回复一个字：好" }],
      },
      {
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": ANTHROPIC_VERSION,
        },
        timeout: 30_000,
      }
    );

    const text =
      data?.content?.find((block) => block.type === "text")?.text ?? "";

    console.log("Key 可用。模型返回片段：", JSON.stringify(text));

    process.exit(0);
  } catch (err) {
    const status = err.response?.status;
    const body = err.response?.data;

    console.error("请求失败。", status ? `HTTP ${status}` : err.message);

    if (body) {
      console.error(JSON.stringify(body, null, 2));
    }

    process.exit(1);
  }
};

main();
