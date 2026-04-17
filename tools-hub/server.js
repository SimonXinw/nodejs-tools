import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HUB_DIR = __dirname;
const REPO_ROOT = path.join(HUB_DIR, "..");
const READMES_DIR = path.join(HUB_DIR, "readmes");
const PUBLIC_DIR = path.join(HUB_DIR, "public");
const CATALOG_PATH = path.join(HUB_DIR, "methods-catalog.json");

const DEFAULT_PORT = 48736;

/**
 * 在默认浏览器中打开 URL（Windows / macOS / Linux）。
 *
 * @param {string} url
 */
const openUrlInDefaultBrowser = (url) => {
  const platform = process.platform;

  if (platform === "win32") {
    spawn("cmd", ["/c", "start", "", url], {
      detached: true,
      stdio: "ignore",
    }).unref();

    return;
  }

  if (platform === "darwin") {
    spawn("open", [url], { detached: true, stdio: "ignore" }).unref();

    return;
  }

  spawn("xdg-open", [url], { detached: true, stdio: "ignore" }).unref();
};

/**
 * @param {string} slug
 * @param {unknown} catalog
 * @returns {boolean}
 */
const isCataloguedReadmeSlug = (slug, catalog) => {
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) {
    return false;
  }

  const methods = catalog?.methods;

  if (!Array.isArray(methods)) {
    return false;
  }

  return methods.some((item) => item?.readmeSlug === slug);
};

const main = async () => {
  const catalogJson = await readFile(CATALOG_PATH, "utf8");
  const catalog = JSON.parse(catalogJson);

  const app = express();
  const port = Number(process.env.PORT) || DEFAULT_PORT;

  app.disable("x-powered-by");

  app.get("/api/catalog", (_req, res) => {
    res
      .set("Content-Type", "application/json; charset=utf-8")
      .send(catalogJson);
  });

  app.get("/api/readme/:slug", async (req, res) => {
    const { slug } = req.params;

    if (!isCataloguedReadmeSlug(slug, catalog)) {
      res.status(404).type("text/plain; charset=utf-8").send("未找到该文档条目");

      return;
    }

    const filePath = path.join(READMES_DIR, `${slug}.md`);

    try {
      const text = await readFile(filePath, "utf8");

      res.type("text/markdown; charset=utf-8").send(text);
    } catch {
      res.status(404).type("text/plain; charset=utf-8").send("README 文件缺失");
    }
  });

  app.use(express.static(PUBLIC_DIR));

  app.listen(port, "127.0.0.1", () => {
    const url = `http://127.0.0.1:${port}/`;

    console.log(`[tools-hub] 文档中心: ${url}`);
    console.log(`[tools-hub] 仓库根: ${REPO_ROOT}`);

    if (process.env.TOOLS_HUB_NO_OPEN !== "1") {
      openUrlInDefaultBrowser(url);
    }
  });
};

main().catch((error) => {
  console.error("[tools-hub] 启动失败:", error);
  process.exitCode = 1;
});
