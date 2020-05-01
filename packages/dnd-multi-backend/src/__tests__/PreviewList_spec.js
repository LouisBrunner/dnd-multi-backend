import { PreviewList } from '../PreviewList';

describe('PreviewList class', () => {
  let list;
  beforeEach(() => {
    list = new PreviewList();
  });

  const createPreview = () => {
    return {backendChanged: jest.fn()};
  };

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
