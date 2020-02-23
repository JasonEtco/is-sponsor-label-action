require('dotenv').config()
const core = require('@actions/core')
const { Toolkit } = require('actions-toolkit')
const labelSponsor = require('./lib')

async function run () {
  try {
    const tools = new Toolkit({
      event: [
        'pull_request.opened',
        'issues.opened'
      ],
      secrets: [
        'GITHUB_TOKEN'
      ]
    })

    await labelSponsor(tools)
  } catch (err) {
    core.setFailed(err)
    process.exit()
  }
}

run()
