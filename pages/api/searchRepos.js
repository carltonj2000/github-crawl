import * as path from "path";
import * as fs from "fs";
import { execSync } from "child_process";

import { baseDir } from "./sendRepos";

export default (req, res) => {
  const dirNfiles = fs.readdirSync(baseDir);
  const repos = dirNfiles.filter((file) =>
    fs.lstatSync(path.join(baseDir, file)).isDirectory()
  );
  const readmeNpackageMaybe = repos.map((r) => {
    const readmePath = path.join(baseDir, r, "README.md");
    const packagePath = path.join(baseDir, r, "package.json");
    return {
      repo: r,
      readme: fs.existsSync(readmePath)
        ? fs.readFileSync(readmePath, "utf8")
        : "",
      package: fs.existsSync(packagePath)
        ? fs.readFileSync(packagePath, "utf8")
        : "",
    };
  });
  const readmeNpackage = readmeNpackageMaybe.filter((r) => r.readme !== "");
  const hasPostgres = readmeNpackage.filter(
    (r) =>
      r.package.includes("postgres") ||
      r.readme.includes("postgres") ||
      r.package.includes('"pg"')
  );
  const lastPush = hasPostgres.map((pg) => {
    const cwd = path.join(baseDir, pg.repo);
    const date = execSync(`git log -1 --format=%cd`, { cwd }).toString();
    return { ...pg, date };
  });
  res.status(200).json(lastPush);
};
