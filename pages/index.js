import Head from "next/head";
import { useState, useEffect } from "react";

import { getReposQ, fetchGraphQL } from "../components/githubGraphQl";

const postHeader = {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};
export default function Home() {
  const [repos, reposSet] = useState({});
  const [authorization, authorizationSet] = useState(null);
  const query = getReposQ;
  let variable = { perPage: 100 };

  const getRepos = async () => {
    const repos = [];
    let hasNext = true;
    do {
      const result = await fetchGraphQL(query, variable, authorization);
      console.log({ result });
      const reposP = result.data.viewer.repositories.edges.map(
        ({ node, cursor }) => ({
          name: node.name,
          cursor,
          owner: node.owner.login,
        })
      );
      repos.push(...reposP);
      hasNext = result?.data.viewer.repositories.pageInfo.hasNextPage;
      const endCursor = result?.data.viewer.repositories.pageInfo.endCursor;
      const { perPage } = variable;
      variable = hasNext ? { perPage, after: endCursor } : { perPage };
    } while (hasNext);
    reposSet(repos);
  };

  const sendRepos = async () => {
    const token = await fetch("/api/sendRepos", {
      ...postHeader,
      body: JSON.stringify(repos),
    });
    const json = await token.json();
    console.log({ json });
  };

  const pullRepos = async () => {
    const token = await fetch("/api/pullRepos");
    const json = await token.json();
    console.log({ json });
  };

  useEffect(() => {
    const getAuthorization = async () => {
      const token = await fetch("/api/token");
      const json = await token.json();
      authorizationSet(json.authorization);
    };
    try {
      getAuthorization();
    } catch (e) {
      console.error({ e });
    }
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
        <section className="flex flex-row max-w-screen-lg mx-auto justify-center">
          <button
            onClick={getRepos}
            className="px-4 py-2 m-1 shadow bg-indigo-200 rounded hover:shadow-lg
            hover:bg-indigo-300"
          >
            Fetch Repos ({repos.length})
          </button>
          <button
            onClick={sendRepos}
            className="px-4 py-2 m-1 shadow bg-indigo-200 rounded hover:shadow-lg
            hover:bg-indigo-300"
          >
            Send Repos
          </button>
          <button
            onClick={pullRepos}
            className="px-4 py-2 m-1 shadow bg-indigo-200 rounded hover:shadow-lg
            hover:bg-indigo-300"
          >
            Pull Repos
          </button>
        </section>
      </main>

      <footer className="bg-green-300 flex justify-center py-4">
        {new Date().getFullYear()} &copy; Carlton Joseph
      </footer>
    </div>
  );
}
