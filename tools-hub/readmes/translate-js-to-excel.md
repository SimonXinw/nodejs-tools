# translateJsToExcel

## 作用

将 JavaScript 模块 **默认导出** 的数据转为 Excel（`.xlsx`）。

## 两种入口模式

1. **未传 `config` 或缺路径**：从 `excel-json-translate/pending-files/js` 读取第一个文件，导出到 `output-files/js`，列名默认为「变量名 / spmb key」键值展开。
2. **传入 `entryPath` / `outputPath`**：动态 `import(entryPath)`，将对象转为行后写入 `outputPath.xlsx`（注意扩展名拼接逻辑见源码）。

## 数据形状

- 若默认导出为 **对象**：按键展开为 `{ 变量名, spmb key }` 行。
- 若默认导出为 **数组**：视为已是行数组，直接写入 sheet。

## 注意

文件底部有示例性的立即调用 `translateJsToExcel()`；作为库使用时注意避免副作用。
