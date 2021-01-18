import React from 'react';
import {usePreview} from '../usePreview';
import {render} from '@testing-library/react';

describe('usePreview hook', () => {
  beforeEach(() => {
    require('react-dnd').__setMockMonitor(null);
  });

  const testHook = (useTests, {rerender = false} = {}) => {
    let called = false;
    const Component = () => {
      useTests();
      called = true;
      return null;
    };
    const {rerender: rerenderFn} = render(<Component />);
    expect(called).toBe(true);
    if (rerender) {
      called = false;
      rerenderFn(<Component />);
      expect(called).toBe(true);
    }
  };

  test('return false when DnD is not in progress (neither dragging or offset)', () => {
    require('react-dnd').__setMockMonitor({
      isDragging() { return false; },
      getItemType() { return null; },
      getItem() { return null; },
      getClientOffset() { return null; },
      getInitialClientOffset() { return null; },
      getInitialSourceClientOffset() { return null; },
    });
    testHook(() => {
      const {display} = usePreview();
      expect(display).toBe(false);
    });
  });

  test('return false when DnD is not in progress (no dragging)', () => {
    require('react-dnd').__setMockMonitor({
      isDragging() { return false; },
      getItemType() { return null; },
      getItem() { return null; },
      getClientOffset() { return {}; },
      getInitialClientOffset() { return null; },
      getInitialSourceClientOffset() { return null; },
    });
    testHook(() => {
      const {display} = usePreview();
      expect(display).toBe(false);
    });
  });

  test('return false when DnD is not in progress (no offset)', () => {
    require('react-dnd').__setMockMonitor({
      isDragging() { return true; },
      getItemType() { return null; },
      getItem() { return null; },
      getClientOffset() { return null; },
      getInitialClientOffset() { return null; },
      getInitialSourceClientOffset() { return null; },
    });
    testHook(() => {
      const {display} = usePreview();
      expect(display).toBe(false);
    });
  });

  test('return true and data when DnD is in progress', () => {
    require('react-dnd').__setMockMonitor({
      isDragging() { return true; },
      getItemType() { return 'no'; },
      getItem() { return {bluh: 'fake'}; },
      getClientOffset() { return {x: 1, y: 2}; },
      getInitialClientOffset() { return null; },
      getInitialSourceClientOffset() { return null; },
    });
    testHook(() => {
      const {display, monitor: _monitor, ref, ...rest} = usePreview();
      expect(display).toBe(true);
      expect(ref).not.toBeNull();
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
      });
    });
  });

  test('return true and data when DnD is in progress (with parent offset)', () => {
    require('react-dnd').__setMockMonitor({
      isDragging() { return true; },
      getItemType() { return 'no'; },
      getItem() { return {bluh: 'fake'}; },
      getClientOffset() { return {x: 1, y: 2}; },
      getInitialClientOffset() { return {x: 1, y: 2}; },
      getInitialSourceClientOffset() { return {x: 0, y: 1}; },
    });
    testHook(() => {
      const {display, monitor: _monitor, ref, ...rest} = usePreview();
      expect(display).toBe(true);
      expect(ref).not.toBeNull();
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
      });
    });
  });

  test('return true and data when DnD is in progress (with ref)', () => {
    require('react-dnd').__setMockMonitor({
      isDragging() { return true; },
      getItemType() { return 'no'; },
      getItem() { return {bluh: 'fake'}; },
      getClientOffset() { return {x: 1, y: 2}; },
      getInitialClientOffset() { return {x: 1, y: 2}; },
      getInitialSourceClientOffset() { return null; },
    });
    const spy = jest.fn();
    testHook(() => {
      const {display, monitor: _monitor, ref, ...rest} = usePreview();
      expect(display).toBe(true);
      expect(ref).not.toBeNull();
      spy(rest);
      ref.current = {
        getBoundingClientRect() {
          return {width: 100, height: 70};
        },
      };
    }, {rerender: true});
    expect(spy).toHaveBeenCalledTimes(2);
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
    });
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
    });
  });

  test('return true and data when DnD is in progress (with ref and parent offset)', () => {
    require('react-dnd').__setMockMonitor({
      isDragging() { return true; },
      getItemType() { return 'no'; },
      getItem() { return {bluh: 'fake'}; },
      getClientOffset() { return {x: 1, y: 2}; },
      getInitialClientOffset() { return {x: 1, y: 2}; },
      getInitialSourceClientOffset() { return {x: 0, y: 1}; },
    });
    const spy = jest.fn();
    testHook(() => {
      const {display, monitor: _monitor, ref, ...rest} = usePreview();
      expect(display).toBe(true);
      expect(ref).not.toBeNull();
      spy(rest);
      ref.current = {
        getBoundingClientRect() {
          return {width: 100, height: 70};
        },
      };
    }, {rerender: true});
    expect(spy).toHaveBeenCalledTimes(2);
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
    });
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
    });
  });
});
