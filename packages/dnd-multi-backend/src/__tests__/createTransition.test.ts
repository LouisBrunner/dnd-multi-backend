import { createTransition } from '../createTransition'

describe('createTransition function', () => {
  test('creates a valid transition', () => {
    const eventName = 'test_event'
    const func = jest.fn()

    const transition = createTransition(eventName, func)

    expect(transition.event).toBe(eventName)

    const fakeEvent = document.createEvent('Event')
    expect(func).not.toBeCalled()
    transition.check(fakeEvent)
    expect(func).toHaveBeenCalledTimes(1)
    expect(func).toBeCalledWith(fakeEvent)
  })
})
