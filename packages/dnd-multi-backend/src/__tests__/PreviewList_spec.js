import { PreviewManager, PreviewList } from '../PreviewList';

const createPreview = () => {
  return { backendChanged: jest.fn() };
};

describe('PreviewManager class', () => {
  test('does nothing when empty', () => {
    expect(() => PreviewManager.backendChanged(123)).not.toThrow();
  });

  test('notifies registered previews', () => {
    const preview1 = createPreview(), preview2 = createPreview();
    PreviewManager.register(preview1);
    PreviewManager.register(preview2);
    PreviewManager.backendChanged(123);
    expect(preview1.backendChanged).toHaveBeenCalledWith(123);
    expect(preview2.backendChanged).toHaveBeenCalledWith(123);
    PreviewManager.unregister(preview1);
    PreviewManager.unregister(preview2);
  });

  test('stops notifying after unregistering', () => {
    const preview1 = createPreview(), preview2 = createPreview();
    PreviewManager.register(preview1);
    PreviewManager.register(preview2);
    PreviewManager.backendChanged(123);
    expect(preview1.backendChanged).toHaveBeenCalledWith(123);
    expect(preview2.backendChanged).toHaveBeenCalledWith(123);
    PreviewManager.unregister(preview2);
    PreviewManager.backendChanged(456);
    expect(preview1.backendChanged).toHaveBeenCalledWith(456);
    expect(preview2.backendChanged).toHaveBeenCalledTimes(1);
    PreviewManager.unregister(preview1);
  });
});

describe('PreviewList class', () => {
  let list;
  beforeEach(() => {
    list = new PreviewList();
  });

  test('does nothing when empty', () => {
    expect(() => list.backendChanged(123)).not.toThrow();
  });

  test('notifies registered previews', () => {
    const preview1 = createPreview(), preview2 = createPreview();
    list.register(preview1);
    list.register(preview2);
    list.backendChanged(123);
    expect(preview1.backendChanged).toHaveBeenCalledWith(123);
    expect(preview2.backendChanged).toHaveBeenCalledWith(123);
    list.unregister(preview1);
    list.unregister(preview2);
  });

  test('stops notifying after unregistering', () => {
    const preview1 = createPreview(), preview2 = createPreview();
    list.register(preview1);
    list.register(preview2);
    list.backendChanged(123);
    expect(preview1.backendChanged).toHaveBeenCalledWith(123);
    expect(preview2.backendChanged).toHaveBeenCalledWith(123);
    list.unregister(preview2);
    list.backendChanged(456);
    expect(preview1.backendChanged).toHaveBeenCalledWith(456);
    expect(preview2.backendChanged).toHaveBeenCalledTimes(1);
    list.unregister(preview1);
  });
});
