# createLogger

## 作用

异步工厂函数：在仓库根目录下创建 `logs/` 子目录，生成以 `tag` 与时间戳命名的 `.txt` 日志文件，并返回一组写入方法。

## 返回值

| 成员 | 说明 |
|------|------|
| `info` / `success` / `warn` / `error` | 同时写文件并根据级别输出到控制台（可关） |
| `fileInfoOnly` | 只追加到文件，不打控制台 |
| `filePath` | 当前日志文件绝对路径 |

## 参数

- `options.tag`：日志文件名前缀与行内标签。
- `options.echoToConsole`：默认 `true`；设为 `false` 则仅写文件。

## 文件格式

- 控制台：带 ANSI 图标与级别色。
- 文件：纯文本、无 ANSI，便于记事本查看。

## 典型用法

```js
const log = await createLogger({ tag: "my-task" });
await log.info("开始处理");
await log.error("失败原因…");
```
