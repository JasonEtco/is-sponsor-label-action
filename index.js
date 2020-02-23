require('dotenv').config()
const { Toolkit } = require('actions-toolkit')

Toolkit.run(require('./lib'), {
  event: [
    'pull_request.opened',
    'issues.opened'
  ],
  secrets: [
    'GITHUB_TOKEN'
  ]
})
