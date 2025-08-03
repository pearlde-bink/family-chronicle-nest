import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, Download, Share2 } from 'lucide-react';

interface Photo {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  people?: string[];
}

interface PhotoModalProps {
  photo: Photo | null;
  photos: Photo[];
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

const PhotoModal = ({
  photo,
  photos,
  isOpen,
  onClose,
  onNavigate,
}: PhotoModalProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (photo) {
      setIsLoading(true);
    }
  }, [photo]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft') {
      onNavigate('prev');
    } else if (e.key === 'ArrowRight') {
      onNavigate('next');
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen || !photo) {
    return null;
  }

  const currentIndex = photos.findIndex((p) => p.id === photo.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="relative w-full h-full flex items-center justify-center p-4">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </Button>

        {/* Navigation Buttons */}
        {hasPrev && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 z-10 text-white hover:bg-white/20"
            onClick={() => onNavigate('prev')}
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>
        )}

        {hasNext && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 z-10 text-white hover:bg-white/20"
            onClick={() => onNavigate('next')}
          >
            <ChevronRight className="w-8 h-8" />
          </Button>
        )}

        {/* Photo Container */}
        <div className="relative w-full h-full flex items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <img
            src={photo.src}
            alt={photo.alt}
            className={`max-w-full max-h-full object-contain ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsLoading(false)}
          />

          {/* Photo Info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
            <h3 className="text-xl font-semibold mb-2">{photo.title}</h3>
            {photo.description && (
              <p className="text-sm mb-2 opacity-90">{photo.description}</p>
            )}
            {photo.date && <p className="text-sm mb-1">📅 {photo.date}</p>}
            {photo.location && (
              <p className="text-sm mb-1">📍 {photo.location}</p>
            )}
            {photo.people && (
              <p className="text-sm">👥 {photo.people.join(', ')}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Photo Counter */}
        <div className="absolute top-4 left-4 text-white text-sm">
          {currentIndex + 1} of {photos.length}
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
