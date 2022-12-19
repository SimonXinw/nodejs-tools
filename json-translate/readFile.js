const fs = require("fs");

// 读取文件
fs.readFile("user.json", "utf-8", (err, data) => {
  if (err) {
    throw err;
  }

  // 解析字符串对象
  const user = JSON.parse(data);

  // 打印
  console.log(user);
});
