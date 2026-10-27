import '../components-styles/LoadingScreen.sass'

interface Props {
  image: string
  imageRadius?: number
  imageSize: number
  animation: string
  text: string
}

export default (props: Props) => {
  const images = import.meta.glob('/images/*.{avif,webp}', {
    eager: true,
    query: '?url',
    import: 'default',
  })

  const avifImage = images[`/images/${props.image}.avif`]
  const webpImage = images[`/images/${props.image}.webp`]

  return (
    <>
      <picture>
        <source srcset={avifImage} type='image/avif' />
        <source srcset={webpImage} type='image/webp' />
        <img class={`dasig-loadingscreen-${props.animation}`} style={props.imageRadius != null ? `border-radius: ${props.imageRadius}rem` : 'border-radius: 0'} width={props.imageSize} height='auto' decoding='async' loading='lazy' alt={props.image + ' image'} />
      </picture>

      <span class='dasig-loadingscreen--text'>{props.text}</span>
    </>
  )
}
