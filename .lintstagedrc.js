const path = require("path");

const buildEslintCommand = (filenames) =>
  `next lint --max-warnings 0 --fix --file ${filenames
    .filter(
      (file) =>
        !file.includes(".lintstagedrc.js") &&
        !file.includes("commitlint.config.js"),
    )
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;

module.exports = {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand, "prettier --write"],
  "*.{css,md}": ["prettier --write"],
};
