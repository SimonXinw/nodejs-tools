import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT_PATH = fileURLToPath(new URL("..", import.meta.url));

/** 控制台 ANSI（写入文件时不使用） */
const ansi = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  gray: "\x1b[90m",
};

/** 各级别控制台前缀：图标 + 级别色（文本本身不再套色，避免整行难读） */
const LEVEL_CONSOLE = {
  INFO: `${ansi.gray}ℹ${ansi.reset}`,
  SUCCESS: `${ansi.green}✓${ansi.reset}`,
  WARN: `${ansi.yellow}⚠${ansi.reset}`,
  ERROR: `${ansi.red}✖${ansi.reset}`,
};

/**
 * @typedef {"INFO" | "SUCCESS" | "WARN" | "ERROR"} LogFileLevel
 */

const formatIso = () => new Date().toISOString();

const safeFileStamp = () =>
  new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-");

/**
 * @param {LogFileLevel} level
 * @param {string} message
 * @param {boolean} echoToConsole
 * @param {string} tag
 */
const writeConsoleLine = (level, message, echoToConsole, tag) => {
  if (!echoToConsole) {
    return;
  }

  const badge = LEVEL_CONSOLE[level] ?? LEVEL_CONSOLE.INFO;
  const line = `${badge} [${tag}] ${message}`;

  if (level === "ERROR") {
    console.error(line);
    return;
  }

  if (level === "WARN") {
    console.warn(line);
    return;
  }

  console.log(line);
};

/**
 * 控制台带颜色与图标；`logs/*.txt` 内为纯文本（无 ANSI），便于记事本查看。
 *
 * @param {{ tag: string; echoToConsole?: boolean }} options
 * @returns {Promise<{ info: (message: string) => Promise<void>; success: (message: string) => Promise<void>; warn: (message: string) => Promise<void>; error: (message: string) => Promise<void>; fileInfoOnly: (message: string) => Promise<void>; filePath: string }>}
 */
export const createLogger = async (options) => {
  const tag = options.tag;
  const echoToConsole = options.echoToConsole !== false;

  const logsDir = path.join(REPO_ROOT_PATH, "logs");

  await mkdir(logsDir, { recursive: true });

  const fileName = `${tag}-${safeFileStamp()}.txt`;
  const filePath = path.join(logsDir, fileName);

  /**
   * @param {LogFileLevel} level
   * @param {string} message
   */
  const appendLine = async (level, message) => {
    const line = `[${formatIso()}] [${level}] [${tag}] ${message}\n`;

    await appendFile(filePath, line, "utf8");
  };

  /**
   * @param {LogFileLevel} level
   * @param {string} message
   */
  const emit = async (level, message) => {
    writeConsoleLine(level, message, echoToConsole, tag);
    await appendLine(level, message);
  };

  /**
   * @param {string} message
   */
  const info = async (message) => {
    await emit("INFO", message);
  };

  /**
   * @param {string} message
   */
  const success = async (message) => {
    await emit("SUCCESS", message);
  };

  /**
   * @param {string} message
   */
  const warn = async (message) => {
    await emit("WARN", message);
  };

  /**
   * @param {string} message
   */
  const error = async (message) => {
    await emit("ERROR", message);
  };

  /**
   * 仅写入日志文件（不打控制台），用于已由其它模块打印过的行。
   *
   * @param {string} message
   */
  const fileInfoOnly = async (message) => {
    await appendLine("INFO", message);
  };

  return { info, success, warn, error, fileInfoOnly, filePath };
};
