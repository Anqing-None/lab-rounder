import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
// import decimal from 'decimal.js'

export default {
  input: "./index.ts",
  output: [
    {
      file: "index.common.js",
      format: "cjs",
    },
    {
      file: "index.es.js",
      format: "es",
    },
  ],
  plugins: [typescript(), resolve({ mainFields: ["module", "main"] })],
};