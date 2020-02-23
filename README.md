<h1 align="center">[WIP]</h1>
<h3 align="center">A GitHub Action that labels issues/PRs if the creator is a sponsor of the owner</h3>

**Note**: currently only works for user-owned repositories. This is due to a limitation of the GraphQL API, since we can't query for a "user or organization" in one request.

## How it works

This action is designed to be triggered by the `issues` or `pull_request` events, specifically the `opened` action. When an issue or PR is opened, the action will make the following query:

```graphql
query ($owner: String!) { 
  user (login: $owner) {
    sponsorshipsAsMaintainer (first: 100) {
      nodes {
        sponsor {
          id
        }
      }
    }
  }
}
```

It will then check to see if the creator of the issue/PR is one of the sponsors in the list. If not, it'll try the next page of sponsors until it runs out.

> Note! This query checks to see if the opener is a sponsor of the repository's owning user. This does not cover all cases of sponsorship!

If the opener is a sponsor, the action will then add the `sponsor` label to the issue or pull request.
