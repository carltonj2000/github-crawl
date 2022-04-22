# GitHub Crawler

Search my github account for various things.

Pulled 400 repos on 8/12/2021 with a on HD size 742 MBytes.

Eventually get ws working for realtime updates of:

- progress of pulling repos
- progress of searching repos

Get step 2.3 working from
https://relay.dev/docs/getting-started/step-by-step-guide/

The fetch hook caching is based on
[How To Create A Custom React Hook To Fetch And Cache Data](https://www.smashingmagazine.com/2020/07/custom-react-hook-fetch-cache-data/)
article.

Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:

## Github Tokens

Verify .env.local contain github tokens according to this format.

```
GITHUB_TOKEN=ghp_stringHere
GITHUB_TOKEN_PUBLIC=ghp_anotherStringHere
```

Generate tokens on github via
`settings->Developer Settings->Personal access tokens`.
