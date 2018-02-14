import commonjs from "rollup-plugin-commonjs";
import replace from "rollup-plugin-replace";
import resolve from "rollup-plugin-node-resolve";
import uglify from "rollup-plugin-uglify";

const config = {
  input: "src/index.js",
  output: {
    file: "mactrelly.js",
    format: "iife",
    sourcemap: process.env.NODE_ENV !== "production" ? "inline" : false
  },
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs({
      include: 'node_modules/**'
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    }),
  ],
  watch: {
    include: "./src/**"
  }
};

if (process.env.NODE_ENV === "production") {
  config.plugins.push(uglify());
}

export default config;
