const headers = { authorization: `token ${process.env.GITHUB_TOKEN}` };

const fetchJSON = async (res, url, errMessage, JSONfetch = true) =>
  await fetch(url, { headers })
    .then((res) => (JSONfetch ? res.json() : res.text()))
    .then((resp) => res.status(200).json(JSONfetch ? resp : { resp }))
    .catch((error) => res.status(400).json({ errMessage, error }));

const zen = async (res) =>
  await fetchJSON(res, "https://api.github.com/zen", "zen fetch failed", false);

const user = async (res, user) =>
  await fetchJSON(
    res,
    `https://api.github.com/users/${user}`,
    "user fetch failed"
  );

const repos = async (res, user) =>
  await fetchJSON(
    res,
    `https://api.github.com/users/${user}/repos`,
    "repos fetch failed"
  );

const reposAll = async (res, user) => {
  const userInfo = await fetch("https://api.github.com/user", { headers })
    .then((res) => res.json())
    //.then((resp) => res.status(200).json(resp))
    .catch((error) => {
      const errMessage = "error getting auth user repos";
      return res.status(400).json({ errMessage, error });
    });
  const reposTotal = [];
  let reposFetched = [];
  let page = 1;
  do {
    reposFetched = await fetch(
      `https://api.github.com/user/repos?page=${page}`,
      { headers }
    )
      .then((res) => res.json())
      .catch((error) => {
        const errMessage = "error getting auth user repos";
        return res.status(400).json({ errMessage, error });
      });
    console.log(reposFetched.length);
    reposTotal.push(...reposFetched);
    page++;
  } while (reposFetched.length === 30 && page < 20);
  console.log({ length: reposTotal.length });
  const repos = reposTotal.map(({ name }) => ({ name }));
  console.log(repos.length);
  res.status(200).send(repos);
};

export default async (req, res) => {
  const { query } = req;
  console.log(query);
  const slug = !query ? ["zen"] : query.slug;
  return slug[0] === "zen"
    ? await zen(res)
    : slug.length === 2 && slug[0] === "users"
    ? await user(res, ...slug.slice(1))
    : slug.length === 3 && slug[0] === "users" && slug[2] === "repos"
    ? await repos(res, ...slug.slice(1))
    : slug.length === 3 && slug[0] === "users" && slug[2] === "reposAll"
    ? await reposAll(res, ...slug.slice(1))
    : res.status(200).json({ error: "github api not supported" });
};
