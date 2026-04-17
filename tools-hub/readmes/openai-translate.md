# openAiTranslate

## 作用

在 `openAiChatCompletion` 之上的常用模式：**system 提示 + user 说明 + 待处理正文**，并默认只返回助手文本字符串。

## 与底层差异

- 自动构造两条 `messages`（`system`、`user`），其中 `user` 为 `userContent` 与 `text` 拼接。
- 默认模型与 `maxOutputTokens` 来自 `config.js` 中的翻译默认值。
- 当 `responseFormat === "json_object"` 时，会剥离可能的 ```json 代码块围栏后返回纯 JSON 文本。

## 适用场景

- 任意「单轮、单助手回复」的翻译或改写任务。
- 需要 JSON 输出时与 `json_object` 配合使用。
