import express from "express";
import crypto from "crypto";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// 计算 ES Module 版本的 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const shCmdPath = "C:\\Program Files\\Git\\bin\\sh.exe"; // 确保路径正确
const app = express();
const PORT = 3001;

// GitHub Webhook Secret（和 GitHub 配置的 Secret 保持一致）
const SECRET = "SimonXinw";

// 解析 GitHub 发送的 JSON 数据
app.use(express.json());

// Webhook 监听路由
app.post("/github-webhook", (req, res) => {
  console.log("收到 GitHub Webhook 请求");
  const signature = req.headers["x-hub-signature-256"];

  const payload = JSON.stringify(req.body || "不存在");

  if (!payload) {
    console.log(`GitHub Webhook Server, req.body: ${payload}`);
  }

  // 校验 GitHub Webhook 请求的合法性
  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(payload);
  const expectedSignature = `sha256=${hmac.digest("hex")}`;

  if (signature !== expectedSignature) {
    console.error("Webhook 权限验证失败！");
    return res.status(401).send("Error: 权限校验失败 >>> Unauthorized");
  }

  // 解析推送的分支
  const ref = req.body.ref; // 格式：refs/heads/qa
  console.log(`GitHub Webhook 收到 push 事件: ${ref}`);

  if (ref === "refs/heads/qa" || ref === "refs/heads/main") {
    console.log(`检测到 ${req.body.ref} 分支 push 事件，执行 deploy.sh...`);

    // 确保 deploy.sh 使用绝对路径
    const deployShPath = path.resolve(__dirname, "deploy.sh");

    // 确保路径用双引号包裹，防止空格问题

    const shellCmd = `${JSON.stringify(shCmdPath)} ${JSON.stringify(
      deployShPath
    )}`;

    console.log(`使用的 deploy.sh 绝对路径: ${shellCmd}`);

    // 执行 Shell 脚本（避免 Windows 空格路径问题）
    exec(shellCmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`server: 部署失败: ${error.message}`);
        return res.status(500).send("server: 部署失败");
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(`server: 部署成功: ${stdout}`);
      res.status(200).send("server: 部署完成");
    });
  } else {
    res.status(200).send("server: 不是 QA 分支，跳过执行");
  }
});

app.listen(PORT, () => {
  console.log(
    `🚀 Webhook 监听服务器运行在端口 http://localhost:${PORT}/github-webhook`
  );
});
