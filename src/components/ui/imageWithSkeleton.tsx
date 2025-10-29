// src/components/ui/image-with-skeleton.tsx
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
}

export const ImageWithSkeleton = ({
  src,
  alt,
  className,
}: ImageWithSkeletonProps) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative">
      {loading && (
        <div className={cn('animate-pulse bg-gray-200', className)} />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          'transition-opacity',
          loading ? 'hidden' : 'inline',
          className
        )}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};
