import { createSignal, Show } from 'solid-js'
import { Column, Box, Row, Image } from '@dasig'
import './EsignCard.sass'

interface Props {
  division: string
  applicationNo: string
  name: string
  onClick?: () => void
  onHover?: () => void
}

export default (props: Props) => {
  const [checked, setChecked] = createSignal(false)

  const handleMouseEnter = () => {
    setChecked(true)
    if (props.onHover) {
      props.onHover()
    }
  }

  const handleMouseLeave = () => {
    setChecked(false)
  }

  return (
    <section class='esign-card' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={props.onClick}>
      <Show when={checked()}>
        <Box color='rgba(210, 215, 222, 0.4)' thickness={2} curved padding='1rem 4rem 1rem 1rem' background='rgba(22, 22, 26, 0.7)' width='12.5rem'>
          <Column gap={1} content='top' alignment='left'>
            <Row gap={0.5} content='left'>
              <Image name='esign-boxchecked' size={40} />
              <span class='esign-card-division'>{props.division} Application</span>
            </Row>

            <span class='esign-card-application'>{props.applicationNo}</span>
            <span class='esign-card-name'>{props.name}</span>
          </Column>
        </Box>
      </Show>

      <Show when={!checked()}>
        <Box color='rgba(210, 215, 222, 0.2)' thickness={1} curved padding='1rem 4rem 1rem 1rem' background='rgba(25, 25, 27,0.2)' width='12.5rem'>
          <Column gap={1} content='top' alignment='left'>
            <Row gap={0.5} content='left'>
              <Image name='esign-boxonly' size={40} />
              <span class='esign-card-division'>{props.division} Application</span>
            </Row>

            <span class='esign-card-application'>{props.applicationNo}</span>
            <span class='esign-card-name'>{props.name}</span>
          </Column>
        </Box>
      </Show>
    </section>
  )
}
