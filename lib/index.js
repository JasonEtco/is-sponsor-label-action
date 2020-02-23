const getAuthorNodeId = require('./get-author-id')
const userIsSponsor = require('./user-is-sponsor')
const addLabel = require('./add-label')

/**
 * @param {import('actions-toolkit').Toolkit} tools
 */
module.exports = async tools => {
  // Get the user id of the submitter
  const nodeId = getAuthorNodeId(tools.context.payload)

  // Check if the user is a sponsor
  const isSponsor = await userIsSponsor(tools, nodeId)
  if (!isSponsor) {
    tools.log.debug('Author is not a sponsor! Nothing left to do.')
    return
  }

  // Add the label
  await addLabel(tools)
  tools.log.success('Label successfully applied. Have a nice day!')
}
