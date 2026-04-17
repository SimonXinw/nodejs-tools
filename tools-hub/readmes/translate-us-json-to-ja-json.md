# translateUsJsonToJaJson

## 作用

端到端任务：读取 `ai-model/openai/us.json`，将其中 **用户可见英文字符串** 译为日语，**保持键名与结构不变**，写入 `ai-model/openai/ja.json`。

## 流程概要

1. `createLogger` 记录全过程（含文件路径、模型、字符量统计等）。
2. 拼接日语本地化 system 与 **JSON 专用追加规则**（禁止改键、改类型等）。
3. 调用 `openAiTranslate`，`responseFormat: "json_object"`。
4. 校验 `JSON.parse` 后写回目标文件。

## 运行方式

可作为模块 `import { translateUsJsonToJaJson } from "..."` 调用，也可直接 `node ai-model/openai/tasks/translate-us-to-ja-json.js` 执行（文件末尾有 `isDirectRun` 判断）。

## 依赖环境

需要有效 `OPENAI_API_KEY`；大 JSON 时注意模型上下文与输出 token 上限。
