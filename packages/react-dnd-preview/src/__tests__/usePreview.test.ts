import {MockDragMonitor} from '@mocks/mocks'
import {__setMockMonitor} from '@mocks/react-dnd'
import {act, renderHook} from '@testing-library/react'
import type {MutableRefObject} from 'react'
import type {PreviewPlacement} from '../offsets'
import {usePreview, type usePreviewStateFull} from '../usePreview'

const DraggingMonitor = {
  isDragging() {
    return true
  },
  getItemType() {
    return 'no'
  },
  getClientOffset() {
    return {x: 1, y: 2}
  },
}

describe('usePreview hook', () => {
  beforeEach(() => {
    __setMockMonitor(MockDragMonitor<unknown>(null))
  })

  test('return false when DnD is not in progress (neither dragging or offset)', () => {
    __setMockMonitor(MockDragMonitor<unknown>(null))
    const {
      result: {
        current: {display},
      },
    } = renderHook(() => {
      return usePreview()
    })
    expect(display).toBe(false)
  })

  test('return false when DnD is not in progress (no dragging)', () => {
    __setMockMonitor({
      ...MockDragMonitor<unknown>(null),
      getClientOffset() {
        return {x: 1, y: 2}
      },
    })
    const {
      result: {
        current: {display},
      },
    } = renderHook(() => {
      return usePreview()
    })
    expect(display).toBe(false)
  })

  test('return false when DnD is not in progress (no offset)', () => {
    __setMockMonitor({
      ...MockDragMonitor<unknown>(null),
      isDragging() {
        return true
      },
    })
    const {
      result: {
        current: {display},
      },
    } = renderHook(() => {
      return usePreview()
    })
    expect(display).toBe(false)
  })

  test('return true and data when DnD is in progress', () => {
    __setMockMonitor({
      ...MockDragMonitor<{bluh: string}>({bluh: 'fake'}),
      ...DraggingMonitor,
    })
    const {result} = renderHook(() => {
      return usePreview() as usePreviewStateFull
    })
    const {
      current: {display, monitor: _monitor, ref, ...rest},
    } = result
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
        WebkitTransform: 'translate(1.0px, 2.0px)',
        transform: 'translate(1.0px, 2.0px)',
      },
    })
  })

  test('return true and data when DnD is in progress (with parent offset)', () => {
    __setMockMonitor({
      ...MockDragMonitor<{bluh: string}>({bluh: 'fake'}),
      ...DraggingMonitor,
      getInitialClientOffset() {
        return {x: 1, y: 2}
      },
      getInitialSourceClientOffset() {
        return {x: 0, y: 1}
      },
    })
    const {result} = renderHook(() => {
      return usePreview() as usePreviewStateFull
    })
    const {
      current: {display, monitor: _monitor, ref, ...rest},
    } = result
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
        WebkitTransform: 'translate(0.0px, 1.0px)',
        transform: 'translate(0.0px, 1.0px)',
      },
    })
  })

  test('return true and data when DnD is in progress (with ref)', async () => {
    __setMockMonitor({
      ...MockDragMonitor<{bluh: string}>({bluh: 'fake'}),
      ...DraggingMonitor,
      getInitialClientOffset() {
        return {x: 1, y: 2}
      },
    })
    const {result, rerender} = renderHook(() => {
      return usePreview() as usePreviewStateFull
    })
    const {
      current: {display, monitor: _monitor, ref, ...rest},
    } = result
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
        WebkitTransform: 'translate(1.0px, 2.0px)',
        transform: 'translate(1.0px, 2.0px)',
      },
    })
    await act<void>(() => {
      // FIXME: not great...
      ;(ref as MutableRefObject<HTMLDivElement>).current = {
        ...document.createElement('div'),
        getBoundingClientRect() {
          return {
            width: 100,
            height: 70,
            x: 0,
            y: 0,
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
            toJSON() {},
          }
        },
      }
    })
    rerender()
    const {
      current: {display: _display, monitor: _monitor2, ref: _ref, ...rest2},
    } = result
    expect(rest2).toEqual({
      item: {bluh: 'fake'},
      itemType: 'no',
      style: {
        pointerEvents: 'none',
        position: 'fixed',
        left: 0,
        top: 0,
        WebkitTransform: 'translate(-49.0px, -33.0px)',
        transform: 'translate(-49.0px, -33.0px)',
      },
    })
  })

  const cases: {placement?: PreviewPlacement; expectedTransform: string}[] = [
    {
      expectedTransform: 'translate(-49.0px, -33.0px)',
    },
    {
      placement: 'center',
      expectedTransform: 'translate(-49.0px, -33.0px)',
    },
    {
      placement: 'top',
      expectedTransform: 'translate(-49.0px, 2.0px)',
    },
    {
      placement: 'top-start',
      expectedTransform: 'translate(1.0px, 2.0px)',
    },
    {
      placement: 'top-end',
      expectedTransform: 'translate(-99.0px, 2.0px)',
    },
    {
      placement: 'bottom',
      expectedTransform: 'translate(-49.0px, -68.0px)',
    },
    {
      placement: 'bottom-start',
      expectedTransform: 'translate(1.0px, -68.0px)',
    },
    {
      placement: 'bottom-end',
      expectedTransform: 'translate(-99.0px, -68.0px)',
    },
    {
      placement: 'left',
      expectedTransform: 'translate(1.0px, -33.0px)',
    },
    {
      placement: 'right',
      expectedTransform: 'translate(-99.0px, -33.0px)',
    },
  ]

  test.each(cases)('return true and data when DnD is in progress (with ref, parent offset and placement $placement)', async ({placement, expectedTransform}) => {
    __setMockMonitor({
      ...MockDragMonitor<{bluh: string}>({bluh: 'fake'}),
      ...DraggingMonitor,
      getInitialClientOffset() {
        return {x: 1, y: 2}
      },
      getInitialSourceClientOffset() {
        return {x: 0, y: 1}
      },
    })
    const {result, rerender} = renderHook(() => {
      return usePreview({placement}) as usePreviewStateFull
    })
    const {
      current: {display, monitor: _monitor, ref, ...rest},
    } = result
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
        WebkitTransform: 'translate(0.0px, 1.0px)',
        transform: 'translate(0.0px, 1.0px)',
      },
    })
    await act<void>(() => {
      // FIXME: not great...
      ;(ref as MutableRefObject<HTMLDivElement>).current = {
        ...document.createElement('div'),
        getBoundingClientRect() {
          return {
            width: 100,
            height: 70,
            x: 0,
            y: 0,
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
            toJSON() {},
          }
        },
      }
    })
    rerender({placement})
    const {
      current: {display: _display, monitor: _monitor2, ref: _ref, ...rest2},
    } = result
    expect(rest2).toEqual({
      item: {bluh: 'fake'},
      itemType: 'no',
      style: {
        pointerEvents: 'none',
        position: 'fixed',
        left: 0,
        top: 0,
        WebkitTransform: expectedTransform,
        transform: expectedTransform,
      },
    })
  })
})
