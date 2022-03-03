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
              sponsorEntity: {
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
              sponsorEntity: {
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
              sponsorEntity: {
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

  it('returns true if the user is a sponsor for an organization-owned repo', async () => {
    const nodeId = 'hi'
    tools.context.payload.repository.owner.type = 'Organization'

    nocked.reply(200, {
      data: {
        organization: {
          sponsorshipsAsMaintainer: {
            pageInfo: {
              hasNextPage: false
            },
            nodes: [{
              sponsorEntity: {
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

  it('throws if the repository owner type is invalid', async () => {
    const nodeId = 'hi'
    tools.context.payload.repository.owner.type = 'Pizza'
    await expect(userIsSponsor(tools, nodeId)).rejects.toThrow()
  })
})
