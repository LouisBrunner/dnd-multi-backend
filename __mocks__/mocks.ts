import type {Mock} from 'bun:test'
import {jest} from 'bun:test'

type MockFn<T extends (...args: any[]) => any> = Mock<OmitThisParameter<T>>

export type Mocked<T> = {
  [P in keyof T]: T[P] extends (...args: any[]) => any ? MockFn<T[P]> : T[P]
}

export const createMock = <T extends object>(): T & Mocked<T> => {
  const cache: Record<string | symbol, ReturnType<typeof jest.fn>> = {}
  return new Proxy({} as T & Mocked<T>, {
    get(_, prop) {
      if (!(prop in cache)) {
        cache[prop] = jest.fn()
      }
      return cache[prop]
    },
  })
}
