import React, { useContext } from 'react'
import { Context, PreviewState, usePreviewStateContent } from '../../../src'
import { Shape, DragContent } from '../../shared'

export type PreviewProps = usePreviewStateContent<DragContent, HTMLDivElement>

export type GenPreviewProps = {
  row: number,
  col: number,
  title: string,
  method: string,
}

export const generatePreview = ({itemType, item, style}: PreviewProps, {row, col, title, method}: GenPreviewProps): JSX.Element => {
  return (
    <Shape color={item.color} size={50} style={{
      ...style,
      top: `${row * 60}px`,
      left: `${col * 100}px`,
      whiteSpace: 'nowrap',
    }}>
      {title}
      <br />
      Generated {itemType}
      <br />
      {method}
    </Shape>
  )
}

export type WithPreviewState = (props: PreviewProps) => JSX.Element

export type GenPreviewLiteProps = Pick<GenPreviewProps, 'col' | 'title'>

export const WithPropFunction = ({col, title}: GenPreviewLiteProps): WithPreviewState => {
  return (props) => {
    return generatePreview(props, {row: 0, col, title, method: 'with prop function'})
  }
}
export const WithChildFunction = ({col, title}: GenPreviewLiteProps): WithPreviewState => {
  return (props) => {
    return generatePreview(props, {row: 1, col, title, method: 'with child function'})
  }
}

export const WithChildComponent = ({col, title}: GenPreviewLiteProps): JSX.Element => {
  const props = useContext(Context)
  if (!props) {
    throw new Error('missing preview context')
  }
  // FIXME: any better way?
  return generatePreview(props as PreviewState<DragContent, HTMLDivElement>, {row: 2, col, title, method: 'with child component (using context)'})
}

export const WithChildFunctionContext = ({col, title}: GenPreviewLiteProps): WithPreviewState => {
  return (props) => {
    return generatePreview(props, {row: 3, col, title, method: 'with child function (using context)'})
  }
}
