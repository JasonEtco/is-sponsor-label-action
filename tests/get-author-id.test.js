const getAuthorId = require('../lib/get-author-id')

describe('getAuthorId', () => {
  it('gets the author id from the issue', () => {
    const payload = {
      issue: {
        user: {
          node_id: 'hello'
        }
      }
    }

    expect(getAuthorId(payload)).toBe('hello')
  })

  it('gets the author id from the pull request', () => {
    const payload = {
      pull_request: {
        user: {
          node_id: 'hello'
        }
      }
    }

    expect(getAuthorId(payload)).toBe('hello')
  })

  it('throws if no id was found', () => {
    const payload = {}
    expect(() => getAuthorId(payload)).toThrow()
  })
})
