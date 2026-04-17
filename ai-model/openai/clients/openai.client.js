import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import axios from "axios";
import {
  OPENAI_CHAT_COMPLETIONS_URL,
  OPENAI_DEFAULTS,
  OPENAI_DEFAULT_TRANSLATION_MODEL,
} from "../config.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** 大包翻译：单次请求等待首字节 + 完整响应（避免 undici fetch 默认 headers 超时） */
const OPENAI_HTTP_TIMEOUT_MS = 900_000;

/** 大包或弱网下偶发断连，多试几次 */
const OPENAI_REQUEST_MAX_ATTEMPTS = 6;

const parseDotEnvValue = (rawValue) => {
  const trimmedValue = rawValue.trim();

  if (
    (trimmedValue.startsWith("\"") && trimmedValue.endsWith("\"")) ||
    (trimmedValue.startsWith("'") && trimmedValue.endsWith("'"))
  ) {
    return trimmedValue.slice(1, -1);
  }

  return trimmedValue;
};

/**
 * 从项目根目录 `.env` 读取 `OPENAI_API_KEY`（与 `clients/openai.client.js` 相对路径固定）。
 * 仅在进程环境变量未设置时使用。
 *
 * @returns {string}
 */
const readOpenAiApiKeyFromRootDotEnv = () => {
  try {
    const envFilePath = fileURLToPath(new URL("../../../.env", import.meta.url));

    if (!existsSync(envFilePath)) {
      return "";
    }

    const envFileContent = readFileSync(envFilePath, "utf8");
    const matchedLine = envFileContent.match(/^OPENAI_API_KEY=(.+)$/m);

    if (!matchedLine) {
      return "";
    }

    return parseDotEnvValue(matchedLine[1]);
  } catch {
    return "";
  }
};

/**
 * 读取 API Key：优先 `process.env.OPENAI_API_KEY`；否则读仓库根目录 `.env`（方便 F5 / 直接 node 运行）。
 * 仍可用系统环境变量或 `node --env-file=.env` 覆盖。
 *
 * @returns {string}
 */
export const getOpenAiApiKey = () => {
  const fromProcess = process.env.OPENAI_API_KEY?.trim();

  if (fromProcess) {
    return fromProcess;
  }

  const fromDotEnv = readOpenAiApiKeyFromRootDotEnv().trim();

  if (fromDotEnv) {
    return fromDotEnv;
  }

  throw new Error(
    "未找到 OPENAI_API_KEY：请设置进程环境变量，或在项目根目录 .env 中配置 OPENAI_API_KEY=...，或使用 node --env-file=.env",
  );
};

/**
 * @typedef {"text" | "json_object"} OpenAiResponseFormatType
 */

/**
 * @typedef {Object} OpenAiChatCompletionOptions
 * @property {string} [apiKey]
 * @property {string} model
 * @property {Array<{ role: string; content: string }>} messages
 * @property {number} [temperature]
 * @property {number} [maxOutputTokens]
 * @property {OpenAiResponseFormatType | null} [responseFormat]
 * @property {(line: string) => void | Promise<void>} [onTelemetry] 单行摘要（已 console），可写入文件等
 */

/**
 * @param {string} content
 * @returns {string}
 */
const extractJsonTextFromAssistant = (content) => {
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

/**
 * @param {OpenAiChatCompletionOptions} options
 * @returns {Promise<any>}
 */
export const openAiChatCompletion = async ({
  apiKey,
  model,
  messages,
  temperature = OPENAI_DEFAULTS.temperature,
  maxOutputTokens,
  responseFormat = null,
  onTelemetry = null,
}) => {
  const resolvedApiKey = apiKey ?? getOpenAiApiKey();

  const inputCharsApprox = messages.reduce(
    (sum, msg) => sum + String(msg.content ?? "").length,
    0,
  );

  /** @type {Record<string, string>} */
  const headers = {
    Authorization: `Bearer ${resolvedApiKey}`,
    "Content-Type": "application/json",
  };

  /** @type {Record<string, unknown>} */
  const body = {
    model,
    messages,
    temperature,
  };

  if (typeof maxOutputTokens === "number") {
    body.max_tokens = maxOutputTokens;
  }

  if (responseFormat) {
    body.response_format = { type: responseFormat };
  }

  /** @type {unknown} */
  let result;
  /** @type {unknown} */
  let lastError;
  let httpElapsedMs = 0;

  for (let attempt = 1; attempt <= OPENAI_REQUEST_MAX_ATTEMPTS; attempt += 1) {
    const attemptStartedAt = Date.now();

    try {
      const axiosResponse = await axios.post(
        OPENAI_CHAT_COMPLETIONS_URL,
        body,
        {
          headers,
          timeout: OPENAI_HTTP_TIMEOUT_MS,
          validateStatus: () => true,
        },
      );

      if (axiosResponse.status >= 400) {
        const detail =
          typeof axiosResponse.data === "string"
            ? axiosResponse.data
            : JSON.stringify(axiosResponse.data);

        throw new Error(`[${axiosResponse.status}] ${detail}`);
      }

      result = axiosResponse.data;
      httpElapsedMs = Date.now() - attemptStartedAt;
      lastError = undefined;
      break;
    } catch (error) {
      lastError = error;

      if (error instanceof Error && /^\[\d+\]/.test(error.message)) {
        throw error;
      }

      const axiosCode =
        error && typeof error === "object" && "code" in error
          ? String(error.code)
          : "";
      const cause = error?.cause;
      const causeCode =
        cause && typeof cause === "object" && "code" in cause
          ? String(cause.code)
          : "";
      const combinedCode = causeCode || axiosCode;
      const messageLower = String(
        error instanceof Error ? error.message : error,
      ).toLowerCase();

      const transient =
        combinedCode === "ECONNRESET" ||
        combinedCode === "ETIMEDOUT" ||
        combinedCode === "EPIPE" ||
        combinedCode === "ENOTFOUND" ||
        combinedCode === "UND_ERR_SOCKET" ||
        combinedCode === "UND_ERR_HEADERS_TIMEOUT" ||
        combinedCode === "ECONNABORTED" ||
        messageLower.includes("timeout");

      if (transient && attempt < OPENAI_REQUEST_MAX_ATTEMPTS) {
        await sleep(800 * attempt);
        continue;
      }

      break;
    }
  }

  if (result === undefined || result === null) {
    const error = lastError;
    const cause = error?.cause;
    const causeCode =
      cause && typeof cause === "object" && "code" in cause
        ? String(cause.code)
        : "";
    const causeMsg =
      cause && typeof cause === "object" && "message" in cause
        ? String(cause.message)
        : "";
    const axiosCode =
      error && typeof error === "object" && "code" in error
        ? String(error.code)
        : "";

    throw new Error(
      `OpenAI 网络请求失败: ${error instanceof Error ? error.message : String(error)}` +
        (axiosCode ? `（axios: ${axiosCode}）` : "") +
        (causeCode ? `（cause: ${causeCode}）` : "") +
        (causeMsg ? ` — ${causeMsg}` : ""),
    );
  }
  const usage = result.usage;
  const resolvedModel =
    typeof result.model === "string" ? result.model : model;

  const httpSecondsApprox = (httpElapsedMs / 1000).toFixed(1);

  /** @type {string} */
  let telemetryLine;

  if (usage && typeof usage === "object") {
    const promptTokens =
      typeof usage.prompt_tokens === "number" ? usage.prompt_tokens : "?";
    const completionTokens =
      typeof usage.completion_tokens === "number"
        ? usage.completion_tokens
        : "?";
    const totalTokens =
      typeof usage.total_tokens === "number" ? usage.total_tokens : "?";

    telemetryLine =
      `[openai] ${resolvedModel} · 输入约 ${inputCharsApprox} 字符（messages 正文） · ` +
      `输入 tokens: ${promptTokens} · 输出 tokens: ${completionTokens} · 合计: ${totalTokens} · ` +
      `HTTP 耗时 ${httpElapsedMs} ms（约 ${httpSecondsApprox} s）`;
  } else {
    telemetryLine =
      `[openai] ${resolvedModel} · 输入约 ${inputCharsApprox} 字符（messages 正文） · ` +
      `HTTP 耗时 ${httpElapsedMs} ms（约 ${httpSecondsApprox} s）`;
  }

  console.log(telemetryLine);

  if (typeof onTelemetry === "function") {
    await onTelemetry(telemetryLine);
  }

  return result;
};

/**
 * 通用「system + user + 待处理文本」翻译/改写入口。
 *
 * @typedef {Object} OpenAiTranslateOptions
 * @property {string} systemContent
 * @property {string} userContent
 * @property {string} text
 * @property {string} [apiKey]
 * @property {string} [model]
 * @property {number} [temperature]
 * @property {number} [maxOutputTokens]
 * @property {OpenAiResponseFormatType | null} [responseFormat]
 * @property {(line: string) => void | Promise<void>} [onTelemetry]
 *
 * @param {OpenAiTranslateOptions} options
 * @returns {Promise<string>}
 */
export const openAiTranslate = async ({
  systemContent,
  userContent,
  text,
  apiKey,
  model = OPENAI_DEFAULT_TRANSLATION_MODEL,
  temperature,
  maxOutputTokens = OPENAI_DEFAULTS.maxOutputTokensText,
  responseFormat = null,
  onTelemetry = null,
}) => {
  const completion = await openAiChatCompletion({
    apiKey,
    model,
    messages: [
      { role: "system", content: systemContent },
      { role: "user", content: `${userContent}\n\n${text}` },
    ],
    temperature,
    maxOutputTokens,
    responseFormat,
    onTelemetry,
  });

  const content = completion.choices?.[0]?.message?.content ?? "";

  if (responseFormat === "json_object") {
    const jsonText = extractJsonTextFromAssistant(content);

    return jsonText.trim();
  }

  return content.trim();
};
