const nock = require('nock')
const { Toolkit } = require('actions-toolkit')

describe('is-sponsor-label', () => {
  let actionFn, tools

  beforeEach(() => {
    Toolkit.run = jest.fn(fn => { actionFn = fn })
    require('..')

    tools = new Toolkit({
      logger: {
        info: jest.fn(),
        success: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
        error: jest.fn()
      }
    })
  })

  it('adds the label if the user is a sponsor', async () => {
    const { GITHUB_REPOSITORY } = process.env
    const scoped = nock('https://api.github.com')
      .post('/graphql').reply(200, {
        data: {
          node: {
            isSponsoredBy: true
          }
        }
      })
      .post(`/repos/${GITHUB_REPOSITORY}/issues/1/labels`).reply(200)
      .post(`/repos/${GITHUB_REPOSITORY}/labels`).reply(200)

    await actionFn(tools)
    expect(scoped.isDone()).toBe(true)
  })

  it('does not add the label if the user is not a sponsor', async () => {
    const scoped = nock('https://api.github.com')
      .post('/graphql').reply(200, {
        data: {
          node: {
            isSponsoredBy: false
          }
        }
      })

    await actionFn(tools)
    expect(scoped.isDone()).toBe(true)
  })
})
