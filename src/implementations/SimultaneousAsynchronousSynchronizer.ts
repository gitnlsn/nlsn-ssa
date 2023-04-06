import { IdentifiedEvent } from "../interfaces/IdentifiedEvent"
import { SynchronizeHandle } from "../interfaces/SynchronizeHandle"
import { SynchronizeSimultaneousAsynchronousCreateProps } from "../interfaces/SynchronizeSimultaneousAsynchronousCreateProps"
import { TimeLapse } from "../interfaces/TimeLapse"
import { defaultSynchronizeHandle } from "./defaultSynchronizeHandle"

/**
 * Asynchronous events may be triggered almost simultaneously
 * triggering callbacks that changes the same state leading to undesidered states.
 *
 * This class wraps those events in a callback that adds them to a stack.
 * The synchronizeHandle callback will be called over the stack of events
 * at the end of the time lapse passage after the last event.
 *
 * This way, if those asynchronous events occur almost simultaneouly given a timeLapse,
 * a callback can be defined to decide how to handle that situation.
 *
 * Default synchronizeHandle triggers the first event on the stack.
 */
export class SimultaneousAsynchronousSynchronizer<
  EventsObject extends Record<string, Function>
> {
  // Events captured on the stack
  private eventStack: Array<IdentifiedEvent<string, (props: unknown[]) => void>>
  private lastTimeoutId: ReturnType<typeof setTimeout> | undefined

  private constructor(
    private readonly timeLapse: TimeLapse,
    private readonly events: EventsObject,
    private readonly synchronizeHandle: SynchronizeHandle<
      string,
      (props: unknown[]) => void
    >
  ) {
    this.eventStack = []
  }

  static create<EventObject extends Record<string, Function>>({
    timeLapse,
    events,
    synchronizeHandle = defaultSynchronizeHandle,
  }: SynchronizeSimultaneousAsynchronousCreateProps<EventObject>) {
    return new SimultaneousAsynchronousSynchronizer<EventObject>(
      timeLapse,
      events,
      synchronizeHandle
    )
  }

  private addEvent(event: typeof this.eventStack[0]) {
    if (this.lastTimeoutId) {
      clearTimeout(this.lastTimeoutId)
    }

    this.eventStack.push(event)

    this.lastTimeoutId = setTimeout(() => {
      if (this.eventStack.length === 0) {
        console.warn(
          "SimultaneousAsynchronousSynchronizer: synchronizeHandle method called with empty eventsStack. There might be some implementation issue."
        )
        return
      }
      this.synchronizeHandle(this.eventStack)
      this.eventStack = []
      this.lastTimeoutId = undefined
    }, this.timeLapse)
  }

  public getSynchronizedEvents(): EventsObject {
    return Object.keys(this.events).reduce<EventsObject>((acc, next) => {
      const callback = this.events[next as keyof EventsObject]
      return {
        ...acc,
        [next as keyof EventsObject]: (...props: unknown[]) =>
          this.addEvent({
            id: next,
            callback: () => callback(...props),
          }),
      }
    }, {} as EventsObject)
  }
}
