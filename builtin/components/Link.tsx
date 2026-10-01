import type { Element } from 'solid-js'
import '../components-styles/Link.sass'

interface Props {
  to: string
  children?: Element
  newtab?: boolean
}

export default (props: Props) => {
  return (
    <>
      <a class='dasig-link' href={props.to} aria-label={`Go to ${props.to}`} target={props.newtab ? '_blank' : ''}>
        {props.children}
      </a>
    </>
  )
}
