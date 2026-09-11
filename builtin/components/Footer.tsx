import "../components-styles/Footer.sass"
import type { Element } from 'solid-js'

interface Props {
  children: Element
  margin?: number
}

export default (props: Props) => {
  return (
    <>
      <footer class="dasig-footer" style={`margin: ${(props.margin) ? `${props.margin}rem 0` : '0'}`}>
        <small>{props.children}</small>
      </footer>
    </>
  )
}
