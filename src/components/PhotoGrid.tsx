import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Photo {
  id: string;
  src: string;
  alt: string;
  title?: string;
}

interface PhotoGridProps {
  photos: Photo[];
  className?: string;
  onPhotoClick?: (photo: Photo) => void;
}

const PhotoGrid = ({
  photos,
  className = '',
  onPhotoClick,
}: PhotoGridProps) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => new Set(prev).add(id));
  };

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
    >
      {photos.map((photo, index) => (
        <Card
          key={photo.id}
          className="group overflow-hidden hover:shadow-photo transition-shadow duration-300 bg-gradient-photo cursor-pointer"
          style={{ animationDelay: `${index * 0.1}s` }}
          onClick={() => onPhotoClick?.(photo)}
        >
          <CardContent className="p-0">
            <div className="relative overflow-hidden aspect-square">
              {!loadedImages.has(photo.id) && (
                <div className="absolute inset-0 bg-gradient-sunset animate-pulse" />
              )}
              <img
                src={photo.src}
                alt={photo.alt}
                onLoad={() => handleImageLoad(photo.id)}
                className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                  loadedImages.has(photo.id) ? 'opacity-100' : 'opacity-0'
                }`}
              />
              {photo.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-white text-sm font-medium">
                    {photo.title}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PhotoGrid;
