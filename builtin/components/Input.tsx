import "../components-styles/Input.sass";
import { TextField } from "@kobalte/core/text-field";
import { Show } from "solid-js";
import type { Setter } from "solid-js";

interface Props {
  label?: string;
  value: string;
  onChange: Setter<string>;
  onKeyDown?: (event: KeyboardEvent) => void;
  isPassword?: boolean;
  placeholder?: string;
}

export default (props: Props) => {
  return (
    <>
      <TextField
        class="text-field"
        value={props.value}
        onChange={props.onChange}
        onKeyDown={props.onKeyDown}
      >
        <Show when={props.label}>
          <TextField.Label class="text-field__label">
            {props.label}
          </TextField.Label>
        </Show>
        <TextField.Input
          class="text-field__input"
          type={props.isPassword ? "password" : "text"}
          placeholder={props.placeholder || ""}
        />
      </TextField>
    </>
  );
};
