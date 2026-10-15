import { Column, Image, Link } from '@dasig'
import './Card.sass'

interface Props {
  image: string
  name: string
  description: string
  site: string
  imageSize?: number
}

export default (props: Props) => {
  return (
    <Link to={props.site} replace>
      <section class='com-card'>
        <Column>
          <Image data-testid='image' name={props.image} size={props.imageSize || 140} />
          <span class='com-card__name'>{props.name}</span>
          <span class='com-card__description'>{props.description}</span>
        </Column>
      </section>
    </Link>
  )
}
