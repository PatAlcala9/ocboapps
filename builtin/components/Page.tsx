import { Title } from '@solidjs/meta'
import { type Element, Show } from 'solid-js'
import '../components-styles/Page.sass'

interface Props {
  children?: Element
  alignment?: 'row' | 'column'
  title: string
  font: 'roboto' | 'inter' | 'montserrat' | 'open-sans' | 'public-sans'
}

export default (props: Props) => {
  return (
    <>
      <Show when={props.alignment}>
        <main class={`dasig-page-${props.alignment} ${props.font}`}>
          <Title>{props.title}</Title>
          {props.children}
        </main>
      </Show>
      <Show when={!props.alignment}>
        <main class={`dasig-page ${props.font}`}>
          <Title>{props.title}</Title>
          {props.children}
        </main>
      </Show>
    </>
  )
}
