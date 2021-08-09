import Head from "next/head";
import { useState, useEffect } from "react";

import { getReposQ } from "../components/githubGraphQl";

export default function Home() {
  const [repos, reposSet] = useState({});
  useEffect(() => {
    fetch("/api/token")
      .then((res) => res.json())
      .catch((e) => reposSet({ server: "is not responding", ...e }))
      .then(({ authorization }) =>
        fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: { Authorization: `${authorization}` },
          body: JSON.stringify({
            query: getReposQ(),
            variables: { perPage: 5 },
          }),
        })
      )
      .then((res) => res.json())
      .then((res) => reposSet(res))
      .catch((e) => reposSet({ server: "Failed, graphQL query", ...e }));
  }, []);

  return (
    <div>
      <Head>
        <title>GitHub Crawler GraphQl</title>
        <meta name="description" content="Crawls My GitHub Content" />
      </Head>

      <main>
        <header className="bg-green-300 flex justify-center py-5">
          <h1 className="">GitHub Crawler GraphQl</h1>
        </header>
        <section className="flex flex-col max-w-screen-lg mx-auto items-center">
          <code>
            <pre>{JSON.stringify(repos, null, 2)}</pre>
          </code>
        </section>
      </main>

      <footer className="bg-green-300 flex justify-center py-4">
        {new Date().getFullYear()} &copy; Carlton Joseph
      </footer>
    </div>
  );
}
