require('dotenv').config()
const { Toolkit } = require('actions-toolkit')
const labelSponsor = require('./lib')

async function run () {
  const tools = new Toolkit({
    event: [
      'pull_request.opened',
      'issues.opened'
    ],
    secrets: [
      'GITHUB_TOKEN'
    ]
  })

  try {
    await labelSponsor(tools)
  } catch (err) {
    tools.exit.failure(err)
  }
}

run()
