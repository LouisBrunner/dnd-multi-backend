# React DnD Preview [![NPM Version][npm-image]][npm-url] [![dependencies Status][deps-image]][deps-url] [![devDependencies Status][deps-dev-image]][deps-dev-url]

[Try it here!](https://louisbrunner.github.io/dnd-multi-backend/examples/react-dnd-preview.html)

This project is a React component compatible with [React DnD](https://github.com/react-dnd/react-dnd) that can be used to emulate a Drag'n'Drop "ghost" when a Backend system doesn't have one (e.g. `react-dnd-touch-backend`).

See the [migration section](#migrating) for instructions when switching from `4.x.x`.

## Installation

```sh
npm install react-dnd-preview
```

## Usage & Example

Just include the `Preview` component close to the top component of your application (it places itself absolutely).

It is usable in two different ways: function-based and context-based.
Both of them receive the same data formatted the same way, an object containing 3 properties:

 - `itemType`: the type of the item (`monitor.getItemType()`)
 - `item`: the item (`monitor.getItem()`)
 - `style`: an object representing the style (used for positioning), it should be passed to the `style` property of your preview component

The function needs to return something that React can render (React component, `null`, etc).

See also the [examples](examples/) for more information.

### Hook-based

```js
  import { usePreview } from 'react-dnd-preview';

  const MyPreview = () => {
    const {display, itemType, item, style} = usePreview();
    if (!display) {
      return null;
    }
    return <div class="item-list__item" style={style}>{itemType}</div>;
  };

  const App = () => {
    return (
      <DndProvider backend={MyBackend}>
        <ItemList />
        <MyPreview />
      </DndProvider>
    );
  };
```

### Function-based

```js
  import Preview from 'react-dnd-preview';

  const generatePreview = ({itemType, item, style}) => {
    return <div class="item-list__item" style={style}>{itemType}</div>;
  };

  class App extends React.Component {
    ...

    render() {
      return (
        <DndProvider backend={MyBackend}>
          <ItemList />
          <Preview generator={generatePreview} />
          // or
          <Preview>{generatePreview}</Preview>
        </DndProvider>
      );
    }
  }
```

### Context-based

```js
  import Preview, { Context } from 'react-dnd-preview';

  const MyPreview = () => {
    const {itemType, item, style} = useContext(Preview.Component);
    return <div class="item-list__item" style={style}>{itemType}</div>;
  };

  const App = () => {
    return (
      <DndProvider backend={MyBackend}>
        <ItemList />
        <Preview>
          <MyPreview />
          // or
          <Context.Consumer>
            {({itemType, item, style}) => <div class="item-list__item" style={style}>{itemType}</div>}
          </Context.Consumer>
        </Preview>
      </DndProvider>
    );
  };
```


## Migrating

### Migrating from 4.x.x

Starting with `5.0.0`, `react-dnd-preview` will start passing its arguments packed in one argument, an object `{itemType, item, style}`, instead of 3 different arguments (`itemType`, `item` and `style`). This means that will need to change your generator function to receive arguments correctly.

## License

MIT, Copyright (c) 2016-2020 Louis Brunner



[npm-image]: https://img.shields.io/npm/v/react-dnd-preview.svg
[npm-url]: https://npmjs.org/package/react-dnd-preview
[deps-image]: https://david-dm.org/louisbrunner/react-dnd-preview/status.svg
[deps-url]: https://david-dm.org/louisbrunner/react-dnd-preview
[deps-dev-image]: https://david-dm.org/louisbrunner/react-dnd-preview/dev-status.svg
[deps-dev-url]: https://david-dm.org/louisbrunner/react-dnd-preview?type=dev
