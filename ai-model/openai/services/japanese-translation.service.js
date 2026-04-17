import { openAiTranslate } from "../clients/openai.client.js";
import {
  JAPANESE_LOCALIZATION_SYSTEM_PROMPT,
  JAPANESE_LOCALIZATION_USER_PROMPT,
} from "../prompts/japanese-translate-prompt.js";

/**
 * 将英文内容翻译为适用于日本站点（ja-JP）的日语（单段文本）。
 *
 * @param {string} text
 * @param {{ apiKey?: string; model?: string }} [options]
 * @returns {Promise<string>}
 */
export const translateToJapanese = async (text, options = {}) => {
  const { apiKey, model } = options;

  return openAiTranslate({
    apiKey,
    model,
    systemContent: JAPANESE_LOCALIZATION_SYSTEM_PROMPT,
    userContent: JAPANESE_LOCALIZATION_USER_PROMPT,
    text,
  });
};
