import type { ImgHTMLAttributes } from 'react';

type CompatImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  priority?: boolean;
};

export default function CompatImage({ priority: _priority, ...props }: CompatImageProps) {
  return <img {...props} />;
}
