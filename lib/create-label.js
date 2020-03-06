/**
 * Creates the configured label (or the default one). If
 * the label already exists, it'll throw and fail silently.
 * @param {import('actions-toolkit').Toolkit} tools
 */
module.exports = async function createLabel (tools) {
  // Create the label
  const label = tools.inputs.label
  tools.log.debug(`Making label [${label}]`)
  try {
    await tools.github.issues.createLabel({
      ...tools.context.repo,
      name: label,
      color: 'fedbf0'
    })
  } catch {}
}
