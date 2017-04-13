# React DnD Multi Backend [![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![dependencies Status][deps-image]][deps-url] [![devDependencies Status][deps-dev-image]][deps-dev-url]

[Try it here!](https://louisbrunner.github.io/react-dnd-multi-backend/examples)

This project is a Drag'n'Drop backend compatible with [React DnD](https://github.com/gaearon/react-dnd).
It enables your application to use different backends depending on the situation.
You can either generate your own backend pipeline or use the default one (`HTML5toTouch`).

[HTML5toTouch](src/lib/HTML5toTouch.js) starts by using the [React DnD HTML5 Backend](https://github.com/gaearon/react-dnd-html5-backend), but switches to the [React DnD Touch Backend](https://github.com/yahoo/react-dnd-touch-backend) if a touch event is triggered.
You application can smoothly use the nice HTML5 compatible backend and fallback on the Touch one on mobile devices!

Moreover, because some backends don't support preview, a `Preview` component has been added to make it easier to mock the Drag'n'Drop "ghost".


## Installation

### Node Installation

```sh
npm install react-dnd-multi-backend
```

You can then `MultiBackend = require('react-dnd-multi-backend')` or `import MultiBackend from 'react-dnd-multi-backend'`.
To get the `HTML5toTouch` pipeline, just require/import `react-dnd-multi-backend/lib/HTML5toTouch`.

### Browser Installation

Use the minified UMD build in the `dist` folder: [here](dist/ReactDnDMultiBackend.min.js).
It exports a global `window.ReactDnDMultiBackend` when imported as a `<script>` tag.
This file also includes the `HTML5toTouch` pipeline.


## Usage

Every code snippet will be presented in 3 different styles: Node.js `require`, Node.js `import` and Browser Javascript (with required HTML `<script>`s).

### Backend

You can plug this backend in the `DragDropContext` the same way you do for any backend (e.g. `ReactDnDHTML5Backend`), you can see [the docs](http://gaearon.github.io/react-dnd/docs-html5-backend.html) for more information.

You must pass a 'pipeline' to use as argument. This package includes `HTML5toTouch`, but you can write your own.

 - *require*:
```js
  var ReactDnD = require('react-dnd');
  var MultiBackend = require('react-dnd-multi-backend').default;
  var HTML5toTouch = require('react-dnd-multi-backend/lib/HTML5toTouch').default; // or any other pipeline
  ...
  module.exports = ReactDnD.DragDropContext(MultiBackend(HTML5toTouch))(App);
```

 - *import*:
```js
  import { DragDropContext } from 'react-dnd';
  import MultiBackend from 'react-dnd-multi-backend';
  import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch'; // or any other pipeline
  ...
  export default DragDropContext(MultiBackend(HTML5toTouch))(App);
```

 - *browser*:
```js
  <script src="ReactDnDMultiBackend.min.js"></script>
  ...
  var AppDnD = ReactDnD.DragDropContext(ReactDnDMultiBackend)(App);
```

### Create a custom pipeline

Creating a pipeline is fairly easy. A pipeline is composed of a list of backends, the first one will be the default one, loaded at the start of the **MultiBackend**, the order of the rest isn't important.

Each backend entry must specify one property: `backend`, containing the class of the Backend to instantiate.
But other options are available: `preview` (a boolean indicating if `Preview` components should be shown) and `transition` (an object returned by the `createTransition` function).

Here is the `HTML5toTouch` pipeline code as an example:
```js
...
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import MultiBackend, { TouchTransition } from 'react-dnd-multi-backend';
...
const HTML5toTouch = {
  backends: [
    {
      backend: HTML5Backend
    },
    {
      backend: TouchBackend({enableMouseEvents: true}), // Note that you can call your backends with options
      preview: true,
      transition: TouchTransition
    }
  ]
};
...
export default DragDropContext(MultiBackend(HTML5toTouch))(App);
```

`TouchTransition` is a predefined transition that you can use in your own pipelines, it is triggered when a *touchstart* is received. Transitions rea really easy to write, here is an example:

```js
import { createTransition } from 'react-dnd-multi-backend';

const TouchTransition = createTransition('touchstart', (event) => {
  return event.touches != null;
});
```

You can also import `HTML5DragTransition` which works the same way, but detects when a HTML5 DragEvent is received.


### Preview

Concerning the `Preview` class, it is created using the following snippet:

 - *require*:
```js
  var MultiBackend = require('react-dnd-multi-backend').default;
  ...
  <MultiBackend.Preview generator={this.generatePreview} />
```

 - *import*:
```js
  import MultiBackend, { Preview } from 'react-dnd-multi-backend';
  ...
  <Preview generator={this.generatePreview} />
```

 - *browser*:
```js
  <script src="ReactDnDMultiBackend.min.js"></script>
  ...
  <ReactDnDMultiBackend.Preview generator={this.generatePreview} />
```

You must pass a function as the `generator` prop which takes 3 arguments:

 - `type`: the type of the item (`monitor.getItemType()`)
 - `item`: the item (`monitor.getItem()`)
 - `style`: an object representing the style (used for positioning), it should be passed to the `style` property of your preview component

Note that this component will only be showed while using a backend flagged with `preview: true` (see [Create a custom pipeline](#create-a-custom-pipeline)) which is the case for the Touch backend in the default `HTML5toTouch` pipeline.


### Examples

You can see an example [here](src/examples/) (Node.js style with `import`s).


## Thanks

Thanks to the [React DnD HTML5 Backend](https://github.com/gaearon/react-dnd-html5-backend) maintainers which obviously greatly inspired this project.


## License

MIT, Copyright (c) 2016-2017 Louis Brunner



[npm-image]: https://img.shields.io/npm/v/react-dnd-multi-backend.svg
[npm-url]: https://npmjs.org/package/react-dnd-multi-backend
[travis-image]: https://travis-ci.org/LouisBrunner/react-dnd-multi-backend.svg?branch=master
[travis-url]: https://travis-ci.org/LouisBrunner/react-dnd-multi-backend
[coveralls-image]: https://coveralls.io/repos/github/LouisBrunner/react-dnd-multi-backend/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/LouisBrunner/react-dnd-multi-backend?branch=master
[deps-image]: https://david-dm.org/louisbrunner/react-dnd-multi-backend/status.svg
[deps-url]: https://david-dm.org/louisbrunner/react-dnd-multi-backend
[deps-dev-image]: https://david-dm.org/louisbrunner/react-dnd-multi-backend/dev-status.svg
[deps-dev-url]: https://david-dm.org/louisbrunner/react-dnd-multi-backend?type=dev
