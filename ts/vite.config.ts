// vite.config.ts
import { defineConfig } from "vite";
import cssProcessorPlugin from "./vite-plugins/cssProcessorPlugin";
import path from "path";



export default defineConfig({
  plugins: [
    cssProcessorPlugin()
  ],
  resolve: {
    alias: {
      "cjs": path.resolve(__dirname, "./lib/cjs.mjs")
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "cjs/index.ts"),
      name: "Cjs",
      fileName: "cjs",
      formats: ["es"]
    },
    outDir: "lib",         // library bundle output
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external: [],        // specify external deps if needed
    },
  }
});