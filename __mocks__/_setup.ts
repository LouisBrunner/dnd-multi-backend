import {afterEach, expect} from 'bun:test'
import {GlobalRegistrator} from '@happy-dom/global-registrator'

GlobalRegistrator.register()

const {default: _, ...matchers} = await import('@testing-library/jest-dom/matchers')
const {cleanup} = await import('@testing-library/react')

expect.extend(matchers)

afterEach(() => {
  cleanup()
})
