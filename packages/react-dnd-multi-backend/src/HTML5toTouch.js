import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';

import { TouchTransition } from 'dnd-multi-backend';

export default {
  backends: [
    {
      backend: HTML5Backend,
    },
    {
      backend: TouchBackend({enableMouseEvents: true}),
      preview: true,
      transition: TouchTransition,
    },
  ],
};
