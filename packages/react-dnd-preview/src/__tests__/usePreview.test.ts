import {beforeEach, describe, expect, mock, test} from 'bun:test'
import {createMock} from '@mocks/mocks.js'
import {act, renderHook} from '@testing-library/react'
import type {DragLayerMonitor} from 'react-dnd'
import type {PreviewPlacement} from '../offsets.js'
import {usePreview, type usePreviewStateFull} from '../usePreview.js'

type MockItemType = {bluh: string}

const EmptyMonitor = {
  getClientOffset() {
    return null
  },
  getDifferenceFromInitialOffset() {
    return null
  },
  getInitialClientOffset() {
    return null
  },
  getInitialSourceClientOffset() {
    return null
  },
  getItem<T>() {
    return null as T
  },
  getItemType() {
    return null
  },
  getSourceClientOffset() {
    return null
  },
  isDragging() {
    return false
  },
} satisfies Partial<DragLayerMonitor>

const DraggingMonitor = {
  ...EmptyMonitor,
  getClientOffset() {
    return {x: 1, y: 2}
  },
  getItemType() {
    return 'no'
  },
  isDragging() {
    return true
  },
} satisfies Partial<DragLayerMonitor>

const makeFakeDiv = (): HTMLDivElement => ({
  ...document.createElement('div'),
  getBoundingClientRect() {
    return {
      bottom: 0,
      height: 70,
      left: 0,
      right: 0,
      toJSON() {},
      top: 0,
      width: 100,
      x: 0,
      y: 0,
    }
  },
})

const __setMockMonitor = <T extends DragLayerMonitor>(monitor: T) => {
  mock.module('react-dnd', () => ({
    useDragLayer: <D, C>(collect: (monitor: DragLayerMonitor<D>) => C) => {
      return collect(monitor)
    },
  }))
}

describe('usePreview hook', () => {
  beforeEach(() => {
    __setMockMonitor(createMock<DragLayerMonitor>())
  })

  test('return false when DnD is not in progress (neither dragging or offset)', () => {
    __setMockMonitor({...createMock<DragLayerMonitor>(), ...EmptyMonitor})
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
      ...createMock<DragLayerMonitor>(),
      ...EmptyMonitor,
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
      ...createMock<DragLayerMonitor>(),
      ...EmptyMonitor,
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
      ...createMock<MockItemType>(),
      ...DraggingMonitor,
      getItem<T = MockItemType>() {
        return {bluh: 'fake'} as T
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
        left: 0,
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        transform: 'translate(1.0px, 2.0px)',
        WebkitTransform: 'translate(1.0px, 2.0px)',
      },
    })
  })

  test('return true and data when DnD is in progress (with parent offset)', () => {
    __setMockMonitor({
      ...createMock<DragLayerMonitor<MockItemType>>(),
      ...DraggingMonitor,
      getInitialClientOffset() {
        return {x: 1, y: 2}
      },
      getInitialSourceClientOffset() {
        return {x: 0, y: 1}
      },
      getItem<T = MockItemType>() {
        return {bluh: 'fake'} as T
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
        left: 0,
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        transform: 'translate(0.0px, 1.0px)',
        WebkitTransform: 'translate(0.0px, 1.0px)',
      },
    })
  })

  test('return true and data when DnD is in progress (with ref)', async () => {
    __setMockMonitor({
      ...createMock<DragLayerMonitor<MockItemType>>(),
      ...DraggingMonitor,
      getInitialClientOffset() {
        return {x: 1, y: 2}
      },
      getItem<T = MockItemType>() {
        return {bluh: 'fake'} as T
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
        left: 0,
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        transform: 'translate(1.0px, 2.0px)',
        WebkitTransform: 'translate(1.0px, 2.0px)',
      },
    })
    await act<void>(() => {
      ref.current = makeFakeDiv()
    })
    rerender()
    const {
      current: {display: _display, monitor: _monitor2, ref: _ref, ...rest2},
    } = result
    expect(rest2).toEqual({
      item: {bluh: 'fake'},
      itemType: 'no',
      style: {
        left: 0,
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        transform: 'translate(-49.0px, -33.0px)',
        WebkitTransform: 'translate(-49.0px, -33.0px)',
      },
    })
  })

  const cases: {placement?: PreviewPlacement; expectedTransform: string}[] = [
    {
      expectedTransform: 'translate(-49.0px, -33.0px)',
    },
    {
      expectedTransform: 'translate(-49.0px, -33.0px)',
      placement: 'center',
    },
    {
      expectedTransform: 'translate(-49.0px, 2.0px)',
      placement: 'top',
    },
    {
      expectedTransform: 'translate(1.0px, 2.0px)',
      placement: 'top-start',
    },
    {
      expectedTransform: 'translate(-99.0px, 2.0px)',
      placement: 'top-end',
    },
    {
      expectedTransform: 'translate(-49.0px, -68.0px)',
      placement: 'bottom',
    },
    {
      expectedTransform: 'translate(1.0px, -68.0px)',
      placement: 'bottom-start',
    },
    {
      expectedTransform: 'translate(-99.0px, -68.0px)',
      placement: 'bottom-end',
    },
    {
      expectedTransform: 'translate(1.0px, -33.0px)',
      placement: 'left',
    },
    {
      expectedTransform: 'translate(-99.0px, -33.0px)',
      placement: 'right',
    },
  ]

  test.each(cases)('return true and data when DnD is in progress (with ref, parent offset and placement $placement)', async ({placement, expectedTransform}) => {
    __setMockMonitor({
      ...createMock<DragLayerMonitor<MockItemType>>(),
      ...DraggingMonitor,
      getInitialClientOffset() {
        return {x: 1, y: 2}
      },
      getInitialSourceClientOffset() {
        return {x: 0, y: 1}
      },
      getItem<T = MockItemType>() {
        return {bluh: 'fake'} as T
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
        left: 0,
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        transform: 'translate(0.0px, 1.0px)',
        WebkitTransform: 'translate(0.0px, 1.0px)',
      },
    })
    await act<void>(() => {
      ref.current = makeFakeDiv()
    })
    rerender({placement})
    const {
      current: {display: _display, monitor: _monitor2, ref: _ref, ...rest2},
    } = result
    expect(rest2).toEqual({
      item: {bluh: 'fake'},
      itemType: 'no',
      style: {
        left: 0,
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        transform: expectedTransform,
        WebkitTransform: expectedTransform,
      },
    })
  })
})
