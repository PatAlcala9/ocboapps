import { Match, Show, Switch } from "solid-js";
import "../components-styles/Button.sass";

interface Props {
  label?: string;
  to?: string;
  onClick?: () => void;
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
  submit?: boolean;
  newtab?: boolean;
}

const getBorderRadius = (edge: Props["edges"]) => {
  switch (edge) {
    case "curved":
      return "border-radius: 6px";
    case "rounded":
      return "border-radius: 32px";
    case "flat":
      return "border-radius: 0";
    default:
      return "border-radius: 0";
  }
};

export default (props: Props) => {
  const borderRadius = getBorderRadius(props.edges);

  return (
    <>
      <Show when={props.to}>
        <Switch>
          <Match when={props.design}>
            <a
              href={props.to}
              aria-label={props.label}
              rel="noopener"
              target={props.newtab ? "_blank" : "_self"}
              data-astro-prefetch
            >
              <button type="button" class={props.design} style={borderRadius}>
                {props.label || "Click Me!"}
              </button>
            </a>
          </Match>
          <Match when={!props.design}>
            <a
              href={props.to}
              aria-label={props.label}
              rel="noopener"
              target={props.newtab ? "_blank" : "_self"}
              data-astro-prefetch
            >
              <button type="button" class="button" style={borderRadius}>
                {props.label || "Click Me!"}
              </button>
            </a>
          </Match>
        </Switch>
      </Show>

      <Show when={!props.to}>
        <Switch>
          <Match when={props.design}>
            <Show when={props.submit}>
              <button class={props.design} type="submit" style={borderRadius}>
                {props.label || "Click Me!"}
              </button>
            </Show>

            <Show when={!props.submit}>
              <button
                type="button"
                class={props.design}
                onClick={props.onClick}
                style={borderRadius}
              >
                {props.label || "Click Me!"}
              </button>
            </Show>
          </Match>
          <Match when={!props.design}>
            <Show when={props.submit}>
              <button class="button" type="submit" style={borderRadius}>
                {props.label || "Click Me!"}
              </button>
            </Show>

            <Show when={!props.submit}>
              <button
                type="button"
                class="button"
                onClick={props.onClick}
                style={borderRadius}
              >
                {props.label || "Click Me!"}
              </button>
            </Show>
          </Match>
        </Switch>
      </Show>
    </>
  );
};
