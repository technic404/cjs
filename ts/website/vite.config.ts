import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      cjs: path.resolve(__dirname, "./lib/cjs.mjs") // map "cjs" → your lib file
    }
  }
});