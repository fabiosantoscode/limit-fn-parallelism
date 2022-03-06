module.exports = (limitedFunction, parallelismLimit = 1) => {
  const enqueued = []
  const enqueue = () => {
    return new Promise(resolve => {
      enqueued.push(resolve)
    })
  }
  const dequeue = () => {
    if (enqueued.length) {
      enqueued.shift()()
    }
  }

  const limited = async (...args) => {
    if (limited.concurrentCalls < parallelismLimit) {
      limited.concurrentCalls++

      try {
        return await limitedFunction(...args)
      } finally {
        limited.concurrentCalls--
        dequeue()
      }
    } else {
      await enqueue()
      return await limited(...args)
    }
  }

  limited.concurrentCalls = 0

  limited.allFinished = async () => {
    while (limited.concurrentCalls > 0) {
      await enqueue()
    }
  }

  return limited
}
