import '../components-styles/Modal.sass'
import type { Element } from 'solid-js'
import { Show } from 'solid-js'

interface Props {
  children: Element
  background?: string
  color?: string
  border?: string
  opacity?: number
  trigger: boolean
  width?: string
  animation?: 'bounce' | 'slide-from-top'
}

export default (props: Props) => {
  return (
    <>
      <Show when={props.trigger}>
        <div class='dasig-modal'>
          <Show when={props.border}>
            <div class={`dasig-modal__content ${props.animation ? props.animation : 'no-animation'}`} style={`background-color: ${props.background}; color: ${props.color}; border: 2px solid ${props.border}; opacity: ${props.opacity || 1}; width: ${props.width || 'auto'}`}>
              {props.children}
            </div>
          </Show>

          <Show when={!props.border}>
            <div class={`dasig-modal__content ${props.animation ? props.animation : 'no-animation'}`} style={`background-color: ${props.background}; color: ${props.color}; opacity: ${props.opacity || 1}; box-shadow: 5px 4px 6px rgba(0, 0, 0, 0.5); width: ${props.width || 'auto'}`}>
              {props.children}
            </div>
          </Show>
        </div>
      </Show>
    </>
  )
}
