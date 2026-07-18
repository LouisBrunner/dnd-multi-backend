/** biome-ignore-all lint/style/noCommonJs: require() is synchronous, needed here to avoid async timing issues */
import {afterEach, expect} from 'bun:test'
import {GlobalRegistrator} from '@happy-dom/global-registrator'

GlobalRegistrator.register()

const {default: _, ...matchers} = require('@testing-library/jest-dom/matchers')
const {cleanup} = require('@testing-library/react')

expect.extend(matchers)

afterEach(() => {
  cleanup()
  document.body.innerHTML = ''
})
