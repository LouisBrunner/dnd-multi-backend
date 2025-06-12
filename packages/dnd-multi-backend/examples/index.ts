import {createDragDropManager} from 'dnd-core'
import {MouseTransition, MultiBackend, TouchTransition} from '../src/index.js'
import {HTML5Backend, TouchBackend} from './Backends.js'
import {DragSource, DropTarget} from './DnD.js'

// Setup pipeline
const pipeline = {
  backends: [
    {
      id: 'html5',
      backend: HTML5Backend,
      transition: MouseTransition,
    },
    {
      id: 'touch',
      backend: TouchBackend,
      preview: true,
      transition: TouchTransition,
    },
  ],
}

// Create manager
const manager = createDragDropManager(MultiBackend, {}, pipeline)
const registry = manager.getRegistry()

// Create logic
const src = new DragSource({text: 'Source', color: 'red'})
const dst = new DropTarget<{color: string}>({
  text: 'Target',
  color: 'orange',
  onDrop: (item) => {
    console.log(`Dropped: ${item.color}`)
  },
})

const Item = 'item'

const srcId = registry.addSource(Item, src)
manager.getBackend().connectDragSource(srcId, src.node())

const dstId = registry.addTarget(Item, dst)
manager.getBackend().connectDropTarget(dstId, dst.node())

// Link to the DOM
document.body.appendChild(src.node())
document.body.appendChild(dst.node())
document.getElementById('placeholder')?.remove()
