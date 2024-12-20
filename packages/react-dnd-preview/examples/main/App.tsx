import {type JSX, StrictMode} from 'react'
import {DndProvider} from 'react-dnd'
import {TouchBackend} from 'react-dnd-touch-backend'
import {Draggable} from '../shared'
import {Components} from './methods/Components'
import {Hooks} from './methods/Hooks'

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
