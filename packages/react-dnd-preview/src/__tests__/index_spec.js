import * as Module from '../index';

import { Preview } from '../Preview';
import { Context } from '../Context';

describe('react-dnd-preview module', () => {
  test('exports correctly', () => {
    expect(Module.Preview).toBe(Preview);
    expect(Module.Context).toBe(Context);
  });
});
