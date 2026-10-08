import { type Setter, Show } from 'solid-js'
import Column from './Column'
import '../components-styles/Input.sass'

interface Props {
  label?: string
  value: string
  onChange: Setter<string>
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number'
  width?: string
  size?: number
  center?: boolean
  list?: string
  onKeyDown?: (event: KeyboardEvent) => void
  font?: string
  fontWeight?: number
}

export default (props: Props) => {
  return (
    <>
      <section class='dasig-input'>
        <Column>
          <Show when={props.label}>
            <span class='dasig-input__label'>{props.label}</span>
          </Show>

          <input
            class='dasig-input__input'
            value={props.value}
            type={props.type}
            placeholder={props.placeholder}
            onInput={(event) => props.onChange(event.currentTarget.value)}
            onKeyDown={props.onKeyDown}
            style={`width: ${props.width ? props.width : 'auto'}; font-size: ${props.size ? props.size : '1'}rem; text-align: ${props.center ? 'center' : 'left'}; font-family: ${props.font ? props.font : 'inherit'}; font-weight: ${props.fontWeight ? props.fontWeight : 400};`}
            list={props.list}
          />
        </Column>
      </section>
    </>
  )
}
