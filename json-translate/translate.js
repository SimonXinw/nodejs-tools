import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const entryFileAbsolutePath = path.join(
  __dirname,
  './json/cookies.json'
);

// 读取文件
fs.readFile(entryFileAbsolutePath, "utf-8", (err, jsonData) => {
  if (err) throw err;


  // 读取的文件
  // console.log("读取的文件数据>>>>>>>>>>", jsonData);

  // 解析字符串对象
  const data = JSON.parse(jsonData, null, 4);

  // console.log("处理好的数据 >>>>>>>>>>", data);


  const newData = Object.keys(data)?.map(key => {

    if (!data.hasOwnProperty(key)) return null;

    return {

      name: key,
      value: data[key],
      domain: 'pre-marvel.alibaba-inc.com'

    }

  })?.filter(Boolean)

  console.log("处理好的数据 >>>>>>>>>>", newData);


  const _jsonData = JSON.stringify(newData)

  // 写入文件
  try {
    fs.writeFileSync("./output-file/cookies.json", _jsonData);

    console.log("JSON data is saved.");
  } catch (error) {
    console.error("写入出错>>>>>>>>>>", err);
  }

  // End
});
