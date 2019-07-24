import React, { PureComponent } from 'react';
import { DndProvider } from 'react-dnd-cjs';
import MultiBackend, { Preview } from '../src/index.js';
import HTML5toTouch from '../src/HTML5toTouch.js';
import Card from './Card';
import Basket from './Basket';
import objectAssign from 'object-assign';

export default class App extends PureComponent {
  generatePreview(type, item, style) {
    objectAssign(style, {backgroundColor: item.color, width: '50px', height: '50px'});
    return <div style={style}>Generated</div>;
  }

  render() {
    return (
      <div>
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
          <Card color="#cc2211" />
          <Card color="#22cc11" />
          <Card color="#2211cc" />
          <Basket />
          <Preview generator={this.generatePreview} />
          <div id="console" />
        </DndProvider>
      </div>
    );
  }
}
