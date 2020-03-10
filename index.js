require('dotenv').config()
const { Toolkit } = require('actions-toolkit')
const userIsSponsor = require('./lib/user-is-sponsor')
const createLabel = require('./lib/create-label')
const addLabel = require('./lib/add-label')

Toolkit.run(async tools => {
  // Check if the user is a sponsor
  const isSponsor = await userIsSponsor(tools)
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
