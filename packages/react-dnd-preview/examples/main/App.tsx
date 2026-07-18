import {type JSX, StrictMode} from 'react'
import {DndProvider} from 'react-dnd'
import {TouchBackend} from 'react-dnd-touch-backend'
import {Draggable} from '../shared.tsx'
import {Components} from './methods/Components.tsx'
import {Hooks} from './methods/Hooks.tsx'

export const App = (): JSX.Element => (
  <StrictMode>
    <DndProvider backend={TouchBackend} options={{enableMouseEvents: true}}>
      <Draggable />
      <Components col={0} title="Components" />
      <Hooks col={1} title="Hooks" />
    </DndProvider>
  </StrictMode>
)
