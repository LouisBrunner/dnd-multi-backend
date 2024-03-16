import React from 'react'
import { Preview, Context, PreviewState } from '../../../src'
import {DragContent} from '../../shared'
import { WithPropFunction, WithChildFunction, WithChildComponent, WithChildFunctionContext, GenPreviewLiteProps } from './common'

export const Components = ({title, col}: GenPreviewLiteProps): JSX.Element => {
  return (
    <>
      <Preview generator={WithPropFunction({title, col})} />

      <Preview>
        {WithChildFunction({title, col})}
      </Preview>

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
