import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
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
import { dataService } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type FamilyEvent = Database['public']['Tables']['family_events']['Row'];
type FamilyPhoto = Database['public']['Tables']['family_photos']['Row'];

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [event, setEvent] = useState<FamilyEvent | null>(
    location.state?.event || null
  );
  const [photos, setPhotos] = useState<FamilyPhoto[]>([]);
  const [loading, setLoading] = useState(!event);
  const [activeTab, setActiveTab] = useState<'details' | 'photos'>('details');

  useEffect(() => {
    const loadEventData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // If we don't have event data, fetch it
        if (!event) {
          const events = await dataService.getFamilyEvents();
          const foundEvent = events.find((e) => e.id === id);
          if (foundEvent) {
            setEvent(foundEvent);
          } else {
            throw new Error('Event not found');
          }
        }

        // Load photos for this event (you might need to add this to dataService)
        // For now, we'll use a placeholder
        setPhotos([]);
      } catch (error) {
        console.error('Error loading event data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load event data. Please try again.',
          variant: 'destructive',
        });
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };

    loadEventData();
  }, [id, event, navigate, toast]);

  const getEventIcon = (type: string | undefined) => {
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

  const formatEventDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading event details...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!event) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Event Not Found
              </h2>
              <p className="text-muted-foreground mb-4">
                The event you're looking for doesn't exist.
              </p>
              <Button onClick={() => navigate('/events')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Button>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
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
                  {getEventIcon(event.event_type)}
                  {event.event_type || 'Event'}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              <p className="text-lg opacity-90">
                {formatEventDate(event.event_date)}
              </p>
            </div>
          </div>

          {/* Back Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 text-white hover:bg-white/20"
            onClick={() => navigate('/events')}
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
                    <span>{formatEventDate(event.event_date)}</span>
                  </div>

                  {event.location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2 text-family-warm" />
                      <span>{event.location}</span>
                    </div>
                  )}

                  {event.attendees && event.attendees.length > 0 && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-2 text-family-warm" />
                      <span>{event.attendees.join(', ')}</span>
                    </div>
                  )}

                  {event.description && (
                    <div className="pt-4">
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-foreground leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Event Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-family-warm">
                      {photos.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Photos</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-family-warm">
                      {event.attendees?.length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Attendees
                    </div>
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
                    <div className="text-sm text-muted-foreground">
                      Memories
                    </div>
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

              {photos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {photos.map((photo) => (
                    <Card key={photo.id} className="overflow-hidden">
                      <img
                        src={photo.image_url}
                        alt={photo.title}
                        className="w-full aspect-square object-cover"
                      />
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{photo.title}</h3>
                        {photo.taken_date && (
                          <p className="text-sm text-muted-foreground">
                            {new Date(photo.taken_date).toLocaleDateString()}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No photos yet
                  </h3>
                  <p className="text-muted-foreground">
                    Photos from {event.title} will appear here when uploaded.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default EventDetail;
