# 定时 WebHook / deploy（timer.js）

## 作用

使用 `node-schedule` **每分钟**执行同目录下的 `deploy.sh`，将标准输出/错误与状态写入 `log.txt`。

## 运行

```bash
node "定时或监听 WebHook 事件执行脚本/timer.js"
```

## 环境要求

- 默认通过 `exec("bash deploy.sh")` 调用；在 **Windows** 上若无 bash/WSL 会失败，需改为 `pwsh`/`cmd` 或提供 sh 环境。

## 运维提示

分钟级定时任务对生产环境可能过于频繁；上线前请按实际需求调整 cron 表达式与脚本路径。
