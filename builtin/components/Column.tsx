import type { Element } from 'solid-js'
import '../components-styles/Column.sass'

interface Props {
  children: Element
  content?: 'top' | 'center' | 'bottom' | 'split' | 'spaced'
  alignment?: 'left' | 'center' | 'right'
  gap?: number
  padding?: string
  width?: string
}

export default (props: Props) => {
  const getAlignment = () => {
    if (props.content === undefined || props.alignment === undefined) return 'top'
    if (props.content === 'top' && props.alignment === 'left') return 'top-left'
    if (props.content === 'top' && props.alignment === 'right') return 'top-right'
    if (props.content === 'top' && props.alignment === 'center') return 'top'
    if (props.content === 'center' && props.alignment === 'left') return 'center-left'
    if (props.content === 'center' && props.alignment === 'right') return 'center-right'
    if (props.content === 'center' && props.alignment === 'center') return 'center'
    if (props.content === 'bottom' && props.alignment === 'left') return 'bottom-left'
    if (props.content === 'bottom' && props.alignment === 'right') return 'bottom-right'
    if (props.content === 'bottom' && props.alignment === 'center') return 'bottom'
    if (props.content === 'split' && props.alignment === 'left') return 'split-left'
    if (props.content === 'split' && props.alignment === 'right') return 'split-right'
    if (props.content === 'split' && props.alignment === 'center') return 'split'
    if (props.content === 'spaced' && props.alignment === 'left') return 'spaced-left'
    if (props.content === 'spaced' && props.alignment === 'right') return 'spaced-right'
    if (props.content === 'spaced' && props.alignment === 'center') return 'spaced'
  }

  return (
    <>
      <section class={`dasig-column-${getAlignment()}`} style={`gap: ${props.gap}rem; padding: ${props.padding || 0}; width: ${props.width || 'auto'}`}>
        {props.children}
      </section>
    </>
  )
}
