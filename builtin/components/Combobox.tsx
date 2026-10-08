import { FaSolidAngleDown } from 'solid-icons/fa'
import { AiOutlineCheck } from 'solid-icons/ai'
import { Combobox } from '@kobalte/core/combobox'
import '../components-styles/Combobox.sass'

interface Props {
  options: any[]
  placeholder: string
  value: string
  onChange: (value: string | null) => void
  width?: string
}

export default (props: Props) => {
  return (
    <>
      <Combobox
        options={props.options}
        defaultFilter='startsWith'
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        itemComponent={(props: any) => (
          <Combobox.Item item={props.item} class='dasig-combobox__item'>
            <Combobox.ItemLabel>{props.item.textValue}</Combobox.ItemLabel>
            <Combobox.ItemIndicator class='dasig-combobox__item-indicator'>
              <AiOutlineCheck />
            </Combobox.ItemIndicator>
          </Combobox.Item>
        )}
      >
        <Combobox.Control class='dasig-combobox__control' aria-label='Assessors' style={`width: ${props.width || '500px'}`}>
          <Combobox.Input class='dasig-combobox__input' />
          <Combobox.Trigger class='dasig-combobox__trigger'>
            <Combobox.Icon class='dasig-combobox__icon'>
              <FaSolidAngleDown />
            </Combobox.Icon>
          </Combobox.Trigger>
        </Combobox.Control>
        <Combobox.Portal>
          <Combobox.Content class='dasig-combobox__content'>
            <Combobox.Listbox class='dasig-combobox__listbox' />
          </Combobox.Content>
        </Combobox.Portal>
      </Combobox>
    </>
  )
}
