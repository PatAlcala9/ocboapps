import './Card.sass'
import { Column, Image, Link } from '@dasig'

interface Props {
  image: string
  name: string
  description: string
  site: string
}

export default (props: Props) => {
  return (
    <Link to={props.site} newtab>
      <section class='com-card'>
        <Column>
          <Image data-testid='image' name={props.image} size={140} />
          <span class='com-card__name'>{props.name}</span>
          <span class='com-card__description'>{props.description}</span>
        </Column>
      </section>
    </Link>
  )
}
