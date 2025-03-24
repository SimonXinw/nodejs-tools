import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { build } from "esbuild";

// 获取当前脚本所在目录，确保路径动态解析
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 源文件和输出目录
const srcDir = path.join(__dirname, "src");
const outDir = path.join(__dirname, "output");

// 递归获取所有 .ts 文件
async function getTsFiles(dir) {
  try {
    const files = await fs.readdir(dir);
    return files
      .filter((file) => file.endsWith(".ts"))
      .map((file) => path.join(dir, file));
  } catch (error) {
    console.error(`❌ 读取目录失败: ${dir}`, error);
    return [];
  }
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
    platform: "browser", // 适用于浏览器
    target: "es6",
  });

  console.log(`✔ 编译成功: ${file} → ${outFile}`);
}

// 运行构建
async function main() {
  try {
    await fs.mkdir(outDir, { recursive: true }); // 确保输出目录存在
    const tsFiles = await getTsFiles(srcDir);

    if (tsFiles.length === 0) {
      console.log("⚠️ 没有找到 TypeScript 文件。");
      return;
    }

    for (const file of tsFiles) {
      await compileTs(file);
    }

    console.log("✅ 所有文件编译完成！");
  } catch (error) {
    console.error("❌ 构建失败:", error);
  }
}

main();
