# openAiChatCompletion

## 作用

对 OpenAI **Chat Completions** 端点发起 HTTP POST 的最小封装：组装 `Authorization`、`messages`、`temperature`、`max_tokens`、可选 `response_format`。

## 能力要点

- **长超时**：适合大包翻译场景（默认约 15 分钟级，见源码常量）。
- **重试**：对网络瞬断、超时等可恢复错误做有限次退避重试。
- **遥测**：默认 `console.log` 一行 token 与耗时摘要；可通过 `onTelemetry` 同步写入文件等。

## 参数摘要

- `model`：模型 id 字符串。
- `messages`：`{ role, content }[]`。
- `maxOutputTokens`：映射为请求体中的 `max_tokens`。
- `responseFormat`：`"text"` | `"json_object"` 或 `null`（不传格式约束）。

## 返回值

解析后的 **完整** API JSON（含 `choices`、`usage` 等），与「只取文本」的 `openAiTranslate` 不同。
