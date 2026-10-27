import { Column, Row, Image } from '@dasig'
import './EsignCard.sass'

interface Props {
  division: string
  applicationNo: string
  name: string
  onClick?: () => void
}

export default (props: Props) => {
  return (
    <section class='esign-card' onClick={props.onClick}>
      <Column gap={1} content='top' alignment='left'>
        <Row gap={0.5} content='left'>
          <Image name='esign-boxonly' size={40} />
          <span class='esign-card-division'>{props.division} Application</span>
        </Row>

        <span class='esign-card-application'>{props.applicationNo}</span>
        <span class='esign-card-name'>{props.name}</span>
      </Column>
    </section>
  )
}
