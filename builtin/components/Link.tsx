import { type Element, Show } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import '../components-styles/Link.sass'

interface Props {
  to: string
  children?: Element
  newtab?: boolean
  replace?: boolean
}

export default (props: Props) => {
  const navigate = useNavigate()

  const goto = () => {
    navigate(props.to, { replace: true })
  }

  return (
    <>
      <Show when={props.replace}>
        <a class='dasig-link' aria-label={`Go to ${props.to}`} onClick={goto} href={props.to}>
          {props.children}
        </a>
      </Show>
      <Show when={!props.replace}>
        <a class='dasig-link' href={props.to} aria-label={`Go to ${props.to}`} target={props.newtab ? '_blank' : ''}>
          {props.children}
        </a>
      </Show>
    </>
  )
}
