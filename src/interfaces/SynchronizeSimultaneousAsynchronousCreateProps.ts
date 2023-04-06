import { SynchronizeHandle } from "./SynchronizeHandle"
import { TimeLapse } from "./TimeLapse"

export interface SynchronizeSimultaneousAsynchronousCreateProps<
  EventsObject extends Record<string, Function>
> {
  events: EventsObject
  timeLapse: TimeLapse
  synchronizeHandle?: SynchronizeHandle<string, (props: unknown[]) => void>
}
