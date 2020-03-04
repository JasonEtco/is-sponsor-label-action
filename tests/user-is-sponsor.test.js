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
    const nodeId = 'hi'

    nocked.reply(200, {
      data: {
        user: {
          sponsorshipsAsMaintainer: {
            nodes: [{
              sponsor: {
                id: nodeId
              }
            }]
          }
        }
      }
    })

    const result = await userIsSponsor(tools, nodeId)
    expect(result).toBe(true)
  })

  it('returns true if the user is a sponsor on a sub-page', async () => {
    const nodeId = 'hi'

    nocked = nocked.reply(200, {
      data: {
        user: {
          sponsorshipsAsMaintainer: {
            pageInfo: {
              hasNextPage: true,
              endCursor: 'endCursor'
            },
            nodes: []
          }
        }
      }
    })

    nocked.post('/graphql').reply(200, {
      data: {
        user: {
          sponsorshipsAsMaintainer: {
            pageInfo: {
              hasNextPage: true,
              endCursor: 'endCursor'
            },
            nodes: [{
              sponsor: {
                id: nodeId
              }
            }]
          }
        }
      }
    })

    const spy = jest.spyOn(tools.github, 'graphql')
    const result = await userIsSponsor(tools, nodeId)
    expect(spy).toHaveBeenCalledTimes(2)
    expect(result).toBe(true)
  })

  it('returns false if the user is not a sponsor', async () => {
    const nodeId = 'hi'

    nocked.reply(200, {
      data: {
        user: {
          sponsorshipsAsMaintainer: {
            pageInfo: {
              hasNextPage: false
            },
            nodes: [{
              sponsor: {
                id: 'nope'
              }
            }]
          }
        }
      }
    })

    const result = await userIsSponsor(tools, nodeId)
    expect(result).toBe(false)
  })
})
