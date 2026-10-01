import '../components-styles/Background.sass'
import { Show } from 'solid-js'

interface Props {
  image?: boolean | string
  color?: string
}

export default (props: Props) => {
  const images = import.meta.glob('/images/*.{avif,webp}', {
    eager: true,
    query: '?url',
    import: 'default',
  })

  const getSources = () => {
    if (typeof props.image === 'string') {
      const webp = images[`/images/${props.image}.webp`]
      const avif = images[`/images/${props.image}.avif`]
      return { webp, avif }
    }
    return {
      webp: '/images/background.webp',
      avif: '/images/background.avif',
    }
  }

  const { webp, avif } = getSources()

  return (
    <>
      <Show when={props.image !== false}>
        <picture>
          <source srcset={avif} type='image/avif' />
          <source srcset={webp} type='image/webp' />
          <img class='dasig-background' width='1920' height='auto' decoding='async' loading='lazy' alt='An image background' />
        </picture>
      </Show>

      <Show when={props.image === false && !props.color}>
        <picture>
          <source srcset='images/background.webp' type='image/webp' />
          <img class='dasig-background' width='1920' height='auto' decoding='async' loading='lazy' alt='An image background' />
        </picture>
      </Show>

      <Show when={!props.image && props.color}>
        <div style={`background-color: ${props.color}`} class='dasig-background' />
      </Show>
    </>
  )
}
