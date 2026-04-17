# 按扩展名批量复制（file-processing/extract_all_files.js）

## 作用

交互式询问：**源文件夹**、**目标文件夹**、**扩展名列表**（如 `.xlsx,.json`），递归遍历源目录，将匹配后缀的文件 **复制** 到目标目录。

## 运行

```bash
node file-processing/extract_all_files.js
```

## 近期修复

此前递归子目录时错误传递参数，且顶层调用使用了与函数内部不一致的配置字段名，已改为统一 `folderPath` / `destinationFolder` / `extensionName` 并正确展开 `...config`。

## 注意

- 子目录同名文件复制到同一扁平目标时可能相互覆盖；需要保留目录结构时请另行扩展。
- 依赖 `readline-sync`；若 package 未声明需自行安装。
