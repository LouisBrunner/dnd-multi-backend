import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const onMount = (app) => {
  app.getDecoratedComponentInstance().setup(app.getManager());
};

ReactDOM.render(<App ref={onMount} />, document.getElementById('root'));
