import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HEADING = /^## \[(\d+\.\d+\.\d+)\]/;

export function extractSection(changelog, version) {
  const lines = changelog.split("\n");
  const start = lines.findIndex((line) => {
    const match = HEADING.exec(line.trim());
    return match && match[1] === version;
  });
  if (start < 0) return null;

  const body = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (HEADING.test(lines[i].trim())) break;
    body.push(lines[i]);
  }
  return body.join("\n").trim();
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const version = (process.argv[2] || "").replace(/^v/, "");
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    console.error("release-notes: usage: node scripts/release-notes.mjs <x.y.z>");
    process.exit(1);
  }
  const changelog = fs.readFileSync(path.join(root, "CHANGELOG.md"), "utf8");
  const section = extractSection(changelog, version);
  if (!section) {
    console.error("release-notes: CHANGELOG.md has no entry for " + version);
    process.exit(1);
  }
  process.stdout.write(section + "\n");
}
