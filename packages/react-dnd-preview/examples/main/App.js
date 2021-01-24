import React from 'react';
import { DndProvider } from 'react-dnd';
import { Components } from './methods/Components';
import { Hooks } from './methods/Hooks';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Draggable } from '../shared';

export const App = () => {
  return (
    <React.StrictMode>
      <DndProvider backend={TouchBackend} options={{enableMouseEvents: true}}>
        <Draggable />
        <Components title="Components" col={0} />
        <Hooks title="Hooks" col={1} />
      </DndProvider>
    </React.StrictMode>
  );
};
