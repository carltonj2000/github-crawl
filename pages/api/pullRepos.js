import * as path from "path";
import * as fs from "fs";
import { execSync } from "child_process";

import { latestRepoFile, baseDir } from "./sendRepos";

const gitRepo = (repo) => `git@github.com:carltonj2000/${repo}`;

export default (req, res) => {
  const repoFile = latestRepoFile();
  console.log({ repoFile });
  res.status(200).json({ status: "OK", details: "pulling repos" });
  const reposText = fs.readFileSync(latestRepoFile(), "utf-8");
  const repos = JSON.parse(reposText);
  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i].name;
    const login = repos[i].owner;
    if (login !== "carltonj2000") {
      console.log(`${i} Skipping ${login} repo ${repo}`);
      continue;
    }

    let cwd = path.join(baseDir, repo);
    try {
      if (fs.existsSync(cwd)) {
        execSync(`git pull`, { cwd });
        console.log(`${i} pulled ${repo}`);
      } else {
        execSync(`git clone ${gitRepo(repo)} ${cwd}`);
        console.log(`${i} cloned ${repo}`);
      }
    } catch {
      console.log(`continuing after error`);
    }
  }
  console.log(`Finished!`);
};
