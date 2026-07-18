import {describe, expect, jest, test} from 'bun:test'
import {createTransition} from '../createTransition.ts'

describe('createTransition function', () => {
  test('creates a valid transition', () => {
    const eventName = 'test_event'
    const func = jest.fn()

    const transition = createTransition(eventName, func)

    expect(transition.event).toBe(eventName)

    const fakeEvent = document.createEvent('Event')
    expect(func).not.toHaveBeenCalled()
    transition.check(fakeEvent)
    expect(func).toHaveBeenCalledTimes(1)
    expect(func).toHaveBeenCalledWith(fakeEvent)
  })
})
