require('dotenv').config()
const { Toolkit } = require('actions-toolkit')
const getAuthorNodeId = require('./lib/get-author-id')
const userIsSponsor = require('./lib/user-is-sponsor')
const createLabel = require('./lib/create-label')
const addLabel = require('./lib/add-label')

Toolkit.run(async tools => {
  // Get the login of the submitter
  const possibleSponsor = getAuthorNodeId(tools.context.payload)

  // Check if the user is a sponsor
  const isSponsor = await userIsSponsor(tools, possibleSponsor)
  if (!isSponsor) {
    tools.log.debug('Author is not a sponsor! Nothing left to do.')
    return
  }

  // Add the label
  await createLabel(tools)
  await addLabel(tools)
  tools.log.success('Label successfully applied. Have a nice day!')
}, {
  event: [
    'pull_request.opened',
    'issues.opened'
  ],
  secrets: [
    'GITHUB_TOKEN'
  ]
})
