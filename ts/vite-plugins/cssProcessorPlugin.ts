import { defineConfig, Plugin } from 'vite'
import path from "path";
import fs from "fs";

export default function processCssPlugin(): Plugin {
  console.log('ok');
  
    return {
    name: 'css-paths-export',

    async transform(code, id) {
      console.log('hello');
      
      // target your library entry file
      if (!id.endsWith('cjs/index.ts')) return

      const files = fs.readdirSync('src')
        .filter(file => file.endsWith('.css'))
        .map(file => path.join('src', file));

      // normalize paths (important for browser usage)
      const normalized = files.map(f =>
        './' + path.relative(process.cwd(), f).replace(/\\/g, '/')
      )

      const injected = `
        export const cssFiles = ${JSON.stringify(normalized, null, 2)};
      `

      return {
        code: injected + '\n' + code,
        map: null
      }
    }
  }
}