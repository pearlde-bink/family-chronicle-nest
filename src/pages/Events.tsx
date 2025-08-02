import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import EventDetail from '@/components/EventDetail';
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
} from 'lucide-react';
import { dataService, EventWithPhotos } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Events = () => {
  const [events, setEvents] = useState<EventWithPhotos[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load events from Supabase
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const eventsData = await dataService.getFamilyEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error('Error loading events:', error);
        toast({
          title: 'Error',
          description: 'Failed to load events. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [toast]);

  // Separate upcoming and past events
  const now = new Date();
  const upcomingEvents = events.filter(
    (event) => new Date(event.event_date) >= now
  );
  const pastEvents = events.filter((event) => new Date(event.event_date) < now);

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

  const getEventBadgeVariant = (type: string) => {
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
              <p className="text-muted-foreground">Loading events...</p>
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
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Family Events
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Celebrating life's special moments together. From birthdays and
            holidays to adventures and milestones - these are the times that
            bring our family closer.
          </p>
        </div>

        {/* Upcoming Events */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <Calendar className="w-6 h-6 text-family-warm mr-3" />
            <h2 className="text-3xl font-bold text-foreground">
              Upcoming Events
            </h2>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <Card
                  key={event.id}
                  className="group hover:shadow-photo transition-all duration-300 animate-fade-in bg-gradient-photo"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <div className="w-full h-full bg-gradient-warm flex items-center justify-center">
                      <Calendar className="w-16 h-16 text-white/60" />
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge
                        variant={getEventBadgeVariant(
                          event.event_type || 'event'
                        )}
                        className="flex items-center gap-1"
                      >
                        {getEventIcon(event.event_type || 'event')}
                        {event.event_type || 'Event'}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl text-foreground">
                      {event.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3">
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
                      <p className="text-sm text-foreground pt-2">
                        {event.description}
                      </p>
                    )}

                    <Button
                      variant="family"
                      size="sm"
                      className="w-full mt-4"
                      onClick={() =>
                        navigate(`/events/${event.id}`, { state: { event } })
                      }
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No upcoming events
              </h3>
              <p className="text-muted-foreground">
                Add some events to keep track of family activities!
              </p>
            </div>
          )}
        </section>

        {/* Past Events */}
        <section>
          <div className="flex items-center mb-8">
            <Camera className="w-6 h-6 text-family-warm mr-3" />
            <h2 className="text-3xl font-bold text-foreground">Memory Lane</h2>
          </div>

          {pastEvents.length > 0 ? (
            <div className="space-y-6">
              {pastEvents.map((event, index) => (
                <Card
                  key={event.id}
                  className="group hover:shadow-soft transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="md:flex">
                    <div className="md:w-64 h-48 md:h-auto overflow-hidden">
                      <div className="w-full h-full bg-gradient-warm flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-white/60" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl text-foreground mb-2">
                              {event.title}
                            </CardTitle>
                            <Badge
                              variant={getEventBadgeVariant(
                                event.event_type || 'event'
                              )}
                              className="flex items-center gap-1 w-fit"
                            >
                              {getEventIcon(event.event_type || 'event')}
                              {event.event_type || 'Event'}
                            </Badge>
                          </div>
                          {event.photos && event.photos.length > 0 && (
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              <Camera className="w-3 h-3" />
                              {event.photos.length} photos
                            </Badge>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-family-warm" />
                            <span>{formatEventDate(event.event_date)}</span>
                          </div>

                          {event.location && (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-family-warm" />
                              <span>{event.location}</span>
                            </div>
                          )}

                          {event.attendees && event.attendees.length > 0 && (
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2 text-family-warm" />
                              <span>{event.attendees.join(', ')}</span>
                            </div>
                          )}
                        </div>

                        {event.description && (
                          <p className="text-sm text-foreground">
                            {event.description}
                          </p>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="cream"
                            size="sm"
                            onClick={() =>
                              navigate(`/events/${event.id}`, {
                                state: { event },
                              })
                            }
                          >
                            <Camera className="w-4 h-1" />
                            View Photos
                          </Button>
                          <Button variant="ghost" size="sm">
                            Share Memories
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No past events
              </h3>
              <p className="text-muted-foreground">
                Start adding events to build your family's memory lane!
              </p>
            </div>
          )}
        </section>

        {/* Add Event Button */}
        <div className="text-center mt-12">
          <Button
            variant="warm"
            size="lg"
            onClick={() => {
              // In a real app, this would open an event creation form
              toast({
                title: 'Coming Soon',
                description: 'Event creation feature will be available soon!',
              });
            }}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Add New Event
          </Button>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Events;
