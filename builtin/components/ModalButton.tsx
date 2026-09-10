import "../components-styles/Modal.sass";
import { type Element, createSignal } from "solid-js";
import { Show } from "solid-js";
import Button from "./Button";

interface Props {
  children: Element;
  background?: string;
  color?: string;
  border?: string;
  opacity?: number;
  label: string;
  edges?: "curved" | "rounded" | "flat";
  design?:
    | "bu-primary"
    | "bu-link"
    | "bu-info"
    | "bu-success"
    | "bu-warning"
    | "bu-danger"
    | "bu-dark"
    | "bu-light"
    | "bu-text"
    | "bu-ghost"
    | "bo-primary"
    | "bo-secondary"
    | "bo-success"
    | "bo-danger"
    | "bo-warning"
    | "bo-info"
    | "bo-light"
    | "bo-dark"
    | "bo-link";
  width?: number;
  wide?: boolean;
  class?: string;
  function?: () => Promise<void>;
}

export default (props: Props) => {
  const [isOpen, setIsOpen] = createSignal(false);

  const openHandler = async () => {
    if (props.function) {
      await props.function();
    }
    setIsOpen(true);
  };

  const closeHandler = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Show when={!isOpen()}>
        <Button
          label={props.label}
          edges={props.edges}
          design={props.design}
          onClick={openHandler}
        />
      </Show>

      <Show when={isOpen()}>
        <div class="modal" onClick={closeHandler}>
          <Show when={props.border}>
            <div
              class="modal__content"
              style={`background-color: ${props.background}; color: ${props.color}; border: 2px solid ${props.border}; opacity: ${props.opacity || 1}`}
            >
              {props.children}
            </div>
          </Show>

          <Show when={!props.border}>
            <div
              class="modal__content"
              style={`background-color: ${props.background}; color: ${props.color}; opacity: ${props.opacity || 1}; box-shadow: 5px 4px 6px rgba(0, 0, 0, 0.5)`}
            >
              {props.children}
            </div>
          </Show>
        </div>
      </Show>
    </>
  );
};
