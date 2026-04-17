/**
 * OpenAI Chat Completions 相关配置。
 *
 * 并发：官方不给「最大 HTTP 连接数」；实际由 RPM/TPM（及 RPD 等）限流，任一项先满即 429。下表 **Tier1** 为用量档示例，以控制台为准：
 * https://platform.openai.com/settings/organization/limits
 *
 * 单价：USD / 1M tokens（Standard），以定价页为准：
 * https://platform.openai.com/docs/pricing
 *
 * 上下文、max output、Tier1 RPM/TPM 摘自各模型文档（Long Context 表若与下表不同以模型页为准）：
 * https://developers.openai.com/api/docs/models/gpt-4.1-mini 等
 *
 * | 模型 id              | 输入/输出 $/1M | 上下文 | max output | Tier1 RPM | Tier1 TPM |
 * |----------------------|----------------|--------|------------|-----------|-----------|
 * | gpt-4.1-mini         | 0.40 / 1.60    | ~1M    | 32,768     | 500       | 200,000   |
 * | gpt-4o-mini          | 0.15 / 0.60    | 128k   | 16,384     | 500       | 200,000   |
 * | gpt-4.1              | 2.00 / 8.00    | ~1M    | 32,768     | 500       | 30,000    |
 * | gpt-4o               | 2.50 / 10.00   | 128k   | 16,384     | 500       | 30,000    |
 * | gpt-5.4              | 2.50 / 15.00   | ~1.05M | 128,000    | 500       | 500,000   |
 * | gpt-5.4-mini         | 0.75 / 4.50    | 400k   | 128,000    | 500       | 500,000   |
 * | gpt-5.4-nano         | 0.20 / 1.25    | 400k   | 128,000    | 500       | 200,000   |
 * | gpt-5.4-pro          | 30 / 180       | ~1.05M | 128,000    | 500       | 30,000    |
 * | gpt-5.4-2026-03-05   | 同 gpt-5.4     | 同左   | 同左       | 同左      | 同左      |
 *
 * 翻译默认模型与 max_tokens 上限见下方 `OPENAI_DEFAULT_TRANSLATION_MODEL` 与 `OPENAI_MAX_OUTPUT_TOKENS_GPT_4_1_FAMILY`。
 */

export const OPENAI_CHAT_COMPLETIONS_URL =
  "https://api.openai.com/v1/chat/completions";

/** @typedef {{ id: string; label: string; note?: string }} OpenAiModelOption */

/** @type {Record<string, OpenAiModelOption>} */
export const OPENAI_MODELS = {
  GPT_4_1_MINI: {
    id: "gpt-4.1-mini",
    label: "GPT-4.1 mini",
    note: "默认大批量翻译；费用/限流见文件头表格",
  },
  GPT_4O_MINI: {
    id: "gpt-4o-mini",
    label: "GPT-4o mini",
    note: "更便宜；TPM 与 4.1-mini 同档、max output 更小",
  },
  GPT_4_1: {
    id: "gpt-4.1",
    label: "GPT-4.1",
    note: "高质量；Tier1 TPM 低于 mini 系",
  },
  GPT_4O: {
    id: "gpt-4o",
    label: "GPT-4o",
    note: "旗舰之一；单价与 TPM 见表",
  },
  GPT_5_4: {
    id: "gpt-5.4",
    label: "GPT-5.4",
    note: "高输出上限；>272K 输入有官方加价规则见模型页",
  },
  GPT_5_4_PRO: {
    id: "gpt-5.4-pro",
    label: "GPT-5.4 Pro",
    note: "最贵、Tier1 TPM 与 4o 同量级；部分能力以 Responses API 为主见文档",
  },
  GPT_5_4_MINI: {
    id: "gpt-5.4-mini",
    label: "GPT-5.4 mini",
    note: "5.4 系轻量；TPM 与主 5.4 同档",
  },
  GPT_5_4_NANO: {
    id: "gpt-5.4-nano",
    label: "GPT-5.4 nano",
    note: "5.4 最便宜；Tier1 TPM 与 4o-mini/4.1-mini 同档",
  },
  GPT_5_4_SNAPSHOT_2026_03_05: {
    id: "gpt-5.4-2026-03-05",
    label: "GPT-5.4（快照 2026-03-05）",
    note: "与 gpt-5.4 同档计费/限流；锁定行为对比用",
  },
};

/** 默认用于「数万词级」批量翻译的模型（见上方说明） */
export const OPENAI_DEFAULT_TRANSLATION_MODEL = OPENAI_MODELS.GPT_4_1_MINI.id;

/** 与默认翻译模型 `gpt-4.1-mini` 对齐：官方标注 max output tokens = 32768（Chat Completions 的 max_tokens 不得超过该值） */
export const OPENAI_MAX_OUTPUT_TOKENS_GPT_4_1_FAMILY = 32768;

export const OPENAI_DEFAULTS = {
  temperature: 0,
  /** 纯文本翻译：默认用 4.1 系单请求输出上限 */
  maxOutputTokensText: OPENAI_MAX_OUTPUT_TOKENS_GPT_4_1_FAMILY,
  /** 整段 JSON 等：同样封顶 32768（换模型时请对照各模型文档的 max output） */
  maxOutputTokensJsonChunk: OPENAI_MAX_OUTPUT_TOKENS_GPT_4_1_FAMILY,
};
