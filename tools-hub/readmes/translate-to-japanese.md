# translateToJapanese

## 作用

将 **单段英文** 翻译为面向 **日本站点（ja-JP）** 的日语文案，使用 `japanese-translate-prompt.js` 中定义的 system / user 提示词，并调用 `openAiTranslate`。

## 参数

- `text`：待翻译正文。
- `options.apiKey`：可选，默认走 `getOpenAiApiKey`。
- `options.model`：可选，不传则使用配置中的默认翻译模型。

## 返回值

`Promise<string>`：译文字符串。

## 边界

- 不负责 JSON 结构保持；整文件 JSON 请用 `translateUsJsonToJaJson` 或自行扩展 system 规则。
