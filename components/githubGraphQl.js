import { useEffect, useState, useReducer } from "react";

export const getReposQ = `query ($perPage: Int!, $after: String) {
  viewer {
    login
    repositories(first: $perPage, after: $after) {
      totalCount
      edges {
        node {
          name
          owner {
            login
          }
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

export const fetchGraphQL = async (query, variables, authorization) => {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  return await response.json();
};
