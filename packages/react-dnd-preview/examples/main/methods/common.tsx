import {type JSX, useContext} from 'react'
import {Context, type PreviewState, type usePreviewStateContent} from '../../../src/index.ts'
import {type DragContent, Shape} from '../../shared.tsx'

export type PreviewProps = usePreviewStateContent<DragContent, HTMLDivElement>

export type GenPreviewProps = {
  row: number
  col: number
  title: string
  method: string
}

export const generatePreview = ({itemType, item, style, ref}: PreviewProps, {row, col, title, method}: GenPreviewProps): JSX.Element => (
  <Shape
    color={item.color}
    ref={ref}
    size={50}
    style={{
      ...style,
      left: `${col * 100}px`,
      top: `${row * 60}px`,
      whiteSpace: 'nowrap',
    }}
  >
    {title}
    <br />
    Generated {itemType?.toString()}
    <br />
    {method}
  </Shape>
)

export type WithPreviewState = (props: PreviewProps) => JSX.Element

export type GenPreviewLiteProps = Pick<GenPreviewProps, 'col' | 'title'>

export const WithPropFunction =
  ({col, title}: GenPreviewLiteProps): WithPreviewState =>
  (props) =>
    generatePreview(props, {col, method: 'with prop function', row: 0, title})
export const WithChildFunction =
  ({col, title}: GenPreviewLiteProps): WithPreviewState =>
  (props) =>
    generatePreview(props, {col, method: 'with child function', row: 1, title})

export const WithChildComponent = ({col, title}: GenPreviewLiteProps): JSX.Element => {
  const props = useContext(Context)
  if (!props) {
    throw new Error('missing preview context')
  }
  return generatePreview(props as PreviewState<DragContent, HTMLDivElement>, {col, method: 'with child component (using context)', row: 2, title})
}

export const WithChildFunctionContext =
  ({col, title}: GenPreviewLiteProps): WithPreviewState =>
  (props) =>
    generatePreview(props, {col, method: 'with child function (using context)', row: 3, title})
