const { Toolkit } = require('actions-toolkit')
const nock = require('nock')
const userIsSponsor = require('../lib/user-is-sponsor')

describe('userIsSponsor', () => {
  let tools, nocked

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

    nocked = nock('https://api.github.com').post('/graphql')
  })

  it('returns true if the user is a sponsor', async () => {
    nocked.reply(200, {
      data: {
        node: {
          isSponsoredBy: true
        }
      }
    })

    const result = await userIsSponsor(tools)
    expect(result).toBe(true)
  })

  it('returns false if the user is not a sponsor', async () => {
    nocked.reply(200, {
      data: {
        node: {
          isSponsoredBy: false
        }
      }
    })

    const result = await userIsSponsor(tools)
    expect(result).toBe(false)
  })
})
