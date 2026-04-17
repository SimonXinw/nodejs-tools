# json-translate / translate.js

## 作用

示例脚本：从 `json-translate/json/cookies.json` 读取 JSON，将键值映射为带 `name` / `value` / `domain` 的结构数组，并写入 `json-translate/output-file/cookies.json`。

## 运行

在 `json-translate` 目录下或通过正确工作目录执行：

```bash
node json-translate/translate.js
```

## 注意

- 使用回调式 `fs.readFile` 与同步 `writeFileSync` 混用；若扩展为库建议改为 `fs/promises` 与清晰错误处理。
- 编码风格与仓库新版模块（双引号、ESM）不一致，后续可统一重构。
