import * as fs from "fs-extra";
import * as moment from "moment";
import { execCommand } from "./execCommand";
import { changeLogFile, manifestFile } from "./settings";

export function readline(question: string) {
  return new Promise((resolve) => {
    const readline = require("readline");

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(`${question} `, (answer: string) => {
      resolve(answer);
      rl.close();
    });
  });
}

export async function getJPLFileName() {
  const manifest = require(manifestFile);
  return manifest.id + ".jpl";
}

export async function updateChangelog(version: string, preRelease: boolean) {
  let data = fs.readFileSync(changeLogFile, { encoding: "utf8", flag: "r" });
  version = `${version} ${preRelease ? "[pre-release] " : ""}(${moment().format(
    "YYYY-MM-DD"
  )})`;
  data = data.replace(/## not released/, `## not released\n\n## v${version}`);
  fs.writeFileSync(changeLogFile, data);
}

export async function setPluginVersion(version: string) {
  console.log("set Joplin plugin version");
  const manifest = require(manifestFile);
  manifest.version = version;
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
}

export async function runNpmVersion(type: string) {
  console.log("bump npm version");
  await execCommand(
    `npm version ${type} -git-tag-version false -commit-hooks false`,
    { showOutput: true, showInput: true }
  );
}

export async function getChangelog(version: string): Promise<string> {
  let data = fs.readFileSync(changeLogFile, { encoding: "utf8", flag: "r" });

  version = version.replace(/\./g, "\\.");
  const regExp = new RegExp(`(?<ENTRY>## v${version}.*?)^##`, "ims");
  const match = data.match(regExp);
  if (match == null) {
    throw new Error("Changelog was not found");
  }

  let change = match.groups.ENTRY.split("\n");
  change.splice(0, 2);
  return change.join("\n");
}
