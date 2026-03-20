import { defineConfig } from "vite";
import path from "path";
import fs from "fs"

export default defineConfig({
  plugins: [
    {
      name: 'serve-css-anywhere',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.endsWith('.css')) {
            const cleanUrl = req.url.split('?')[0];
            const relativePath = cleanUrl.replace(/^\/+/, ''); // remove leading /
            const filePath = path.join(__dirname, "src", relativePath);

            if (fs.existsSync(filePath)) {
              res.setHeader('Content-Type', 'text/css')
              res.end(fs.readFileSync(filePath))
              return;
            }
          }
          next();
        })
      }
    }
  ],
  resolve: {
    alias: {
      cjs: path.resolve(__dirname, "./lib/cjs.mjs") // map "cjs" → your lib file
    }
  }
});