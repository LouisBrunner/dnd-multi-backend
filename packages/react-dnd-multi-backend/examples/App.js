import React, { PureComponent } from 'react';
import { DragDropContext } from 'react-dnd';
import MultiBackend, { Preview } from '../src/index.js';
import HTML5toTouch from '../src/HTML5toTouch.js';
import Card from './Card';
import Basket from './Basket';
import objectAssign from 'object-assign';

class App extends PureComponent {
  generatePreview(type, item, style) {
    objectAssign(style, {backgroundColor: item.color, width: '50px', height: '50px'});
    return <div style={style}>Generated</div>;
  }

  render() {
    return (
      <div>
        <Card color="#cc2211" />
        <Card color="#22cc11" />
        <Card color="#2211cc" />
        <Basket />
        <Preview generator={this.generatePreview} />
        <div id="console" />
      </div>
    );
  }
}

export default DragDropContext(MultiBackend(HTML5toTouch))(App);
