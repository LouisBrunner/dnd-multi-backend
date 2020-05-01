# React DnD Multi Backend [![NPM Version][npm-image]][npm-url] [![dependencies Status][deps-image]][deps-url] [![devDependencies Status][deps-dev-image]][deps-dev-url]

[Try it here!](https://louisbrunner.github.io/dnd-multi-backend/examples/react-dnd-multi-backend.html)

This project is a Drag'n'Drop backend compatible with [React DnD](https://github.com/react-dnd/react-dnd).
It enables your application to use different DnD backends depending on the situation.
You can either generate your own backend pipeline or use the default one (`HTML5toTouch`).

[HTML5toTouch](src/HTML5toTouch.js) starts by using the [React DnD HTML5 Backend](https://react-dnd.github.io/react-dnd/docs/backends/html5), but switches to the [React DnD Touch Backend](https://react-dnd.github.io/react-dnd/docs/backends/touch) if a touch event is triggered.
You application can smoothly use the nice HTML5 compatible backend and fallback on the Touch one on mobile devices!

Moreover, because some backends don't support preview, a `Preview` component has been added to make it easier to mock the Drag'n'Drop "ghost".

See the [migration section](#migrating) for instructions when switching from `2.x.x`, `3.x.x`, `4.x.x` or `5.0.x`.


## Installation

### NPM Installation

```sh
npm install react-dnd-multi-backend
```

You can then `MultiBackend = require('react-dnd-multi-backend')` or `import MultiBackend from 'react-dnd-multi-backend'`.
To get the `HTML5toTouch` pipeline, just require/import `react-dnd-multi-backend/dist/BUILD_TYPE/HTML5toTouch` (where `BUILD_TYPE` is either `cjs` for CommonJS or `esm` for ES Module).

### Browser Installation

Use the minified UMD build in the `dist` folder: https://www.jsdelivr.com/package/npm/react-dnd-multi-backend?path=dist%2Fumd.

`react-dnd-multi-backend.min.js` exports a global `window.ReactDnDMultiBackend` when imported as a `<script>` tag.

If you want to use the `HTML5toTouch` pipeline, also include `HTML5toTouch.min.js`.
It exports a global `window.HTML5toTouch` when imported as a `<script>` tag.
This file also includes the `HTML5` and `Touch` backends, so no need to include them as well.


## Usage

### DndProvider (new API)

You can use the `DndProvider` component the same way you do the one from `react-dnd` ([docs](https://react-dnd.github.io/react-dnd/docs/api/dnd-provider) for more information), at the difference that you don't need to specify `backend` as a prop, it is implied to be `MultiBackend`.

You must pass a 'pipeline' to use as argument. This package includes `HTML5toTouch`, but you can write your own.
Note that if you include this file, you will have to add `react-dnd-html5-backend` and `react-dnd-touch-backend` to your `package.json` `dependencies`.

```js
import { DndProvider } from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch'; // or any other pipeline
...
const App = () => {
  return (
    <DndProvider options={HTML5toTouch}>
      <Example />
    </DndProvider>
  );
};
```

### Backend (old API)

You can plug this backend in the `DragDropContext` the same way you do for any backend (e.g. `ReactDnDHTML5Backend`), you can see [the docs](https://react-dnd.github.io/react-dnd/docs/backends/html5) for more information.

You must pass a 'pipeline' to use as argument. This package includes `HTML5toTouch`, but you can write your own.
Note that if you include this file, you will have to add `react-dnd-html5-backend` and `react-dnd-touch-backend` to your `package.json` `dependencies`.

```js
import { DndProvider } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch'; // or any other pipeline
...
const App = () => {
  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <Example />
    </DndProvider>
  );
};
```

### Create a custom pipeline

Creating a pipeline is fairly easy. A pipeline is composed of a list of backends, the first one will be the default one, loaded at the start of the **MultiBackend**, the order of the rest isn't important.

Each backend entry must specify one property: `backend`, containing the class of the Backend to instantiate.
But other options are available:

 - `preview` (a boolean indicating if `Preview` components should be shown)
 - `transition` (an object returned by the `createTransition` function)
 - `skipDispatchOnTransition` (a boolean indicating transition events should not be dispatched to new backend, defaults to `false`. See [note below](#note-on-skipdispatchontransition) for details and use cases.)

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
const App = () => {
  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <Example />
    </DndProvider>
  );
};
```

`TouchTransition` is a predefined transition that you can use in your own pipelines, it is triggered when a *touchstart* is received. Transitions rea really easy to write, here is an example:

```js
import { createTransition } from 'react-dnd-multi-backend';

const TouchTransition = createTransition('touchstart', (event) => {
  return event.touches != null;
});
```

You can also import `HTML5DragTransition` which works the same way, but detects when a HTML5 DragEvent is received.

#### Note on `skipDispatchOnTransition`

By default, when an event triggers a transition, `dnd-multi-backend` dispatches a cloned version of the event after setting up the new backend. This allows the newly activated backend to handle the original event.

If your app code or another library has registered event listeners for the same events that are being used for transitions, this duplicate event may cause problems.

You can optionally disable this behavior per backend:

```js
const CustomHTML5toTouch = {
  backends: [
    {
      backend: HTML5Backend,
      transition: MouseTransition
      // by default, will dispatch a duplicate `mousedown` event when this backend is activated
    },
    {
      backend: TouchBackend,
      // Note that you can call your backends with options
      options: {enableMouseEvents: true},
      preview: true,
      transition: TouchTransition,
      // will not dispatch a duplicate `touchstart` event when this backend is activated
      skipDispatchOnTransition: true
    }
  ]
};
```

**WARNING:** if you enable `skipDispatchOnTransition`, the backend transition will happen as expected, but the new backend may not handle the first event!

In this example, the first `touchstart` event would trigger the `TouchBackend` to replace the `HTML5Backend`—but the user would have to start a new touch event for the `TouchBackend` to register a drag.


### Preview

The `Preview` class is usable in two different ways: function-based and context-based.
Both of them receive the same data formatted the same way, an object containing 3 properties:

 - `itemType`: the type of the item (`monitor.getItemType()`)
 - `item`: the item (`monitor.getItem()`)
 - `style`: an object representing the style (used for positioning), it should be passed to the `style` property of your preview component

Note that this component will only be showed while using a backend flagged with `preview: true` (see [Create a custom pipeline](#create-a-custom-pipeline)) which is the case for the Touch backend in the default `HTML5toTouch` pipeline.

#### Context-based

```js
  import MultiBackend, { usePreview } from 'react-dnd-multi-backend';
  ...
  const MyPreview = () => {
    const {display, itemType, item, style} = usePreview();
    if (!display) {
      return null;
    }
    // render your preview
  };
  ...
  <Preview>
    <MyPreview />
  </Preview>
```

#### Function-based

```js
  import MultiBackend, { Preview } from 'react-dnd-multi-backend';
  ...
  const generatePreview = ({itemType, item, style}) => {
    // render your preview
  };
  ...
  <Preview generator={generatePreview} />
  // or
  <Preview>{generatePreview}</Preview>
```

#### Context-based

```js
  import MultiBackend, { Preview } from 'react-dnd-multi-backend';
  ...
  const MyPreview = () => {
    const {itemType, item, style} = useContext(Preview.Component);
    // render your preview
  };
  ...
  <Preview>
    <MyPreview />
    // or
    <Preview.Context.Consumer>
      {({itemType, item, style}) => /* render your preview */}
    </Preview.Context.Consumer>
  </Preview>
```

### Examples

You can see an example [here](examples/).


## Migrating

### Migrating from 2.x.x

In 2.x.x, the pipeline was static but corresponded with the behavior of `HTML5toTouch`, so just [including and passing this pipeline as a parameter](#backend) would give you the same experience as before.

If you used the `start` option, it's a bit different.
With `start: 0` or `start: Backend.HTML5`, **MultiBackend** simply used the default pipeline, so you can also just pass `HTML5toTouch`.
With `start: 1` or `start: Backend.TOUCH`, **MultiBackend** would only use the TouchBackend, so you can replace **MultiBackend** with **TouchBackend** (however, you would lose the `Preview` component) or create a simple pipeline (see [Create a custom pipeline](#create-a-custom-pipeline)) and pass it as a parameter:
```js
var TouchOnly = { backends: [{ backend: TouchBackend, preview: true }] };
```

### Migrating from 3.1.2

Starting with `3.1.8`, the dependencies of `react-dnd-multi-backend` changed. `react`, `react-dom`, `react-dnd` become peer dependencies and you need to install them manually as `dependencies` in your project `package.json`.

Note that if you use the `HTML5toTouch` pipeline, the same is true for `react-dnd-html5-backend` and `react-dnd-touch-backend`.

### Migrating from 3.x.x

Starting with `4.0.0`, `react-dnd-multi-backend` will start using `react-dnd` (and the corresponding backends) `9.0.0` and later.

This means you need to transition from `DragDropContext(MultiBackend(HTML5toTouch))(App)` to `<DndProvider backend={MultiBackend} options={HTML5toTouch}>`.
Accordingly, the pipeline syntax changes and you should specify backend options as a separate property, e.g. `{backend: TouchBackend({enableMouseEvents: true})}` becomes `{backend: TouchBackend, options: {enableMouseEvents: true}}`.
Note that if you use the `HTML5toTouch` pipeline, the same is true for `react-dnd-html5-backend` and `react-dnd-touch-backend`.

### Migrating from 4.x.x

Starting with `5.0.0`, `react-dnd-preview` (which provides the `Preview` component) will start passing its arguments packed in one argument, an object `{itemType, item, style}`, instead of 3 different arguments (`itemType`, `item` and `style`). This means that will need to change your generator function to receive arguments correctly.

### Migrating from 5.0.x

Starting with `5.1.0`, `react-dnd-multi-backend` will export a new `DndProvider` which you can use instead of the one from `react-dnd`. You don't need to pass the `backend` prop to that component as it's implied you are using `MultiBackend`, however the major benefits is under the hood:

 - No longer relying on global values, allowing better encapsulation of the backend and previews
 - `Preview` will be mounted with `DndProvider` using a `React.createPortal`, thus you don't need to worry about mounting your `Preview` at the top of the tree for the absolute positioning to work correctly

Note that this isn't a breaking change, you can continue using the library as before.


## License

MIT, Copyright (c) 2016-2020 Louis Brunner



[npm-image]: https://img.shields.io/npm/v/react-dnd-multi-backend.svg
[npm-url]: https://npmjs.org/package/react-dnd-multi-backend
[deps-image]: https://david-dm.org/louisbrunner/react-dnd-multi-backend/status.svg
[deps-url]: https://david-dm.org/louisbrunner/react-dnd-multi-backend
[deps-dev-image]: https://david-dm.org/louisbrunner/react-dnd-multi-backend/dev-status.svg
[deps-dev-url]: https://david-dm.org/louisbrunner/react-dnd-multi-backend?type=dev
