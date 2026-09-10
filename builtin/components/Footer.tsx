import "../components-styles/Footer.sass"
import type { Element } from 'solid-js'

interface Props {
  children: Element
}

export default (props: Props) => {
  return (
    <>
      <footer class="dasig-footer">
        <small>{props.children}</small>
      </footer>
    </>
  )
}
