import '../components-styles/Row.sass'
import { type Element, Show } from 'solid-js'

interface Props {
  children: Element
  content?: 'left' | 'center' | 'right' | 'split' | 'spaced' | 'even'
  gap?: number
  padding?: string
}

export default (props: Props) => {
  return (
    <>
      <Show when={props.gap}>
        <section class={`dasig-row-${props.content || 'center'}`} style={`gap: ${props.gap || 0}rem; padding: ${props.padding || 0}`}>
          {props.children}
        </section>
      </Show>

      <Show when={!props.gap}>
        <section class={`dasig-row-${props.content || 'center'}`}>{props.children}</section>
      </Show>
    </>
  )
}
