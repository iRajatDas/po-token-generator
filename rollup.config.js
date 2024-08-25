import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJson = JSON.parse(
  readFileSync(join(__dirname, "package.json"), "utf8")
);

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.module,
        format: "es",
        sourcemap: true,
      },
      {
        file: packageJson.exports["."].require,
        format: "cjs",
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({
        preferBuiltins: true,
        browser: true,
      }),
      commonjs(),
      json(),
      typescript({ tsconfig: "./tsconfig.json" }),
    ],
    external: [
      "winston",
      "node-cache",
      "puppeteer",
      "puppeteer-extra",
      "puppeteer-extra-plugin-stealth",
      "puppeteer-extra-plugin-adblocker",
    ],
  },
  {
    input: "dist/types/index.d.ts",
    output: [{ file: packageJson.types, format: "es" }],
    plugins: [dts()],
  },
];
