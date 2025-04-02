#!/bin/bash

# 配置参数
SECRET="mysecret"  # 与代码中的SECRET保持一致
PORT=3001
PAYLOAD='{
  "ref": "refs/heads/qa",
  "repository": {
    "name": "showroom-ui",
    "full_name": "chendianWeprotalk/showroom-ui"
  },
  "pusher": {
    "name": "test-user",
    "email": "test@example.com"
  },
  "commits": [
    {
      "id": "abc123",
      "message": "Test commit"
    }
  ]
}'

# 生成 HMAC-SHA256 签名
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" -binary | openssl base64)

# 发送测试请求
curl -X POST "http://localhost:$PORT/github-webhook" \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=$SIGNATURE" \
  -d "$PAYLOAD"