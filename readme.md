# Description

Asynchronous events may be triggered almost simultaneously triggering callbacks that changes the same state leading to undesidered states.

This Library provides a class that wraps those events in a callback that adds them to a stack. The synchronizeHandle callback will be called over the stack of events at the end of the time lapse passage after the last event.

This way, if those asynchronous events occur almost simultaneouly given a timeLapse, a callback can be defined to decide how to handle that situation managing the callbacks.

Default synchronizeHandle triggers the first event on the stack and ignores the remaining.

# Usage

```ts
import { SSA } from "nlsn-ssa"

const defaultSynchronizeHandle: SynchronizeHandle = (events) => {
  if (events.length === 0) {
    return
  }

  const firstEvent = events[0]

  firstEvent.callback()
}

const { foo, bar } = SSA({
  timeLapse: 100, // time lapse in ms,
  events: {
    foo: () => jest.fn().mockImplementation(() => console.log("hello foo")),
    bar: () => jest.fn().mockImplementation(() => console.log("hello bar")),
  },
  synchronizeHandle: defaultSynchronizeHandle,
})

// Simultaneous call to foo and bar under 100ms
foo()
bar()

// Waits for 100ms
expect(foo).toHaveBeenCalledTimes(1)
expect(bar).toHaveBeenCalledTimes(0)
```
