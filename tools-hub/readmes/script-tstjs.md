# tsTojs 构建入口（tsTojs/index.js）

## 作用

扫描 `tsTojs/src` 目录下所有 `.ts` 文件，使用 **esbuild** 逐个编译为 `tsTojs/output` 下的 **ESM** `.js`（`platform: "browser"`，`target: "es6"`）。

## 运行

```bash
node tsTojs/index.js
```

## 输出

每个源文件对应一个独立输出文件，不做 bundle，便于在浏览器侧按需引用。

## 依赖

项目已依赖 `esbuild`；需保证 `src` 内 TS 语法与 esbuild 配置兼容。
