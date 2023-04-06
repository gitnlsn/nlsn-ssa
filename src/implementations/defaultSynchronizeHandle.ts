import { SynchronizeHandle } from "../interfaces/SynchronizeHandle"

/**
 * Default Implementation to handle synchronize events.
 * Just runs the first event on the stack and ignore remaining.
 */
export const defaultSynchronizeHandle: SynchronizeHandle = (events) => {
  if (events.length === 0) {
    return
  }

  const firstEvent = events[0]

  firstEvent.callback()
}
