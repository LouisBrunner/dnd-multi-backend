import {Context, Preview, type PreviewState} from '../../../src'
import type {DragContent} from '../../shared'
import {type GenPreviewLiteProps, WithChildComponent, WithChildFunction, WithChildFunctionContext, WithPropFunction} from './common'

import type {JSX} from 'react'

export const Components = ({title, col}: GenPreviewLiteProps): JSX.Element => {
  return (
    <>
      <Preview generator={WithPropFunction({title, col})} />

      <Preview>{WithChildFunction({title, col})}</Preview>

      <Preview>
        <WithChildComponent title={title} col={col} />
      </Preview>

      <Preview>
        <Context.Consumer>
          {(props) => {
            if (!props) {
              throw new Error('missing preview context')
            }
            return WithChildFunctionContext({title, col})(props as PreviewState<DragContent, HTMLDivElement>)
          }}
        </Context.Consumer>
      </Preview>
    </>
  )
}
