import "../components-styles/Combobox.sass";
import { Combobox } from "@kobalte/core/combobox";
import { FaSolidAngleDown } from "solid-icons/fa";
import { AiOutlineCheck } from "solid-icons/ai";

interface Props {
  options: any[];
  placeholder: string;
  value: string;
  onChange: (value: string | null) => void;
  width?: string;
}

export default (props: Props) => {
  return (
    <>
      <Combobox
        options={props.options}
        defaultFilter="startsWith"
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        itemComponent={(props: any) => (
          <Combobox.Item item={props.item} class="combobox__item">
            <Combobox.ItemLabel>{props.item.textValue}</Combobox.ItemLabel>
            <Combobox.ItemIndicator class="combobox__item-indicator">
              <AiOutlineCheck />
            </Combobox.ItemIndicator>
          </Combobox.Item>
        )}
      >
        <Combobox.Control
          class="combobox__control"
          aria-label="Assessors"
          style={`width: ${props.width || "500px"}`}
        >
          <Combobox.Input class="combobox__input" />
          <Combobox.Trigger class="combobox__trigger">
            <Combobox.Icon class="combobox__icon">
              <FaSolidAngleDown />
            </Combobox.Icon>
          </Combobox.Trigger>
        </Combobox.Control>
        <Combobox.Portal>
          <Combobox.Content class="combobox__content">
            <Combobox.Listbox class="combobox__listbox" />
          </Combobox.Content>
        </Combobox.Portal>
      </Combobox>
    </>
  );
};
