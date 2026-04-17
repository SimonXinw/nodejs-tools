# getExcelJsData

## 作用

读取本地 **xlsx/xls** 文件（buffer），用 `xlsx` 解析后返回指定工作表（或第一张表）的 **JSON 行数组**。

## 参数（config）

- `fileUrl`：文件路径；默认示例指向 `SrcFile` 下某 xlsx（可按需覆盖）。
- `tableName`：工作表名称；不传则取工作簿第一张表。

## 返回值

`Promise<Array<Record<string, unknown>> | null>`：行对象数组；异常或空表时可能为 `null`（以实现为准）。

## 典型用途

为 `toExcelFile` 或其它数据处理管道提供中间 JSON 表示。
