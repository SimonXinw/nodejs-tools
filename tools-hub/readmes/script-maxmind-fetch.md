# MaxMind GeoIP 示例（maxmind/fetch.js）

## 作用

演示使用 **HTTP Basic** 认证调用 MaxMind **GeoIP2 Country** REST API，打印国家等信息。

## 使用前

将源码中的 `accountId`、`licenseKey` 替换为真实凭据；**勿将密钥提交到 Git**。

## 运行

```bash
node maxmind/fetch.js
```

## 扩展

可将 `ipAddress` 改为命令行参数或批量读取，用于简单的地理分布分析。
