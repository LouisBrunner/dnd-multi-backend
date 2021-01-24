import {usePreview, usePreviewStateDisplay} from '../usePreview'
import { renderHook, act } from '@testing-library/react-hooks'
import {MockDragMonitor} from '@mocks/mocks'
import {__setMockMonitor} from '@mocks/react-dnd'

describe('usePreview hook', () => {
  beforeEach(() => {
    __setMockMonitor(MockDragMonitor())
  })

  test('return false when DnD is not in progress (neither dragging or offset)', () => {
    __setMockMonitor(MockDragMonitor())
    const {result: {current: {display}}} = renderHook(() => { return usePreview() })
    expect(display).toBe(false)
  })

  test('return false when DnD is not in progress (no dragging)', () => {
    __setMockMonitor({
      ...MockDragMonitor(),
      getClientOffset() { return {x: 1, y: 2} },
    })
    const {result: {current: {display}}} = renderHook(() => { return usePreview() })
    expect(display).toBe(false)
  })

  test('return false when DnD is not in progress (no offset)', () => {
    __setMockMonitor({
      ...MockDragMonitor(),
      isDragging() { return true },
    })
    const {result: {current: {display}}} = renderHook(() => { return usePreview() })
    expect(display).toBe(false)
  })

  test('return true and data when DnD is in progress', () => {
    __setMockMonitor({
      ...MockDragMonitor(),
      isDragging() { return true },
      getItemType() { return 'no' },
      getItem() { return {bluh: 'fake'} },
      getClientOffset() { return {x: 1, y: 2} },
    })
    const {result} = renderHook(() => { return usePreview() as usePreviewStateDisplay })
    const {current: {display, monitor: _monitor, ref, ...rest}} = result
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
    const {result} = renderHook(() => { return usePreview() as usePreviewStateDisplay })
    const {current: {display, monitor: _monitor, ref, ...rest}} = result
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

  test('return true and data when DnD is in progress (with ref)', () => {
    __setMockMonitor({
      ...MockDragMonitor(),
      isDragging() { return true },
      getItemType() { return 'no' },
      getItem() { return {bluh: 'fake'} },
      getClientOffset() { return {x: 1, y: 2} },
      getInitialClientOffset() { return {x: 1, y: 2} },
    })
    const {result, rerender} = renderHook(() => { return usePreview() as usePreviewStateDisplay })
    const {current: {display, monitor: _monitor, ref, ...rest}} = result
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
    act(() => {
      ref.current = {
        ...document.createElement('div'),
        getBoundingClientRect() {
          return {
            width: 100, height: 70,
            x: 0, y: 0, bottom: 0, left: 0, right: 0, top: 0,
            toJSON() {},
          }
        },
      }
    })
    rerender()
    const {current: {display: _display, monitor: _monitor2, ref: _ref, ...rest2}} = result
    expect(rest2).toEqual({
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
    const {result, rerender} = renderHook(() => { return usePreview() as usePreviewStateDisplay })
    const {current: {display, monitor: _monitor, ref, ...rest}} = result
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
    act(() => {
      ref.current = {
        ...document.createElement('div'),
        getBoundingClientRect() {
          return {
            width: 100, height: 70,
            x: 0, y: 0, bottom: 0, left: 0, right: 0, top: 0,
            toJSON() {},
          }
        },
      }
    })
    rerender()
    const {current: {display: _display, monitor: _monitor2, ref: _ref, ...rest2}} = result
    expect(rest2).toEqual({
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
