import {type MultiBackendOptions, PointerTransition, TouchTransition} from 'dnd-multi-backend'
import {HTML5Backend} from 'react-dnd-html5-backend'
import {TouchBackend} from 'react-dnd-touch-backend'

export const HTML5toTouch: MultiBackendOptions = {
  backends: [
    {
      backend: HTML5Backend,
      id: 'html5',
      transition: PointerTransition,
    },
    {
      backend: TouchBackend,
      id: 'touch',
      options: {enableMouseEvents: true},
      preview: true,
      transition: TouchTransition,
    },
  ],
}
