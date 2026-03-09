import dts from "rollup-plugin-dts";

export default {
  input: "cjs/index.ts",
  output: {
    file: "lib/cjs.d.ts",
    format: "es"
  },
  plugins: [
    dts(),
    {
      name: 'wrap-in-module',
      generateBundle(options, bundle) {
        bundle["cjs.d.ts"].code = `declare module "cjs" {\n${bundle["cjs.d.ts"].code}\n}\n`
      }
    }
  ]
};