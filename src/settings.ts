import * as path from "path";

export const changeLogFile = path.resolve(
  path.join(__dirname, "..", "..", "..", "CHANGELOG.md")
);
export const manifestFile = path.resolve(
  path.join(__dirname, "..", "..", "..", "src", "manifest.json")
);

export const publishDir = path.resolve(
  path.join(__dirname, "..", "..", "..", "publish")
);
