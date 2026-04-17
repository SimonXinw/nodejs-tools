# JAPANESE_LOCALIZATION_* 提示词

## 导出

- `JAPANESE_LOCALIZATION_SYSTEM_PROMPT`：系统级规则（敬体、术语、禁止事项等）。
- `JAPANESE_LOCALIZATION_USER_PROMPT`：用户消息模板中与任务描述相关的固定部分（与具体待译文本分离，由服务层拼接）。

## 作用

为 `translateToJapanese` 与 JSON 批量翻译任务提供一致的 **日语电商/站点文案** 风格约束，减少模型自由发挥。

## 修改建议

- 调整术语表或语气时，优先改 system，并保持与 JSON 任务中的追加规则不冲突。
- 大改后建议用固定样例回归对比 `us.json` / `ja.json` 输出。
