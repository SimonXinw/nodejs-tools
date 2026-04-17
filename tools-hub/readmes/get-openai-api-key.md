# getOpenAiApiKey

## 作用

解析并返回 OpenAI API Key，供 `openAiChatCompletion` 等客户端使用。

## 解析顺序

1. `process.env.OPENAI_API_KEY`（非空则直接返回）。
2. 读取仓库根目录 `.env` 中 `OPENAI_API_KEY=...` 行（支持简单引号包裹）。

## 失败行为

若两处均未配置，抛出明确错误，提示使用环境变量、`--env-file` 或根目录 `.env`。

## 注意

- 不要在日志中打印完整 Key；当前任务脚本仅记录长度作为审计提示。
