interface Props {
  name: string;
  size: number;
  radius?: number;
}

export default (props: Props) => {
  const images = import.meta.glob(
    '/images/*.{avif,webp}',
    {
      eager: true,
      query: '?url',
      import: 'default',
    }
  );

  const avifImage = images[`/images/${props.name}.avif`];
  const webpImage = images[`/images/${props.name}.webp`];

  return (
    <>
      <picture>
        <source srcset={avifImage} type="image/avif" />
        <source srcset={webpImage} type="image/webp" />
        <img
          style={props.radius != null ? `border-radius: ${props.radius}rem` : 'border-radius: 0' }
          width={props.size}
          height="auto"
          decoding="async"
          loading="lazy"
          alt={props.name + " image"}
        />
      </picture>
    </>
  );
};
