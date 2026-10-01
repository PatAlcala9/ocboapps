import '../components-styles/Modal.sass'
import { type Element, createSignal } from 'solid-js'
import { Show } from 'solid-js'
import Button from './Button'

interface Props {
  children: Element
  background?: string
  color?: string
  border?: string
  opacity?: number
  label: string
  corner?: 'curved' | 'rounded' | 'flat'
  design?:
    | 'bulma-primary'
    | 'bulma-link'
    | 'bulma-info'
    | 'bulma-success'
    | 'bulma-warning'
    | 'bulma-danger'
    | 'bulma-dark'
    | 'bulma-light'
    | 'bulma-text'
    | 'bulma-ghost'
    | 'bootstrap-primary'
    | 'bootstrap-secondary'
    | 'bootstrap-success'
    | 'bootstrap-danger'
    | 'bootstrap-warning'
    | 'bootstrap-info'
    | 'bootstrap-light'
    | 'bootstrap-dark'
    | 'bootstrap-link'
  width?: number
  wide?: boolean
  class?: string
  function?: () => Promise<void>
}

export default (props: Props) => {
  const [isOpen, setIsOpen] = createSignal(false)

  const openHandler = async () => {
    if (props.function) {
      await props.function()
    }
    setIsOpen(true)
  }

  const closeHandler = () => {
    setIsOpen(false)
  }

  return (
    <>
      <Show when={!isOpen()}>
        <Button label={props.label} corner={props.corner} design={props.design} onClick={openHandler} />
      </Show>

      <Show when={isOpen()}>
        <div class='modal' onClick={closeHandler}>
          <Show when={props.border}>
            <div class='modal__content' style={`background-color: ${props.background}; color: ${props.color}; border: 2px solid ${props.border}; opacity: ${props.opacity || 1}`}>
              {props.children}
            </div>
          </Show>

          <Show when={!props.border}>
            <div class='modal__content' style={`background-color: ${props.background}; color: ${props.color}; opacity: ${props.opacity || 1}; box-shadow: 5px 4px 6px rgba(0, 0, 0, 0.5)`}>
              {props.children}
            </div>
          </Show>
        </div>
      </Show>
    </>
  )
}
