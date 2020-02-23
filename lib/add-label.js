/**
 * Adds a the configured label to the created issue or pull request
 */
module.exports = async function addLabel (tools) {
  // Get the label to add
  const label = tools.inputs.label || 'sponsor'
  tools.log.debug(`Author is a sponsor! Adding the [${label}] label!`)

  // User is a sponsor, let's add a label
  return tools.github.issues.addLabels({
    ...tools.context.repo,
    issue_number: tools.context.issue.number,
    labels: [label]
  })
}
