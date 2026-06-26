import type {JSX} from 'react'
import {Context, Preview, type PreviewState} from '../../../src/index.js'
import type {DragContent} from '../../shared.js'
import {type GenPreviewLiteProps, WithChildComponent, WithChildFunction, WithChildFunctionContext, WithPropFunction} from './common.js'

export const Components = ({title, col}: GenPreviewLiteProps): JSX.Element => {
  return (
    <>
      <Preview generator={WithPropFunction({col, title})} />

      <Preview>{WithChildFunction({col, title})}</Preview>

      <Preview>
        <WithChildComponent col={col} title={title} />
      </Preview>

      <Preview>
        <Context.Consumer>
          {(props) => {
            if (!props) {
              throw new Error('missing preview context')
            }
            return WithChildFunctionContext({col, title})(props as PreviewState<DragContent, HTMLDivElement>)
          }}
        </Context.Consumer>
      </Preview>
    </>
  )
}
