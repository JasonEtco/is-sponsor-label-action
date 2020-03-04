const fs = require('fs')
const path = require('path')
const jsYaml = require('js-yaml')

function injectDefaultValues () {
  const yaml = fs.readFileSync(path.join(__dirname, '../action.yml'), 'utf8')
  const { inputs } = jsYaml.safeLoad(yaml)

  for (const key in inputs) {
    process.env[`INPUT_${key.toUpperCase()}`] = inputs[key].default
  }
}

Object.assign(process.env, {
  GITHUB_REPOSITORY: 'JasonEtco/waddup',
  GITHUB_ACTION: 'create-an-issue',
  GITHUB_EVENT_PATH: path.join(__dirname, 'fixtures', 'sponsor.json'),
  GITHUB_WORKSPACE: path.join(__dirname, 'fixtures')
})

injectDefaultValues()
