import React from 'react'
import {usePreview, usePreviewStateFull} from '../usePreview'
import {render} from '@testing-library/react'
import {MockDragMonitor} from '@mocks/mocks'
import {__setMockMonitor} from '@mocks/react-dnd'

describe('usePreview hook', () => {
  beforeEach(() => {
    __setMockMonitor(MockDragMonitor())
  })

  const testHook = (useTests: () => void, {rerender = false} = {}) => {
    let called = false
    const Component = () => {
      useTests()
      called = true
      return null
    }
    const {rerender: rerenderFn} = render(<Component />)
    expect(called).toBe(true)
    if (rerender) {
      called = false
      rerenderFn(<Component />)
      expect(called).toBe(true)
    }
  }

  test('return false when DnD is not in progress (neither dragging or offset)', () => {
    __setMockMonitor(MockDragMonitor())
    testHook(() => {
      const {display} = usePreview()
      expect(display).toBe(false)
    })
  })

  test('return false when DnD is not in progress (no dragging)', () => {
    __setMockMonitor(MockDragMonitor())
    testHook(() => {
      const {display} = usePreview()
      expect(display).toBe(false)
    })
  })

  test('return false when DnD is not in progress (no offset)', () => {
    __setMockMonitor({
      ...MockDragMonitor(),
      isDragging() { return true },
    })
    testHook(() => {
      const {display} = usePreview()
      expect(display).toBe(false)
    })
  })

  test('return true and data when DnD is in progress', () => {
    __setMockMonitor({
      ...MockDragMonitor(),
      isDragging() { return true },
      getItemType() { return 'no' },
      getItem() { return {bluh: 'fake'} },
      getClientOffset() { return {x: 1, y: 2} },
    })
    testHook(() => {
      const {display, monitor: _monitor, ref, ...rest} = usePreview() as usePreviewStateFull
      expect(display).toBe(true)
      expect(ref).not.toBeNull()
      expect(rest).toEqual({
        item: {bluh: 'fake'},
        itemType: 'no',
        style: {
          pointerEvents: 'none',
          position: 'fixed',
          left: 0,
          top: 0,
          WebkitTransform: 'translate(1px, 2px)',
          transform: 'translate(1px, 2px)',
        },
      })
    })
  })

  test('return true and data when DnD is in progress (with parent offset)', () => {
    __setMockMonitor({
      ...MockDragMonitor(),
      isDragging() { return true },
      getItemType() { return 'no' },
      getItem() { return {bluh: 'fake'} },
      getClientOffset() { return {x: 1, y: 2} },
      getInitialClientOffset() { return {x: 1, y: 2} },
      getInitialSourceClientOffset() { return {x: 0, y: 1} },
    })
    testHook(() => {
      const {display, monitor: _monitor, ref, ...rest} = usePreview() as usePreviewStateFull
      expect(display).toBe(true)
      expect(ref).not.toBeNull()
      expect(rest).toEqual({
        item: {bluh: 'fake'},
        itemType: 'no',
        style: {
          pointerEvents: 'none',
          position: 'fixed',
          left: 0,
          top: 0,
          WebkitTransform: 'translate(0px, 1px)',
          transform: 'translate(0px, 1px)',
        },
      })
    })
  })

  test('return true and data when DnD is in progress (with ref)', () => {
    __setMockMonitor({
      ...MockDragMonitor(),
      isDragging() { return true },
      getItemType() { return 'no' },
      getItem() { return {bluh: 'fake'} },
      getClientOffset() { return {x: 1, y: 2} },
      getInitialClientOffset() { return {x: 1, y: 2} },
    })
    const spy = jest.fn()
    testHook(() => {
      const {display, ref, monitor: _monitor, ...rest} = usePreview() as usePreviewStateFull
      expect(display).toBe(true)
      expect(ref).not.toBeNull()
      spy(rest)
      ref.current = {
        ...document.createElement('div'),
        getBoundingClientRect() {
          return {
            width: 100, height: 70,
            x: 0, y: 0, bottom: 0, left: 0, right: 0, top: 0,
            toJSON() { }
          }
        },
      }
    }, {rerender: true})
    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenNthCalledWith(1, {
      item: {bluh: 'fake'},
      itemType: 'no',
      style: {
        pointerEvents: 'none',
        position: 'fixed',
        left: 0,
        top: 0,
        WebkitTransform: 'translate(1px, 2px)',
        transform: 'translate(1px, 2px)',
      },
    })
    expect(spy).toHaveBeenNthCalledWith(2, {
      item: {bluh: 'fake'},
      itemType: 'no',
      style: {
        pointerEvents: 'none',
        position: 'fixed',
        left: 0,
        top: 0,
        WebkitTransform: 'translate(-49px, -33px)',
        transform: 'translate(-49px, -33px)',
      },
    })
  })

  test('return true and data when DnD is in progress (with ref and parent offset)', () => {
    __setMockMonitor({
      ...MockDragMonitor(),
      isDragging() { return true },
      getItemType() { return 'no' },
      getItem() { return {bluh: 'fake'} },
      getClientOffset() { return {x: 1, y: 2} },
      getInitialClientOffset() { return {x: 1, y: 2} },
      getInitialSourceClientOffset() { return {x: 0, y: 1} },
    })
    const spy = jest.fn()
    testHook(() => {
      const {display, monitor: _monitor, ref, ...rest} = usePreview() as usePreviewStateFull
      expect(display).toBe(true)
      expect(ref).not.toBeNull()
      spy(rest)
      ref.current = {
        ...document.createElement('div'),
        getBoundingClientRect() {
          return {
            width: 100, height: 70,
            x: 0, y: 0, bottom: 0, left: 0, right: 0, top: 0,
            toJSON() {}
          }
        },
      }
    }, {rerender: true})
    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenNthCalledWith(1, {
      item: {bluh: 'fake'},
      itemType: 'no',
      style: {
        pointerEvents: 'none',
        position: 'fixed',
        left: 0,
        top: 0,
        WebkitTransform: 'translate(0px, 1px)',
        transform: 'translate(0px, 1px)',
      },
    })
    expect(spy).toHaveBeenNthCalledWith(2, {
      item: {bluh: 'fake'},
      itemType: 'no',
      style: {
        pointerEvents: 'none',
        position: 'fixed',
        left: 0,
        top: 0,
        WebkitTransform: 'translate(-49px, -33px)',
        transform: 'translate(-49px, -33px)',
      },
    })
  })
})
