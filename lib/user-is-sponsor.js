/**
 * Uses the GraphQL API to see if the user is
 * a sponsor of the repository's owner.
 * @param {import('actions-toolkit').Toolkit} tools
 * @param {string} possibleSponsor
 * @returns {Promise<boolean>}
 */
module.exports = async function userIsSponsor (tools, possibleSponsor) {
  const query = `
    query ($repositoryId: ID!, $possibleSponsor: String!) {
      node(id: $repositoryId) {
        on Repository {
          owner {
            ... on User {
              isSponsoredBy(account: $possibleSponsor)
            }
            ... on Organization {
              isSponsoredBy(account: $possibleSponsor)
            }
          }
        }
      }
    }`

  const result = await tools.github.graphql(query, {
    repositoryId: tools.context.payload.repository.node_id,
    possibleSponsor
  })

  return result.node.isSponsoredBy
}
