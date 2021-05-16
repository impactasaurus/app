// this node script is ran during CI, it generates language.json
/* eslint-disable */

const fs = require("fs");
const path = require("path");

const getAllFiles = function (dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(dirPath + path.sep + file);
    }
  });

  return arrayOfFiles;
};

const loadFile = function (file) {
  return fs.readFileSync(file);
};

const isSuitableCoverage = function (langFile, sourceFile) {
  const src = loadFile(sourceFile);
  const lang = loadFile(langFile);
  const coverage = Object.keys(lang).length / Object.keys(src).length;
  return coverage > 0.8;
};

const getCodeFromFilename = function (file) {
  const path = file.replace("/translation.json", "");
  const c = path.split("/");
  return c[c.length - 1];
};

const files = getAllFiles("./src/i18n/locales");
const translationFiles = files.filter((f) => f.includes("translation.json"));
let source = files.filter((f) => f.includes("/en/translation.json"));

if (source.length !== 1) {
  console.error("couldn't find source");
  process.exit(2);
}
source = source[0];

const suitable = translationFiles.filter((f) => isSuitableCoverage(f, source));
const codes = suitable.map(getCodeFromFilename);
fs.writeFileSync("./src/i18n/languages.json", JSON.stringify(codes));

console.log("Languages with suitable coverage:");
console.log(codes);
process.exit(0);
