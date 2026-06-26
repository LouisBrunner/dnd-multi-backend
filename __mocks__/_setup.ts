import {afterEach, expect} from 'bun:test'
import {GlobalRegistrator} from '@happy-dom/global-registrator'

GlobalRegistrator.register()

// require() is synchronous: ensures DOM is available when matchers load,
// and avoids async timing issues with --isolate mode
const {default: _, ...matchers} = require('@testing-library/jest-dom/matchers')
const {cleanup} = require('@testing-library/react')

expect.extend(matchers)

afterEach(() => {
  cleanup()
  document.body.innerHTML = ''
})
