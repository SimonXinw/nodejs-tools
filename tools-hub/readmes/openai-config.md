# OpenAI 配置常量（config.js）

## 导出说明

| 符号 | 用途 |
|------|------|
| `OPENAI_CHAT_COMPLETIONS_URL` | Chat Completions HTTP 地址 |
| `OPENAI_MODELS` | 常用模型 id / 标签 / 备注映射 |
| `OPENAI_DEFAULT_TRANSLATION_MODEL` | 批量翻译默认模型 id |
| `OPENAI_MAX_OUTPUT_TOKENS_GPT_4_1_FAMILY` | 4.1 系单请求输出上限参考值 |
| `OPENAI_DEFAULTS` | 默认 `temperature`、`maxOutputTokens*` 等 |

## 文档价值

文件顶部长注释包含：模型选型建议、RPM/TPM 限流工程注意事项、各模型官方文档链接摘要。改模型或调参前应阅读对应段落。

## 与客户端关系

`clients/openai.client.js` 消费上述默认值；任务脚本可覆盖 `model` / `maxOutputTokens`。
