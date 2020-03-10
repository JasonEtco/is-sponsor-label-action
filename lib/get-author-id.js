/**
 * Grabs the node_id of the author
 * @param {object} payload
 */
module.exports = function getAuthorNodeId (payload) {
  if (payload.issue) {
    return payload.issue.user.login
  } else if (payload.pull_request) {
    return payload.pull_request.user.login
  } else {
    throw new Error('No user login found')
  }
}
