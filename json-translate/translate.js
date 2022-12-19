const fs = require("fs");

// 读取文件
fs.readFile("./file/xw.json", "utf-8", (err, data) => {
  if (err) {
    throw err;
  }

  // 读取的文件
  console.log("读取的文件数据>>>>>>>>>>", data);

  // 解析字符串对象
  const newFile = JSON.parse(data, null, 4);

  // 写入文件
  try {
    fs.writeFileSync("./json/xw.json", newFile);

    console.log("JSON data is saved.");
  } catch (error) {
    console.error("写入出错>>>>>>>>>>", err);
  }

  // End
});
