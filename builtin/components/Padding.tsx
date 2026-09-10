import type { Element } from "solid-js";
import "../components-styles/Padding.sass";

interface Props {
  left: number;
  right: number;
  top: number;
  bottom: number;
  children: Element;
}

export default (props: Props) => {
  return (
    <div class="dasig-padding" style={{ padding: `${props.top || 0}rem ${props.right}rem ${props.bottom || 0}rem ${props.left}rem` }}>
      {props.children}
    </div>
  );
};
