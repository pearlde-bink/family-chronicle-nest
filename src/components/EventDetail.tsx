import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Heart,
  Gift,
  Camera,
  Plane,
  ArrowLeft,
} from 'lucide-react';
import PhotoGrid from './PhotoGrid';
import PhotoModal from './PhotoModal';

interface EventPhoto {
  id: string;
  src: string;
  alt: string;
  title?: string;
  date?: string;
  location?: string;
  people?: string[];
}

interface Event {
  id: string;
  title: string;
  event_date: string;
  location?: string;
  description?: string;
  attendees?: string[];
  event_type?: string;
  photos?: string[];
}

interface EventDetailProps {
  event: Event;
  onClose: () => void;
}

const EventDetail = ({ event, onClose }: EventDetailProps) => {
  const [activeTab, setActiveTab] = useState<'details' | 'photos'>('details');
  const [selectedPhoto, setSelectedPhoto] = useState<EventPhoto | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Sample photos for the event (in a real app, these would come from the database)
  const eventPhotos =
    event.photos && event.photos.length > 0
      ? event.photos.map((photoUrl, index) => ({
          id: `${index + 1}`,
          src: photoUrl,
          alt: `${event.title} - Photo ${index + 1}`,
          title: `${event.title} - Photo ${index + 1}`,
          date: event.event_date,
          location: event.location || '',
          people: event.attendees || [],
        }))
      : [
          {
            id: '1',
            src: '/placeholder-event.jpg', // You can add a placeholder image
            alt: `${event.title} - Main photo`,
            title: event.title,
            date: event.event_date,
            location: event.location || '',
            people: event.attendees || [],
          },
        ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'birthday':
        return <Gift className="w-5 h-5" />;
      case 'holiday':
        return <Heart className="w-5 h-5" />;
      case 'vacation':
        return <Plane className="w-5 h-5" />;
      case 'milestone':
        return <Camera className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const getEventBadgeVariant = (type: string | undefined) => {
    switch (type) {
      case 'birthday':
        return 'default';
      case 'holiday':
        return 'destructive';
      case 'vacation':
        return 'secondary';
      case 'milestone':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const handlePhotoClick = (photo: EventPhoto) => {
    const index = eventPhotos.findIndex((p) => p.id === photo.id);
    setCurrentPhotoIndex(index);
    setSelectedPhoto(photo);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    let newIndex;
    if (direction === 'prev') {
      newIndex =
        currentPhotoIndex > 0 ? currentPhotoIndex - 1 : eventPhotos.length - 1;
    } else {
      newIndex =
        currentPhotoIndex < eventPhotos.length - 1 ? currentPhotoIndex + 1 : 0;
    }
    setCurrentPhotoIndex(newIndex);
    setSelectedPhoto(eventPhotos[newIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-family-cream to-white">
      {/* Header */}
      <div className="relative h-64 overflow-hidden bg-gradient-warm">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <div className="mb-4">
              <Badge
                variant={getEventBadgeVariant(event.event_type)}
                className="flex items-center gap-1 text-lg px-4 py-2"
              >
                {getEventIcon(event.event_type || 'event')}
                {event.event_type || 'Event'}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <p className="text-lg opacity-90">
              {new Date(event.event_date).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Back Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 text-white hover:bg-white/20"
          onClick={onClose}
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg p-1 shadow-soft">
            {[
              { id: 'details', label: 'Event Details', icon: Calendar },
              { id: 'photos', label: 'Photos', icon: Camera },
            ].map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={activeTab === id ? 'family' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(id as 'details' | 'photos')}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Event Info */}
            <Card>
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2 text-family-warm" />
                  <span>{new Date(event.event_date).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2 text-family-warm" />
                  <span>{event.location}</span>
                </div>

                {event.attendees && event.attendees.length > 0 && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-2 text-family-warm" />
                    <span>{event.attendees.join(', ')}</span>
                  </div>
                )}

                <div className="pt-4">
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-foreground leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Event Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-family-warm">
                    {eventPhotos.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Photos</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-family-warm">
                    {event.attendees?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Attendees</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-family-warm">1</div>
                  <div className="text-sm text-muted-foreground">Day</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-family-warm">∞</div>
                  <div className="text-sm text-muted-foreground">Memories</div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button variant="family">
                <Calendar className="w-4 h-4 mr-2" />
                Add to Calendar
              </Button>
              <Button variant="cream">
                <Camera className="w-4 h-4 mr-2" />
                View Photos
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Event Photos
              </h2>
              <p className="text-muted-foreground">
                Captured moments from {event.title}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="group cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handlePhotoClick(photo)}
                >
                  <div className="relative overflow-hidden rounded-lg bg-gradient-photo hover:shadow-photo transition-all duration-300">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-semibold mb-1">{photo.title}</h3>
                        {photo.date && (
                          <div className="flex items-center text-xs mb-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            {photo.date}
                          </div>
                        )}
                        {photo.location && (
                          <div className="flex items-center text-xs mb-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {photo.location}
                          </div>
                        )}
                        {photo.people && (
                          <div className="flex items-center text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            {photo.people.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Photo Modal */}
      <PhotoModal
        photo={selectedPhoto}
        photos={eventPhotos}
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default EventDetail;
