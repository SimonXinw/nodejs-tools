/**
 * 目录约定（本模块）：
 * - clients/   对外部 API 的最小封装（HTTP、鉴权），不含业务编排
 * - services/  可复用的领域能力（命名可用 *.service.js）
 * - tasks/     可执行的端到端脚本（读具体文件、组合 clients/services、写产物）
 * - prompts/   提示词常量
 */
export {
  getOpenAiApiKey,
  openAiChatCompletion,
  openAiTranslate,
} from "./clients/openai.client.js";
export {
  OPENAI_CHAT_COMPLETIONS_URL,
  OPENAI_DEFAULT_TRANSLATION_MODEL,
  OPENAI_DEFAULTS,
  OPENAI_MODELS,
} from "./config.js";
export { translateToJapanese } from "./services/japanese-translation.service.js";
export { translateUsJsonToJaJson } from "./tasks/translate-us-to-ja-json.js";
