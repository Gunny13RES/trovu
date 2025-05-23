import DataCompiler from "./src/ts/modules/DataCompiler.ts";
import commonjs from "@rollup/plugin-commonjs";
import html from "@rollup/plugin-html";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import fs from "fs";
import copy from "rollup-plugin-copy";
import execute from "rollup-plugin-execute";
import scss from "rollup-plugin-scss";
import watch from "rollup-plugin-watch";

const isProduction = process.env.BUILD === "production";

const output = {
  dir: "dist/public/",
  name: "process",
  entryFileNames: "[name].js",
  sourcemap: true,
  format: "es",
};

const gitInfo = DataCompiler.getGitInfo();

const template = (templateFilePath) => {
  const templateFunc = ({ attributes, bundle, files, publicPath, title }) => {
    const [fileNameJs] = Object.keys(bundle);
    const config = DataCompiler.getConfig();
    const placeholders = {
      urlBlog: config.url.blog,
      urlDocs: config.url.docs,
      fileNameJs: fileNameJs,
      currentTimestamp: new Date().toISOString(),
    };

    let html = fs.readFileSync(templateFilePath).toString();

    Object.keys(placeholders).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      html = html.replace(regex, placeholders[key]);
    });

    return html;
  };
  return templateFunc;
};

export default [
  {
    input: "src/ts/cli.ts",
    output: {
      file: "dist/cli.mjs",
      format: "esm",
      sourcemap: true,
    },
    external: [
      "commander",
      "fs",
      "child_process",
      "js-yaml",
      "ajv",
      "countries-list",
      "split-limit",
      "dayjs",
      "escape-string-regexp",
    ],
    plugins: [
      typescript(), // Use the TypeScript plugin
    ],
  },
  {
    input: "src/ts/index.ts",
    output: output,
    plugins: [
      watch({ dir: "src/html/" }),
      watch({ dir: "src/img/" }),
      watch({ dir: "data/" }),
      resolve(),
      commonjs(),
      json(),
      scss({
        fileName: "style.css",
        outputStyle: isProduction ? "compressed" : "expanded",
      }),
      execute("npm run compile-data"),
      isProduction && terser(),
      html({
        fileName: "index.html",
        template: template("src/html/index.html"),
      }),
      replace({
        preventAssignment: true,
        GIT_INFO: JSON.stringify(gitInfo),
      }),
      copy({
        targets: [
          {
            src: "src/favicon/*.{ico,png,svg,xml}",
            dest: "dist/public/",
          },
          { src: "src/img/*", dest: "dist/public/img/" },
          {
            src: "src/js/userscripts/*.user.js",
            dest: "dist/public/userscripts/",
          },
          { src: "src/opensearch/", dest: "dist/public/" },
          { src: "node_modules/@fortawesome/fontawesome-free/webfonts/", dest: "dist/public/" },
          { src: "src/js/pwa/*", dest: "dist/public/" },
          { src: "src/manifest/*", dest: "dist/public/" },
          { src: "src/json/assetlinks.json", dest: "dist/public/.well-known/" },
          { src: "src/json/log.json", dest: "dist/public/" },
        ],
      }),
      typescript(), // Add the TypeScript plugin here
    ],
  },
  {
    input: "src/ts/process.ts",
    output: output,
    plugins: [
      resolve(),
      commonjs(),
      json(),
      isProduction && terser(),
      html({
        fileName: "process/index.html",
        template: template("src/html/process.html"),
      }),
      replace({
        preventAssignment: true,
        GIT_INFO: JSON.stringify(gitInfo),
      }),
      typescript(), // Add the TypeScript plugin here
    ],
  },
];
