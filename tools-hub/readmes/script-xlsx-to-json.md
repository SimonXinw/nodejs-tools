# xls-to-json 管线（excel-json-translate/xlsxToJson.js）

## 作用

使用 npm 包 `xls-to-json`，将指定 **输入表格** 转为 **JSON 文件**（示例中为 `./d9.xlsx` → `./d9.json`）。

## 技术栈

- **CommonJS**：`require("xls-to-json")`，与仓库多数 ESM 文件并存；Node 下需注意混用场景。

## 运行

在配置路径有效前提下：

```bash
node excel-json-translate/xlsxToJson.js
```

## 调整

修改 `input` / `output` / `sheet` 字段以适配实际表名与路径。
