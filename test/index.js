const parallelHof = require('..')
const sinon = require('sinon')
const assert = require('assert')

it('calls an async function', async () => {
  const theSpy = sinon.spy()
  const func = parallelHof(theSpy)

  await func(1)
  assert(theSpy.calledWith(1))
})

it('only calls one at a time', async () => {
  let concurrentCalls = 0
  const limitedFn = parallelHof(async (calledWith) => {
    assert(concurrentCalls++ === 0)
    await Promise.resolve()
    concurrentCalls--
    return `called with ${calledWith}`
  })

  assert.deepEqual(await Promise.all([
    limitedFn(1),
    limitedFn(2)
  ]), ['called with 1', 'called with 2'])
})

it('calls in the correct order', async () => {
  let concurrentCalls = 0
  const limitedFn = parallelHof(async (calledWith) => {
    assert(concurrentCalls++ === 0)
    await Promise.resolve()
    concurrentCalls--
    return `called with ${calledWith}`
  })

  assert.deepEqual(await Promise.all([
    limitedFn(1),
    limitedFn(2),
    limitedFn(3),
  ]), ['called with 1', 'called with 2', 'called with 3'])
})

it('allows more than 1 concurrent call', async () => {
  let concurrentCalls = 0
  const limitedFn = parallelHof(async () => {
    const hadConcurrency = ++concurrentCalls
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
    concurrentCalls--
    return hadConcurrency
  }, 2)

  assert.deepEqual(
    await Promise.all([
      limitedFn(1),
      limitedFn(2),
      limitedFn(3),
    ]),
    [1, 2, 1]
  )
})

it('allows to wait for all calls to be through', async () => {
  let concurrentCalls = 0
  const limitedFn = parallelHof(async () => {
    const hadConcurrency = ++concurrentCalls
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
    concurrentCalls--
    return hadConcurrency
  }, 2)

  limitedFn()
  limitedFn()
  limitedFn()

  assert(concurrentCalls)
  await limitedFn.allFinished()
  assert(!concurrentCalls)
})
