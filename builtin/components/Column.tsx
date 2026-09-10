import type { Element } from "solid-js";
import "../components-styles/Column.sass";

interface Props {
  children: Element;
  content?: "top" | "center" | "bottom" | "split" | "spaced";
  gap?: number;
  padding?: string;
  width?: string;
}

export default (props: Props) => {
  const gap = `gap: ${props.gap}rem; padding: ${props.padding || 0}; width: ${props.width || "auto"}`

  return (
    <>
      <section
        class={`dasig-column-${props.content || "center"}`}
        style={gap}
      >
        {props.children}
      </section>
    </>
  );
};
