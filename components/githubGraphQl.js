export const getReposQ = (next = "") => {
  const after = next ? ` after ${next},` : "";
  return `query {
  viewer {
    login
    repositories(first: 2,${after}) {
      totalCount
      edges {
        node {
          name
        }
        cursor
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
      }
    }
  }
}
`;
};
