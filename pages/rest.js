import Head from "next/head";
import { useState, useEffect } from "react";

export default function Home() {
  const [ping, pingSet] = useState({});
  const [github, githubSet] = useState({});
  const [user, userSet] = useState({});
  const [repos, reposSet] = useState({});
  const [reposAll, reposAllSet] = useState({});

  useEffect(() => {
    fetch("/api/ping")
      .then((res) => res.json())
      .then((json) => pingSet(json))
      .catch((e) => pingSet({ server: "is not responding", ...e }))
      .then(() => fetch("/api/github/zen"))
      .then((res) => res.json())
      .then((json) => githubSet(json))
      .catch((e) => githubSet({ github: "api not responding", ...e }))
      // .then(() => fetch("/api/github/users/carltonj2000"))
      // .then((res) => res.json())
      // .then((json) => userSet(json))
      // .catch((e) => userSet({ github: "user not found", ...e }))
      // .then(() => fetch("/api/github/users/carltonj2000/repos"))
      // .then((res) => res.json())
      // .then((json) => reposSet(json))
      // .catch((e) => reposSet({ github: "user repos not found", ...e }))
      .then(() => fetch("/api/github/users/carltonj2000/reposAll"))
      .then((res) => res.json())
      .then((json) => console.log(json) || reposAllSet(json))
      .catch((e) => reposAllSet({ github: "all user repos not found", ...e }));
  }, []);

  return (
    <div>
      <Head>
        <title>GitHub Crawler</title>
        <meta name="description" content="Crawls My GitHub Content" />
      </Head>

      <main>
        <header className="bg-green-300 flex justify-center py-5">
          <h1 className="">GitHub Crawler</h1>
        </header>
        <section className="flex flex-col max-w-screen-lg mx-auto items-center">
          <code>{JSON.stringify(ping, null, 2)}</code>
          <code>{JSON.stringify(github, null, 2)}</code>
          <code>
            <pre>{JSON.stringify(reposAll[0], null, 2)}</pre>
          </code>
          <code>
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </code>
          <code>
            <pre>{JSON.stringify(repos[0], null, 2)}</pre>
          </code>
        </section>
      </main>

      <footer className="bg-green-300 flex justify-center py-4">
        {new Date().getFullYear()} &copy; Carlton Joseph
      </footer>
    </div>
  );
}
