import * as path from "path";
import * as fs from "fs";
import { format } from "date-fns";

export const baseDir = "/media/renderws/carltonData/cjGitHub/carltonj2000";

export const reposFile = () =>
  path.join(baseDir, `repos-${format(new Date(), "yyyy-MM-dd")}.json`);

export const latestRepoFile = () => {
  const filesNdirs = fs.readdirSync(baseDir);
  const repoFile = filesNdirs
    .filter((f) => {
      const file = path.join(baseDir, f);
      const isFile = fs.lstatSync(file).isFile();
      const isRepoJson = /repos-(\d{4})-(\d{2})-(\d{2})\.json/.test(file);
      return isFile && isRepoJson;
    })
    .sort((a, b) => (a > b ? 1 : -1))[0];
  return path.join(baseDir, repoFile);
};

export default (req, res) => {
  fs.writeFileSync(reposFile(), JSON.stringify(req.body, null, 2));
  res.status(200).json({ status: "OK", details: "Received repos" });
};
