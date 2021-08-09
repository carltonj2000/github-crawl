export const getReposQ = () => {
  return `query ($perPage: Int!, $after: String) {
  viewer {
    login
    repositories(first: $perPage, after: $after) {
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
