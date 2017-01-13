import React from 'react';
import { DragDropContext } from 'react-dnd';
import MultiBackend, { Preview } from '../lib/index.js';
import Card from './Card';
const PropTypes = React.PropTypes;

const App = React.createClass({
  contextTypes: {dragDropManager: PropTypes.object},

  getInitialState: function() {
    return {backend: 0};
  },

  componentWillMount: function () {
    this.context.dragDropManager.getBackend().mountComponent(this);
  },

  componentWillUnmount: function () {
    this.context.dragDropManager.getBackend().unmountComponent();
  },

  switchBackend: function (backend) {
    this.setState({backend: backend});
  },


  generatePreview: function (type, item, style) {
    Object.assign(style, {backgroundColor: item.color, width: '50px', height: '50px'});
    return <div style={style}>Generated</div>;
  },

  render: function () {
    return  <div>
              <Card key={"backend_" + this.state.backend} color="#cc2211" />
              <Preview generator={this.generatePreview} />
            </div>;
  }
});

module.exports = DragDropContext(MultiBackend)(App);
