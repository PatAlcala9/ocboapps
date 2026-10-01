import '../components-styles/Box.sass'
import { type Element, createMemo } from 'solid-js'

interface Props {
  thickness: number
  color?: string
  children: Element
  curved?: boolean
  padding?: string
  background?: string
  width?: string
  class?: string
  pointer?: boolean
}

export default (props: Props) => {
  const boxClass = createMemo(() => (props.curved ? 'curvedbox' : 'box'))

  return (
    <section
      class={props.class ? `dasig-${boxClass()} ${props.class}` : `dasig-${boxClass()}`}
      style={`border: ${props.thickness}px solid ${props.color || 'white'}; padding: ${props.padding || 0}; background-color: ${props.background || 'none'}; width: ${props.width || 'inherit'}; cursor: ${props.pointer ? 'pointer' : 'inherit'}`}
    >
      {props.children}
    </section>
  )
}
