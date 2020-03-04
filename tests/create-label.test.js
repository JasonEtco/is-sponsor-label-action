const { Toolkit } = require('actions-toolkit')
const nock = require('nock')
const createLabel = require('../lib/create-label')

describe('createLabel', () => {
  let tools, nocked, params

  beforeEach(() => {
    tools = new Toolkit({
      logger: {
        info: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn()
      }
    })

    nocked = nock('https://api.github.com')
      .post(`/repos/${process.env.GITHUB_REPOSITORY}/labels`)
  })

  it('creates the default label', async () => {
    nocked = nocked.reply(200, (_, body) => { params = body })

    await createLabel(tools)

    expect(nocked.isDone()).toBe(true)
    expect(params).toMatchObject({
      name: 'sponsor'
    })
  })
})
