import HTML5toTouch from '../HTML5toTouch';
import { TouchTransition, MouseTransition } from 'dnd-multi-backend';

describe('HTML5toTouch pipeline', () => {
  test('has the HTML5 and Touch backends', () => {
    expect(HTML5toTouch).toBeInstanceOf(Object);
    expect(HTML5toTouch.backends).toBeInstanceOf(Array);
    expect(HTML5toTouch.backends).toHaveLength(2);

    expect(HTML5toTouch.backends[0]).toBeInstanceOf(Object);
    expect(HTML5toTouch.backends[0].id).not.toBeUndefined();
    expect(HTML5toTouch.backends[0].backend).not.toBeUndefined();
    expect(HTML5toTouch.backends[0].preview).toBeUndefined();
    expect(HTML5toTouch.backends[0].transition).toBe(MouseTransition);

    expect(HTML5toTouch.backends[1]).toBeInstanceOf(Object);
    expect(HTML5toTouch.backends[1].id).not.toBeUndefined();
    expect(HTML5toTouch.backends[1].backend).not.toBeUndefined();
    expect(HTML5toTouch.backends[1].options).toBeInstanceOf(Object);
    expect(HTML5toTouch.backends[1].preview).toBe(true);
    expect(HTML5toTouch.backends[1].transition).toBe(TouchTransition);
  });
});
