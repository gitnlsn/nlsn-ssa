import { IdentifiedEvent } from "../interfaces/IdentifiedEvent"
import { SimultaneousAsynchronousSynchronizer } from "./SimultaneousAsynchronousSynchronizer"

jest.useFakeTimers()

describe("SimultaneousAsynchronousSynchronizer", () => {
  it("should handle empty events object", () => {
    expect(() => {
      const synchronizer = SimultaneousAsynchronousSynchronizer.create({
        timeLapse: 100,
        events: {},
      })

      expect(synchronizer).toBeTruthy()
    }).not.toThrow()
  })

  it("should build synchronized events", () => {
    const someEvent = jest.fn()
    const otherEvent = jest.fn()

    const synchronizer = SimultaneousAsynchronousSynchronizer.create({
      timeLapse: 100,
      events: {
        someEvent,
        otherEvent,
      },
    })

    expect(synchronizer.getSynchronizedEvents()).toHaveProperty("someEvent")
    expect(synchronizer.getSynchronizedEvents()).toHaveProperty("otherEvent")
  })

  it("should call setTimeout with timeLapse", () => {
    const setTimeoutSpy = jest.spyOn(global, "setTimeout")

    const someEvent = jest.fn()

    const timeLapse = 100

    const synchronizer = SimultaneousAsynchronousSynchronizer.create({
      timeLapse,
      events: {
        someEvent,
      },
    })

    synchronizer.getSynchronizedEvents().someEvent()

    expect(setTimeoutSpy).toHaveBeenCalledTimes(1)
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.anything(), timeLapse)

    setTimeoutSpy.mockRestore()
  })

  it("should call events after timeout trigger", () => {
    const someEvent = jest.fn()

    const synchronizer = SimultaneousAsynchronousSynchronizer.create({
      timeLapse: 100,
      events: {
        someEvent,
      },
    })

    synchronizer.getSynchronizedEvents().someEvent()

    jest.runAllTimers()

    expect(someEvent).toHaveBeenCalledTimes(1)
  })

  it("should inject props", () => {
    const someEvent = jest.fn()

    const synchronizer = SimultaneousAsynchronousSynchronizer.create({
      timeLapse: 100,
      events: {
        someEvent,
      },
    })

    synchronizer.getSynchronizedEvents().someEvent("foo", "bar")

    jest.runAllTimers()

    expect(someEvent).toHaveBeenCalledTimes(1)
    expect(someEvent).toHaveBeenCalledWith("foo", "bar")
  })

  it("should call custom synchronizeHandle", () => {
    const events = { someEvent: jest.fn() }

    const synchronizeHandle = jest.fn()

    const timeLapse = 100

    const synchronizer = SimultaneousAsynchronousSynchronizer.create({
      timeLapse,
      events,
      synchronizeHandle,
    })

    synchronizer.getSynchronizedEvents().someEvent()

    jest.runAllTimers()

    expect(synchronizeHandle).toHaveBeenCalledTimes(1)
  })

  it("should call custom implementation for synchronizeHandle", () => {
    const events = { someEvent: jest.fn(), otherEvent: jest.fn() }

    const synchronizeHandle = jest
      .fn<void, [Array<IdentifiedEvent<string, Function>>]>()
      .mockImplementationOnce((events) =>
        events.forEach((event) => event.callback())
      )

    const timeLapse = 100

    const synchronizer = SimultaneousAsynchronousSynchronizer.create({
      timeLapse,
      events,
      synchronizeHandle,
    })

    synchronizer.getSynchronizedEvents().someEvent()
    synchronizer.getSynchronizedEvents().otherEvent()

    jest.runAllTimers()

    expect(events.someEvent).toHaveBeenCalledTimes(1)
    expect(events.otherEvent).toHaveBeenCalledTimes(1)
  })
})
