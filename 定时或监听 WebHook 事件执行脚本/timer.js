import path from "path";
import { exec } from "child_process";
import schedule from "node-schedule";
import { fileURLToPath } from "url";
import fs from "fs";

// 获取当前脚本所在目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scriptPath = path.join(__dirname, "deploy.sh");
const logFilePath = path.join(__dirname, "log.txt");

// 定时任务：每分钟执行一次
schedule.scheduleJob("* * * * *", () => {
  const timestamp = new Date().toISOString();
  console.log(`Executing: ${scriptPath} at ${timestamp}`);

  exec(`bash ${scriptPath}`, (error, stdout, stderr) => {
    let logMessage = `\n[${timestamp}] Executing: ${scriptPath}\n`;

    if (error) {
      logMessage += `Error: ${error.message}\n`;
    } else if (stderr) {
      logMessage += `stderr: ${stderr}\n`;
    } else {
      logMessage += `stdout: ${stdout}\n`;
    }

    fs.appendFile(logFilePath, logMessage + "\n", (err) => {
      if (err) console.error(`Failed to write log: ${err.message}`);
    });
  });
});

console.log("Scheduled job started. Running deploy.sh every minute.");
