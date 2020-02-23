const { Toolkit } = require('actions-toolkit')
const addLabel = require('../lib/add-label')

describe('addLabel', () => {
  let tools

  beforeEach(() => {
    tools = new Toolkit({
      logger: {
        info: jest.fn(),
        success: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
        error: jest.fn()
      }
    })

    tools.github.issues.addLabels = jest.fn()
  })

  it('adds the default label', async () => {
    await addLabel(tools)
    expect(tools.github.issues.addLabels).toHaveBeenCalled()
  })
})
