# React DnD Multi Backend [![NPM Version][npm-image]][npm-url]

[Try it here!](https://louisbrunner.github.io/react-dnd-multi-backend/examples)

This project is a Drag'n'Drop backend compatible with [React DnD](https://github.com/gaearon/react-dnd).
It enables your application to use different backends depending on the situation. The backend starts by using the [React DnD HTML5 Backend](https://github.com/gaearon/react-dnd-html5-backend), but switches to the [React DnD Touch Backend](https://github.com/yahoo/react-dnd-touch-backend) if a touch event is triggered.
You application can smoothly use the nice HTML5 compatible backend and fallback on the Touch one on mobile devices!
Moreover, because the Touch backend doesn't support preview, a `Preview` component has been added to make it easier to mock the Drag'n'Drop "ghost".

## Installation

```bash
npm install react-dnd-multi-backend@next
```

You can then use the minified UMD build in the `dist` folder.
It exports a global `window.ReactDnDMultiBackend` when imported as a `<script>` tag.
This file includes the `HTML5` and `Touch` backends, so no need to include them as well.

## Usage

You can plug this backend in the `DragDropContext` the same way you do for any backend (e.g. `ReactDnDHTML5Backend`), you can see [the docs](http://gaearon.github.io/react-dnd/docs-html5-backend.html) for more information.

You can also pass options to change the Backend behavior. Supported options are:

 - `start`: change the starting backend with `ReactDnDMultiBackend.Backend.HTML5` or `ReactDnDMultiBackend.Backend.Touch`


Concerning the `Preview` class, it is created using the following snippet:
```
  var MultiBackend = require('react-dnd-multi-backend');
  ...
  <MultiBackend.Preview generator={this.generatePreview} />
```
You must pass a function as the `generator` prop which takes 3 arguments:

 - `type`: the type of the item (`monitor.getItemType()`)
 - `item`: the item (`monitor.getItem()`)
 - `style`: an object representing the style (used for positioning), it should be passed to the `style` property of your preview component

Note that this component will only be showed while using the Touch backend.

You can see an example [here](https://github.com/LouisBrunner/react-dnd-multi-backend/blob/master/src/examples/).

## Tasks

 - Update documentation for new version (+ migration instructions)
 - Write some tests (+ coverage)
 - Use CI?
 - Make backend switching completely backend-agnostic (now still tied to TouchBackend)


## Thanks

Thanks to the [React DnD HTML5 Backend](https://github.com/gaearon/react-dnd-html5-backend) maintainers which obviously greatly inspired this project.

## License

MIT, Copyright (c) 2016-2017 Louis Brunner



[npm-image]: https://img.shields.io/npm/v/react-dnd-multi-backend.svg
[npm-url]: https://npmjs.org/package/react-dnd-multi-backend
