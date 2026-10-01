import webpPath from '/images/logo.webp'
import avifPath from '/images/logo.avif'

interface Props {
  size?: number
  alt?: string
}

export default (props: Props) => {
  return (
    <>
      <picture>
        <source srcset={avifPath} type='image/avif' />
        <source srcset={webpPath} type='image/webp' />
        <img width={props.size} height='auto' decoding='async' loading='lazy' alt='logo' />
      </picture>
    </>
  )
}
