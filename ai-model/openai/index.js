import { readFile, writeFile } from "node:fs/promises";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const SOURCE_FILE_URL = new URL("./us.json", import.meta.url);
const TARGET_FILE_URL = new URL("./cn.json", import.meta.url);
const DEFAULT_MODEL = "gpt-4.1-mini";

const parseEnvValue = (rawValue) => {
  const trimmedValue = rawValue.trim();

  if (
    (trimmedValue.startsWith("\"") && trimmedValue.endsWith("\"")) ||
    (trimmedValue.startsWith("'") && trimmedValue.endsWith("'"))
  ) {
    return trimmedValue.slice(1, -1);
  }

  return trimmedValue;
};

const readApiKeyFromEnvFile = async () => {
  try {
    const envFileUrl = new URL("../../.env", import.meta.url);
    const envFileContent = await readFile(envFileUrl, "utf8");
    const matchedLine = envFileContent.match(/^OPENAI_API_KEY=(.+)$/m);

    if (!matchedLine) {
      return "";
    }

    return parseEnvValue(matchedLine[1]);
  } catch (error) {
    return "";
  }
};

const getApiKey = async () => {
  if (process.env.OPENAI_API_KEY) {
    return process.env.OPENAI_API_KEY;
  }

  const envFileApiKey = await readApiKeyFromEnvFile();

  if (envFileApiKey) {
    return envFileApiKey;
  }

  throw new Error("未找到 OPENAI_API_KEY，请先设置环境变量或在项目根目录创建 .env 文件。");
};

const requestChatCompletion = async ({ apiKey, model, messages }) => {
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0,
      response_format: {
        type: "json_object",
      },
      max_tokens: 2000,
    }),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`[${response.status}] ${responseText}`);
  }

  return JSON.parse(responseText);
};

const extractJsonText = (content) => {
  const trimmedContent = content.trim();

  if (trimmedContent.startsWith("```")) {
    return trimmedContent
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }

  return trimmedContent;
};

const translateJsonObject = async ({ apiKey, sourceObject, model }) => {
  const completion = await requestChatCompletion({
    apiKey,
    model,
    messages: [
      {
        role: "system",
        content:
          "你是一个专业的英文到简体中文翻译助手。请严格保持 JSON 结构、键名、层级、数组顺序和数据类型不变。只翻译字符串值，不要新增、删除或重命名任何字段。输出必须是合法 JSON，且不要输出 JSON 之外的任何内容。",
      },
      {
        role: "user",
        content: `请把下面的 JSON 文案翻译成简体中文，并只返回翻译后的 JSON：\n${JSON.stringify(sourceObject, null, 2)}`,
      },
    ],
  });

  const content = completion.choices?.[0]?.message?.content ?? "";
  const translatedJsonText = extractJsonText(content);

  return {
    translatedObject: JSON.parse(translatedJsonText),
    usage: completion.usage ?? { total_tokens: 0 },
    model: completion.model ?? model,
  };
};

const main = async () => {
  const apiKey = await getApiKey();
  const sourceFileContent = await readFile(SOURCE_FILE_URL, "utf8");
  const sourceObject = JSON.parse(sourceFileContent);

  console.log("开始翻译 us.json ...");

  const { translatedObject, usage, model } = await translateJsonObject({
    apiKey,
    sourceObject,
    model: DEFAULT_MODEL,
  });

  await writeFile(
    TARGET_FILE_URL,
    `${JSON.stringify(translatedObject, null, 2)}\n`,
    "utf8",
  );

  console.log(`模型: ${model}`);
  console.log(`Token 使用量: ${usage.total_tokens}`);
  console.log("已生成 ai-model/openai/cn.json");
  console.log(JSON.stringify(translatedObject, null, 2));
};

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
