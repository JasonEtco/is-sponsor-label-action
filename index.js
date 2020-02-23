require('dotenv').config()
const { Toolkit } = require('actions-toolkit')
const core = require('@actions/core')

/**
 * Grabs the node_id of the creator
 * @param {object} payload
 */
function getCreatorNodeId (payload) {
  if (payload.issue) {
    return payload.issue.author.node_id
  } else if (payload.pull_request) {
    return payload.pull_request.author.node_id
  } else {
    throw new Error('No user id found')
  }
}

/**
 * Uses the GraphQL API to see if the user is
 * a sponsor of the repository's owner.
 * @param {Toolkit} tools
 * @param {string} nodeId
 * @returns {boolean}
 */
async function userIsSponsor (tools, nodeId) {
  const query = `query ($owner: String!, $after: String) { 
    user (login: $owner) {
      sponsorshipsAsMaintainer (first: 100, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          sponsor {
            id
          }
        }
      }
    }
  }`

  /**
   * Recursively checks the GraphQL API's response for the provided
   * nodeId, and returns true if a sponsorship record was found.
   * @param {string} [after]
   */
  async function makeRequest (after) {
    const result = await tools.github.graphql(query, {
      owner: tools.context.payload.repository.owner.login,
      after
    })

    const { nodes, pageInfo } = result.user.sponsorshipsAsMaintainer

    // Check if the issue/PR creator is a sponsor
    if (nodes.find(node => node.sponsor.id === nodeId)) {
      return true
    }

    // We have more pages to check
    if (pageInfo.hasNextPage) {
      return makeRequest(pageInfo.endCursor)
    }

    // We checked em all, creator is not a sponsor
    return false
  }

  return makeRequest()
}

Toolkit.run(async tools => {
  // Get the user id of the submitter
  const nodeId = getCreatorNodeId(tools.context.payload)

  // Check if the user is a sponsor
  const isSponsor = await userIsSponsor(tools, nodeId)
  if (!isSponsor) return

  // Get the label to add
  const label = core.getInput('label') || 'sponsor'

  // User is a sponsor, let's add a label
  return tools.github.issues.addLabels({
    ...tools.context.repo,
    issue_number: tools.context.issue.number,
    labels: [label]
  })
}, {
  event: [
    'pull_request.opened',
    'issues.opened'
  ],
  secrets: [
    'GITHUB_TOKEN'
  ]
})
