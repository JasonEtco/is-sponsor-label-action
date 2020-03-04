const { Toolkit } = require('actions-toolkit')
const nock = require('nock')
const addLabel = require('../lib/add-label')

describe('addLabel', () => {
  let tools, nocked, params

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

    tools.payload = {
      issue: { number: 1 }
    }

    nocked = nock('https://api.github.com')
      .post(`/repos/${process.env.GITHUB_REPOSITORY}/issues/1/labels`)
  })

  it('adds the default label', async () => {
    nocked = nocked.reply(200, (_, body) => { params = body })

    await addLabel(tools)

    expect(nocked.isDone()).toBe(true)
    expect(params).toMatchObject({
      labels: ['sponsor']
    })
  })
})
