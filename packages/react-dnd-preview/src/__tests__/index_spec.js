/* eslint-disable no-unused-expressions */
import { expect, sinon, mount } from 'tests/framework';
import { StubAndDo } from 'sinon-spy-utils';
import React from 'react';

import Preview from '../index';

describe('Preview component', () => {
  const createComponent = ({isDragging = false, currentOffset = null, generator = sinon.stub(), item = {}, itemType = ''} = {}) => {
    const context = {
      dragDropManager: {
        getMonitor: () => {
          return {
            getSourceClientOffset: () => { return currentOffset; },
            isDragging: () => { return isDragging; },
            getItemType: () => { return itemType; },
            getItem: () => { return item; },
            subscribeToOffsetChange: () => {},
            subscribeToStateChange: () => {},
          };
        },
      },
    };
    let component;
    StubAndDo(console, 'error', (spies) => {
      spies.error.callsFake((warning) => { throw new Error(warning); });
      component = mount(<Preview generator={generator} />, {context});
    });
    return component;
  };

  it('is a DragLayer-decorated Preview', () => {
    const component = createComponent();
    expect(component.name()).to.equal('DragLayer(Preview)');
    expect(component.node).to.be.an.instanceof(Preview);
  });

  it('fails with no generator', () => {
    expect(() => { createComponent({generator: null}); }).to.throw(Error,
      'Warning: Failed prop type: The prop `generator` is marked as required in `Preview`, but its value is `null`.'
    );
  });

  it('is null when DnD is not in progress', () => {
    const component = createComponent();
    expect(component.html()).to.be.null;
  });

  it('is valid when DnD is in progress', () => {
    const generator = sinon.stub();
    generator.callsFake((type, item, style) => {
      return <div style={style}>{item.coucou}: {type}</div>;
    });
    const component = createComponent({
      item: {coucou: 'dauphin'},
      itemType: 'toto',
      isDragging: true, currentOffset: {x: 1000, y: 2000},
      generator,
    });
    expect(component.html()).not.to.be.null;
    const div = component.find('div');
    expect(div).to.be.present();
    expect(div).to.have.text('dauphin: toto');
    expect(div).to.have.style('pointer-events', 'none');
    expect(div).to.have.style('position', 'fixed');
    expect(div).to.have.style('top', '0px');
    expect(div).to.have.style('left', '0px');
    expect(div).to.have.style('transform', 'translate(1000px, 2000px)');
    expect(div).to.have.style('WebkitTransform', 'translate(1000px, 2000px)');
  });
});
