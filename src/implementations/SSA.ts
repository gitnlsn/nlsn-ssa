import { SynchronizeSimultaneousAsynchronousCreateProps } from "../interfaces/SynchronizeSimultaneousAsynchronousCreateProps"
import { SimultaneousAsynchronousSynchronizer } from "./SimultaneousAsynchronousSynchronizer"

/**
 * Synchronize simultaneous asynchronous events.
 * Shortcut to SimultaneousAsynchronousSynchronizer create factory method.
 */
export const SSA = <EventsObject extends Record<string, Function>>(
  props: SynchronizeSimultaneousAsynchronousCreateProps<EventsObject>
) => SimultaneousAsynchronousSynchronizer.create(props)
