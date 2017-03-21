import { expect, sinon, mount } from 'tests/framework';
import React, { PureComponent } from 'react';
import { DragDropContext, DragLayer } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import MultiBackend from '../MultiBackend';

import Preview from '../Preview';

before(() => { sinon.stub(console, 'error').callsFake((warning) => { throw new Error(warning); }); });
after(() => { console.error.restore(); });

describe('Preview component', () => {
  const createComponent = ({preview = false, isDragging = false, currentOffset = null, generator = sinon.stub(), item = {}, itemType = ''} = {}) => {
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
        getBackend: () => {
          return {
            previewEnabled: () => { return preview; },
          };
        },
      },
    };
    return mount(<Preview generator={generator} />, {context});
  };

  it('is a DragLayer-decorated Preview', () => {
    const component = createComponent();
    expect(component.name()).to.equal('DragLayer(Preview)');
    expect(component.node).to.be.an.instanceof(Preview);
  });

  it('fails with no generator', () => {
    expect(() => { createComponent({generator: null}); }).to.throw(Error, 'Warning: Failed prop type: The prop `generator` is marked as required in `Preview`, but its value is `null`.');
  });

  it('no preview and no DnD', () => {
    const component = createComponent();
    expect(component.html()).to.be.null;
  });

  it('no preview and DnD', () => {
    const component = createComponent({isDragging: true, currentOffset: {x: 1000, y: 2000}});
    expect(component.html()).to.be.null;
  });

  it('preview and no DnD', () => {
    const component = createComponent({preview: true});
    expect(component.html()).to.be.null;
  });

  it('preview and DnD', () => {
    const generator = sinon.stub();
    generator.callsFake((type, item, style) => {
      return <div style={style}>{item.coucou}: {type}</div>;
    });
    const component = createComponent({
      item: {coucou: 'dauphin'},
      itemType: 'toto',
      preview: true,
      isDragging: true, currentOffset: {x: 1000, y: 2000},
      generator: generator
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
