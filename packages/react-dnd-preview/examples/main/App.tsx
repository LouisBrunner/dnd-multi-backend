import { DndProvider } from 'react-dnd'
import { Components } from './methods/Components'
import { Hooks } from './methods/Hooks'
import { TouchBackend } from 'react-dnd-touch-backend'
import { Draggable } from '../shared'
import { StrictMode } from 'react'

export const App = (): JSX.Element => {
  return (
    <StrictMode>
      <DndProvider backend={TouchBackend} options={{enableMouseEvents: true}}>
        <Draggable />
        <Components title="Components" col={0} />
        <Hooks title="Hooks" col={1} />
      </DndProvider>
    </StrictMode>
  )
}
