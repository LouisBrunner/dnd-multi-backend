import { usePreview } from '../usePreview';

let mockUseDragLayerData;
jest.mock('react-dnd', () => {
  return {
    useDragLayer: () => {
      return mockUseDragLayerData;
    },
  };
});

describe('usePreview hook', () => {
  beforeEach(() => {
    mockUseDragLayerData = null;
  });

  test('return false when DnD is not in progress (neither dragging or offset)', () => {
    mockUseDragLayerData = {
      isDragging: false,
      currentOffset: null,
    };
    const {display} = usePreview();
    expect(display).toBe(false);
  });

  test('return false when DnD is not in progress (no dragging)', () => {
    mockUseDragLayerData = {
      isDragging: false,
      currentOffset: {},
    };
    const {display} = usePreview();
    expect(display).toBe(false);
  });

  test('return false when DnD is not in progress (no offset)', () => {
    mockUseDragLayerData = {
      isDragging: true,
      currentOffset: null,
    };
    const {display} = usePreview();
    expect(display).toBe(false);
  });

  test('return true and data when DnD is in progress', () => {
    mockUseDragLayerData = {
      isDragging: true,
      currentOffset: {
        x: 1,
        y: 2,
      },
      item: {bluh: 'fake'},
      itemType: 'no',
    };
    const {display, ...rest} = usePreview();
    expect(display).toBe(true);
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
