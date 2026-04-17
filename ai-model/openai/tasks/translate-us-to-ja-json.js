import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, writeFile } from "node:fs/promises";
import { createLogger } from "../../../lib/logger.js";
import {
  OPENAI_DEFAULT_TRANSLATION_MODEL,
  OPENAI_DEFAULTS,
} from "../config.js";
import { getOpenAiApiKey, openAiTranslate } from "../clients/openai.client.js";
import { JAPANESE_LOCALIZATION_SYSTEM_PROMPT } from "../prompts/japanese-translate-prompt.js";

const SOURCE_FILE_URL = new URL("../us.json", import.meta.url);
const TARGET_FILE_URL = new URL("../ja.json", import.meta.url);

const JSON_TRANSLATE_EXTRA_SYSTEM = `
追加规则（JSON）：
- 严格保持 JSON 结构、键名、层级、数组顺序与数据类型不变。
- 仅翻译适合对用户展示的英文字符串值；不要增删字段或重命名键。
- 输出仅为合法 JSON，无任何说明文字。
`.trim();

/**
 * 读取 `us.json`，调用 `openAiTranslate` 整段译为日语（ja-JP），写入 `ja.json`。
 *
 * @param {{ apiKey?: string; model?: string }} [options]
 * @returns {Promise<void>}
 */
export const translateUsJsonToJaJson = async (options = {}) => {
  const log = await createLogger({ tag: "translate-us-to-ja" });
  const taskStartedAt = Date.now();

  const sourcePath = fileURLToPath(SOURCE_FILE_URL);
  const targetPath = fileURLToPath(TARGET_FILE_URL);

  const apiKey = options.apiKey ?? getOpenAiApiKey();
  const model = options.model ?? OPENAI_DEFAULT_TRANSLATION_MODEL;

  await log.info("开始");
  await log.info(`日志文件: ${log.filePath}`);
  await log.info(`模型: ${model}`);
  await log.info(`源文件: ${sourcePath}`);
  await log.info(`输出文件: ${targetPath}`);
  await log.info(
    `API Key: 已加载（长度 ${apiKey.length}，不打印明文）`,
  );

  const sourceText = await readFile(SOURCE_FILE_URL, "utf8");
  await log.info(`已读取源文件: ${sourceText.length} 字符`);

  const root = JSON.parse(sourceText);
  const payloadText = JSON.stringify(root, null, 2);
  await log.info(
    `待翻译 JSON（pretty）: ${payloadText.length} 字符；max_output_tokens=${OPENAI_DEFAULTS.maxOutputTokensJsonChunk}`,
  );

  const systemContent = `${JAPANESE_LOCALIZATION_SYSTEM_PROMPT}\n\n${JSON_TRANSLATE_EXTRA_SYSTEM}`;
  const userLead =
    "请将下方整段 JSON 中的英文用户可见文案翻译为日语（ja-JP），并只返回翻译后的 JSON：";
  const userMessageText = `${userLead}\n\n${payloadText}`;
  const messagesBodyChars =
    systemContent.length + userMessageText.length;

  await log.info(
    `发往 API 的正文字符数: system ${systemContent.length} + user（含 JSON）${userMessageText.length} = 合计约 ${messagesBodyChars}（与 openai 日志中 messages 正文一致）`,
  );

  const openAiCallStartedAt = Date.now();
  await log.info("正在请求 OpenAI（json_object）…");

  const jsonText = await openAiTranslate({
    apiKey,
    model,
    systemContent,
    userContent: userLead,
    text: payloadText,
    maxOutputTokens: OPENAI_DEFAULTS.maxOutputTokensJsonChunk,
    responseFormat: "json_object",
    onTelemetry: (line) => log.fileInfoOnly(line),
  });

  const openAiPhaseMs = Date.now() - openAiCallStartedAt;
  const openAiPhaseSec = (openAiPhaseMs / 1000).toFixed(1);

  await log.info(
    `OpenAI 调用阶段总耗时 ${openAiPhaseMs} ms（约 ${openAiPhaseSec} s）；返回字符串 ${jsonText.length} 字符`,
  );

  const translatedObject = JSON.parse(jsonText);
  const topKeys = Object.keys(translatedObject);
  await log.info(
    `JSON 解析成功，顶层键 (${topKeys.length}): ${topKeys.join(", ")}`,
  );

  const outText = `${JSON.stringify(translatedObject, null, 2)}\n`;
  await writeFile(TARGET_FILE_URL, outText, "utf8");
  await log.info(`已写入文件: ${outText.length} 字符`);

  const totalTaskMs = Date.now() - taskStartedAt;
  const totalTaskSec = (totalTaskMs / 1000).toFixed(1);

  await log.info(
    `任务总耗时 ${totalTaskMs} ms（约 ${totalTaskSec} s，含读文件、请求、解析与写盘）`,
  );
  await log.success(`完成: ${targetPath}`);
};

const isDirectRun = () => {
  const thisFile = path.resolve(fileURLToPath(import.meta.url));
  const entryFile = path.resolve(process.argv[1] ?? "");

  return thisFile === entryFile;
};

if (isDirectRun()) {
  translateUsJsonToJaJson().catch((error) => {
    console.error("[translate-us-to-ja] 失败:", error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exitCode = 1;
  });
}
