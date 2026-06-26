import {type JSX, StrictMode} from 'react'
import {DndProvider} from 'react-dnd'
import {TouchBackend} from 'react-dnd-touch-backend'
import {Draggable} from '../shared.js'
import {Components} from './methods/Components.js'
import {Hooks} from './methods/Hooks.js'

export const App = (): JSX.Element => {
  return (
    <StrictMode>
      <DndProvider backend={TouchBackend} options={{enableMouseEvents: true}}>
        <Draggable />
        <Components col={0} title="Components" />
        <Hooks col={1} title="Hooks" />
      </DndProvider>
    </StrictMode>
  )
}
