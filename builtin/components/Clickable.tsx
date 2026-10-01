import type { Element } from 'solid-js'

interface Props {
  children: Element
  onClick: () => void
}

export default (props: Props) => {
  const cursor = 'cursor: pointer'

  return (
    <>
      <div style={cursor} onClick={props.onClick}>
        {props.children}
      </div>
    </>
  )
}
