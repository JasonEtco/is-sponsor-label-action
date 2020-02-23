const getAuthorNodeId = require('./get-author-id')
const userIsSponsor = require('./user-is-sponsor')
const addLabel = require('./add-label')

module.exports = async tools => {
  // Get the user id of the submitter
  const nodeId = getAuthorNodeId(tools.context.payload)

  // Check if the user is a sponsor
  const isSponsor = await userIsSponsor(tools, nodeId)
  if (!isSponsor) return

  // Add the label
  return addLabel(tools)
}
