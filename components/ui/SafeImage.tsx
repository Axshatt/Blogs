import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src: string;
}

export function SafeImage({ src, alt, fill, ...props }: SafeImageProps) {
  if (src.startsWith('/') && !src.startsWith('//')) src = (process.env.NEXT_PUBLIC_BASE_PATH || '') + src;
  const isLocal =
    src.startsWith('/') ||
    src.startsWith('http://localhost') ||
    src.startsWith('https://blog.akshatcodes.com');
  const isUnsplash = src.includes('images.unsplash.com');

  if (isLocal || isUnsplash) {
    return <Image src={src} alt={alt} fill={fill} {...props} />;
  }

  // Fallback styling to mimic next/image "fill" behavior
  const fallbackStyle = fill
    ? {
        position: 'absolute' as const,
        height: '100%',
        width: '100%',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        objectFit: 'cover' as const,
        ...props.style,
      }
    : props.style;

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      className={props.className}
      style={fallbackStyle}
      loading={props.priority ? 'eager' : 'lazy'}
    />
  );
}
