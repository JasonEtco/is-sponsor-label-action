/**
 * Creates the configured label (or the default one). If
 * the label already exists, it'll throw and fail silently.
 * @param {import('actions-toolkit').Toolkit} tools
 */
module.exports = async function createLabel (tools) {
  // Create the label
  const label = tools.inputs.label || 'sponsor'
  tools.log.debug(`Making label [${label}]`)
  try {
    return tools.github.issues.createLabel({
      ...tools.context.repo,
      name: label,
      color: '#ea4aaa'
    })
  } catch {}
}
