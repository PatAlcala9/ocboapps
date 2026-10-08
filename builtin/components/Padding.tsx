import type { Element } from 'solid-js'
// import '../components-styles/Padding.sass'

interface Props {
  left?: number
  right?: number
  top?: number
  bottom?: number
  children: Element
  // fit?: boolean
}

export default (props: Props) => {
  return (
    <div class='dasig-padding' style={`padding: ${props.top || 0}rem ${props.right || 0}rem ${props.bottom || 0}rem ${props.left || 0}rem; width: ${props.left || props.right ? 'max-content' : 'inherit'}`}>
      {props.children}
    </div>
  )
}
