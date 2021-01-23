# DnD Multi Backend [![NPM Version][npm-image]][npm-url] ![Build Status][ci-image] [![Coverage Status][coveralls-image]][coveralls-url]

This project is a Drag'n'Drop backend compatible with [DnD Core](https://github.com/react-dnd/react-dnd).

It enables your application to use different DnD backends depending on the situation. Different packages are available depending on your front-end framework:

  - React: [`react-dnd-multi-backend`](packages/react-dnd-multi-backend)
  - Angular: [`angular-skyhook`](https://github.com/cormacrelf/angular-skyhook) (see [documentation](https://cormacrelf.github.io/angular-skyhook/angular-skyhook-multi-backend/) for more information)
  - Any: [`dnd-multi-backend`](packages/dnd-multi-backend)

This project also contains some helpers (available standalone or included in other packages):

 - React DnD Preview: [`react-dnd-preview`](packages/react-dnd-preview) (included in `react-dnd-multi-backend`)

[Try them here!](https://louisbrunner.github.io/dnd-multi-backend/examples)


## Improvements

 - Write documentation & examples for `dnd-multi-backend`
 - Write documentation & examples for `react-dnd-preview`


## Thanks

Thanks to the [React DnD HTML5 Backend](https://github.com/react-dnd/react-dnd) maintainers which obviously greatly inspired this project.


## License

MIT, Copyright (c) 2016-2021 Louis Brunner



[npm-image]: https://img.shields.io/npm/v/dnd-multi-backend.svg
[npm-url]: https://npmjs.org/package/dnd-multi-backend
[ci-image]: https://github.com/LouisBrunner/dnd-multi-backend/workflows/Build/badge.svg
[coveralls-image]: https://coveralls.io/repos/github/LouisBrunner/dnd-multi-backend/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/LouisBrunner/dnd-multi-backend?branch=master
