import * as Module from '../index';

import { Preview, PreviewContext } from '../components/Preview';
import { usePreview } from '../hooks';
import MultiBackend, { HTML5DragTransition, TouchTransition, MouseTransition, createTransition } from 'dnd-multi-backend';


describe('ReactDnDMultiBackend module', () => {
  test('exports a function to create MultiBackend', () => {
    expect(Module.default).toBeInstanceOf(Function);

    const fakeManager = {getMonitor: jest.fn(), getActions: jest.fn(), getRegistry: jest.fn(), getContext: jest.fn()};
    expect(Module.default(fakeManager, {}, {backends: [{backend: () => {}}]})).toBeInstanceOf(Object);
    expect(() => { Module.default(fakeManager, {}); }).toThrowError(Error);
  });

  test('exports utils components', () => {
    expect(Module.default).toBe(MultiBackend);

    expect(Module.Preview).toBe(Preview);
    expect(Module.PreviewContext).toBe(PreviewContext);

    expect(Module.usePreview).toBe(usePreview);

    expect(Module.HTML5DragTransition).toBe(HTML5DragTransition);
    expect(Module.TouchTransition).toBe(TouchTransition);
    expect(Module.MouseTransition).toBe(MouseTransition);
    expect(Module.createTransition).toBe(createTransition);
  });
});
