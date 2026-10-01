// import { Combobox } from '@kobalte/core/combobox'
// import { FaSolidAngleDown } from 'solid-icons/fa'
// import { AiOutlineCheck } from 'solid-icons/ai'
import { For, type Setter } from 'solid-js'
import '../components-styles/Combobox.sass'
import Input from './Input'

interface Props {
  options: any[]
  placeholder: string
  value: string
  onChange: Setter<string>
  // onChange: (value: string | null) => void
  width?: string
  size?: number
  center?: boolean
}

export default (props: Props) => {
  return (
    <>
      <Input type='text' list='datalist' placeholder={props.placeholder} value={props.value} onChange={props.onChange} width={props.width} size={props.size} center={props.center} />
      <datalist id='datalist' class='dasig-combobox-list'>
        <For each={props.options}>
          {(item) => (
            <option class='dasig-combobox-options' value={item}>
              {item}
            </option>
          )}
        </For>
      </datalist>
    </>
  )
}
