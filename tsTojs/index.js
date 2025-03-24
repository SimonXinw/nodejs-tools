import { promises as fs } from "fs";
import path from "path";
import { build } from "esbuild";

// 源文件和输出目录
const srcDir = "./src";
const outDir = "./output";

// 递归获取所有 .ts 文件
async function getTsFiles(dir) {
  const files = await fs.readdir(dir);
  return files
    .filter((file) => file.endsWith(".ts"))
    .map((file) => path.join(dir, file));
}

// 编译单个文件
async function compileTs(file) {
  const fileName = path.basename(file, ".ts"); // 获取文件名（不含扩展名）
  const outFile = path.join(outDir, `${fileName}.js`);

  await build({
    entryPoints: [file],
    outfile: outFile,
    bundle: false, // 每个文件单独编译
    format: "esm", // 生成 ES 模块
    platform: "node",
    target: "es6",
  });

  console.log(`✔ Compiled: ${file} → ${outFile}`);
}

// 运行构建
async function main() {
  try {
    await fs.mkdir(outDir, { recursive: true }); // 确保输出目录存在
    const tsFiles = await getTsFiles(srcDir);

    if (tsFiles.length === 0) {
      console.log("No TypeScript files found.");
      return;
    }

    for (const file of tsFiles) {
      await compileTs(file);
    }

    console.log("✅ All files compiled successfully!");
  } catch (error) {
    console.error("❌ Build failed:", error);
  }
}

main();
