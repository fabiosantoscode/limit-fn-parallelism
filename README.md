# limit-fn-parallelism

Makes your function only be called with a maximum concurrency `limit`. Further calls are enqueued to be returned later.

## Synopsis

```js
const limitFnParallelism = require('limit-fn-parallelism')
const limitedFn = limitFn(async function expensiveFn(arg1, arg2) {
    // do something expensive asynchronously...
}, 2)

const results = await Promise.all([
    limitedFn(1, 2), // Starts right away
    limitedFn(3, 4), // Starts right away
    limitedFn(5, 6)  // Only starts when one of the others finish
])
```

## const limited = limitFnParallelism(asyncFn, [limit = 1])

Returns a limited version of the input function.

## limited.concurrentCalls

The number of executions going on at this moment in time.

## await limited.allFinished()

Waits for all calls to have returned (or thrown) limited.concurrentCalls will be zero.
