import HTML5Backend from 'react-dnd-html5-backend-cjs';
import TouchBackend from 'react-dnd-touch-backend-cjs';

import { TouchTransition, MouseTransition } from 'dnd-multi-backend';

export default {
  backends: [
    {
      backend: HTML5Backend,
      transition: MouseTransition,
    },
    {
      backend: TouchBackend,
      options: {enableMouseEvents: true},
      preview: true,
      transition: TouchTransition,
    },
  ],
};
