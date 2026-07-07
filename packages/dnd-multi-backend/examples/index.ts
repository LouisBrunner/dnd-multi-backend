import {createDragDropManager} from 'dnd-core'
import {MouseTransition, MultiBackend, TouchTransition} from '../src/index.js'
import {HTML5Backend, TouchBackend} from './Backends.js'
import {DragSource, DropTarget} from './DnD.js'

// Setup pipeline
const pipeline = {
  backends: [
    {
      backend: HTML5Backend,
      id: 'html5',
      transition: MouseTransition,
    },
    {
      backend: TouchBackend,
      id: 'touch',
      preview: true,
      transition: TouchTransition,
    },
  ],
}

// Create manager
const manager = createDragDropManager(MultiBackend, {}, pipeline)
const registry = manager.getRegistry()

// Create logic
const src = new DragSource({color: 'red', text: 'Source'})
const dst = new DropTarget<{color: string}>({
  color: 'orange',
  onDrop: (item) => {
    console.log(`Dropped: ${item.color}`)
  },
  text: 'Target',
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
