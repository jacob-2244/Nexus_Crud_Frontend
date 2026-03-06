/**
 * Syncs CSS variables in globals.css from src/constants/color.js.
 * Run after editing color.js: node scripts/sync-css-vars.js
 */

const path = require("path");
const fs = require("fs");
const { light, dark, toCssVarName } = require("../src/constants/color");

function toCssBlock(themeObj, selector) {
  const lines = Object.entries(themeObj).map(
    ([key, value]) => `  --${toCssVarName(key)}: ${value};`
  );
  return `${selector} {\n${lines.join("\n")}\n}`;
}

const rootBlock = toCssBlock(light, ":root");
const darkBlock = toCssBlock(dark, ".dark");

const globalsPath = path.join(__dirname, "../src/app/globals.css");
let css = fs.readFileSync(globalsPath, "utf8");

const lightMarker = "/* ========== LIGHT MODE (Default) ========== */";
const darkMarker = "/* ========== DARK MODE ========== */";
const tableMarker = "/* ========== GLOBAL TABLE STYLES ========== */";

const start = css.indexOf(lightMarker);
const end = css.indexOf(tableMarker);
if (start === -1 || end === -1) {
  console.error("Could not find LIGHT or GLOBAL TABLE markers in globals.css");
  process.exit(1);
}

const before = css.slice(0, start);
const after = css.slice(end);
const newSection =
  lightMarker +
  "\n" +
  rootBlock +
  "\n\n" +
  darkMarker +
  "\n" +
  darkBlock +
  "\n\n" +
  after;

fs.writeFileSync(globalsPath, before + newSection);
console.log("Synced globals.css from color.js (" + Object.keys(light).length + " variables)");
