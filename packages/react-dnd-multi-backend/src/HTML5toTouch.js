import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';

import { TouchTransition, MouseTransition } from 'dnd-multi-backend';

export default {
  backends: [
    {
      id: 'html5',
      backend: HTML5Backend,
      transition: MouseTransition,
    },
    {
      id: 'touch',
      backend: TouchBackend,
      options: {enableMouseEvents: true},
      preview: true,
      transition: TouchTransition,
    },
  ],
};
