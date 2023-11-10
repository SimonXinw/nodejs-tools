import fs from 'fs';
import path from 'path';
import readlineSync from 'readline-sync';

// 递归遍历文件夹下所有文件
function traverseFolder(config) {
  const folderPath = config.folderPath;

  const destinationFolder = config.destinationFolder;

  const extensionName = config.extensionName;

  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);

    // 判断文件类型
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // 如果是文件夹，则递归遍历
      traverseFolder(filePath, destinationFolder);
    } else {
      // 如果是文件，则判断扩展名
      const extname = path.extname(filePath);

      // 退出递归
      if (!extensionName?.includes(extname)) return;

      // 移动文件
      const newFilePath = path.join(destinationFolder, file);
      fs.renameSync(filePath, newFilePath);
      console.log(`Moved ${filePath} to ${newFilePath}`);
    }
  });
}

const sourceFolderPath = readlineSync.question('请输入提取文件夹绝对路径：');

const destinationFolderPath =
  readlineSync.question('请输入存入的文件夹绝对路径：');

const extensionName = readlineSync.question(
  '请输入文件后缀名，多文件格式 .excel,.ppt ：'
);

traverseFolder({ sourceFolderPath, destinationFolderPath, extensionName });
