import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import PhotoGrid from '@/components/PhotoGrid';
import PhotoModal from '@/components/PhotoModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Users, Calendar, Camera, LogIn, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { dataService } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';
import backgroundImage from '@/assets/giadinh.jpg';

type FamilyMember = Database['public']['Tables']['family_members']['Row'];
type FamilyPhoto = Database['public']['Tables']['family_photos']['Row'];
type FamilyEvent = Database['public']['Tables']['family_events']['Row'];

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [recentPhotos, setRecentPhotos] = useState<FamilyPhoto[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<FamilyEvent[]>([]);
  const [stats, setStats] = useState({
    totalPhotos: 0,
    totalMembers: 0,
    totalEvents: 0,
  });
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<FamilyPhoto | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      setDataLoading(true);
      try {
        const [photosData, membersData, eventsData] = await Promise.all([
          dataService.getFamilyPhotos(),
          dataService.getFamilyMembers(),
          dataService.getFamilyEvents(),
        ]);

        // Get recent photos (limit to 6)
        setRecentPhotos(photosData.slice(0, 6));

        // Get family members
        setFamilyMembers(membersData);

        // Get upcoming events (next 30 days)
        const now = new Date();
        const thirtyDaysFromNow = new Date(
          now.getTime() + 30 * 24 * 60 * 60 * 1000
        );
        const upcoming = eventsData.filter((event) => {
          const eventDate = new Date(event.event_date);
          return eventDate >= now && eventDate <= thirtyDaysFromNow;
        });
        setUpcomingEvents(upcoming.slice(0, 3));

        // Calculate stats
        setStats({
          totalPhotos: photosData.length,
          totalMembers: membersData.length,
          totalEvents: eventsData.length,
        });
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const handlePhotoClick = (photo: { id: string }) => {
    const familyPhoto = recentPhotos.find((p) => p.id === photo.id);
    if (familyPhoto) {
      const index = recentPhotos.findIndex((p) => p.id === photo.id);
      setCurrentPhotoIndex(index);
      setSelectedPhoto(familyPhoto);
    }
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    let newIndex;
    if (direction === 'prev') {
      newIndex =
        currentPhotoIndex > 0 ? currentPhotoIndex - 1 : recentPhotos.length - 1;
    } else {
      newIndex =
        currentPhotoIndex < recentPhotos.length - 1 ? currentPhotoIndex + 1 : 0;
    }
    setCurrentPhotoIndex(newIndex);
    setSelectedPhoto(recentPhotos[newIndex]);
  };

  // Convert database photos to display format
  const displayPhotos = recentPhotos.map((photo) => ({
    id: photo.id,
    src: photo.image_url,
    alt: photo.title,
    title: photo.title,
    description: photo.description,
    date: photo.taken_date,
    location: photo.location,
    people: photo.tags || [],
  }));

  if (loading || dataLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading family memories...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      {/*<section className="relative h-96 overflow-hidden bg-gradient-warm rounded-3xl mb-12 animate-fade-in">
        <div className="absolute inset-0 bg-black/20"></div>
         <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Our Family’s Timeless Journey
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              A cherished space to weave our stories, treasure our memories, and
              embrace the love that binds us across generations.
            </p>
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="family"
                  size="lg"
                  onClick={() => navigate('/auth')}
                  className="text-lg px-8 py-3"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </Button>
                <Button
                  variant="cream"
                  size="lg"
                  onClick={() => navigate('/auth')}
                  className="text-lg px-8 py-3"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Join Family
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="family"
                  size="lg"
                  onClick={() => navigate('/photos')}
                  className="text-lg px-8 py-3"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  View Photos
                </Button>
                <Button
                  variant="cream"
                  size="lg"
                  onClick={() => navigate('/events')}
                  className="text-lg px-8 py-3"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  See Events
                </Button>
              </div>
            )}
          </div>
        </div> 
      </section>*/}
      <section className="relative h-[500px] overflow-hidden rounded-3xl mb-16 shadow-lg">
        {/* Background Image with Animated Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center animate-airflow"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundBlendMode: 'overlay',
            // backgroundColor: 'rgb(150, 100, 71)',
            backgroundColor: 'rgb(141, 100, 64)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rose-100/30 to-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 drop-shadow-md">
              Our Family’s Timeless Journey
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 font-light tracking-wide">
              A cherished space to weave our stories, treasure our memories, and
              embrace the love that binds us across generations.
            </p>
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="family"
                  size="lg"
                  onClick={() => navigate('/auth')}
                  className="text-lg px-8 py-3 bg-rose-500 hover:bg-rose-600 transition-colors duration-300"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Join Our Circle
                </Button>
                <Button
                  variant="cream"
                  size="lg"
                  onClick={() => navigate('/auth')}
                  className="text-lg px-8 py-3 bg-amber-400 hover:bg-amber-500 text-rose-900 transition-colors duration-300"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Become Family
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="family"
                  size="lg"
                  onClick={() => navigate('/photos')}
                  className="text-lg px-8 py-3"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Cherish Our Photos
                </Button>
                <Button
                  variant="cream"
                  size="lg"
                  onClick={() => navigate('/events')}
                  className="text-lg px-8 py-3"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Celebrate Our Events
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center hover:shadow-photo transition-all duration-300 animate-fade-in">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-family-warm rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                {stats.totalPhotos}
              </div>
              <div className="text-muted-foreground">Treasured Photos</div>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-photo transition-all duration-300 animate-fade-in">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-family-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                {stats.totalMembers}
              </div>
              <div className="text-muted-foreground">Beloved Members</div>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-photo transition-all duration-300 animate-fade-in">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-family-brown rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                {stats.totalEvents}
              </div>
              <div className="text-muted-foreground">Joyful Gatherings</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Memories Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Our Recent Memories
            </h2>
            <p className="text-muted-foreground">
              Moments that warm our hearts, captured forever in love and light.
            </p>
          </div>
          <Button
            variant="family"
            size="sm"
            onClick={() => navigate('/photos')}
          >
            Explore All Memories
          </Button>
        </div>

        {recentPhotos.length > 0 ? (
          <PhotoGrid
            photos={displayPhotos}
            className="animate-fade-in"
            onPhotoClick={handlePhotoClick}
          />
        ) : (
          <div className="text-center py-12">
            <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Memories yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Begin our family’s story by sharing your first cherished moment.
            </p>
            <Button onClick={() => navigate('/photos')}>
              <Camera className="w-4 h-4 mr-2" />
              Share Your First Memory
            </Button>
          </div>
        )}
      </section>

      {/* Quick Links */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Journey Through Our Family
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/members">
            <Card className="group hover:shadow-photo transition-all duration-300 cursor-pointer animate-fade-in">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-family-warm rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Our Loved Ones
                </h3>
                <p className="text-muted-foreground">
                  Discover the stories and smiles of our beloved family members.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/photos">
            <Card className="group hover:shadow-photo transition-all duration-300 cursor-pointer animate-fade-in">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-family-gold rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Memory Gallery
                </h3>
                <p className="text-muted-foreground">
                  Relive the warmth of our family’s most treasured moments.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/events">
            <Card className="group hover:shadow-photo transition-all duration-300 cursor-pointer animate-fade-in">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-family-brown rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Family Gatherings
                </h3>
                <p className="text-muted-foreground">
                  Join us in celebrating the moments that bring us closer.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Card className="group hover:shadow-photo transition-all duration-300 cursor-pointer animate-fade-in">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-family-cream rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-family-brown" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Our Stories
              </h3>
              <p className="text-muted-foreground">
                Share and preserve our family's stories and traditions.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Photo Modal */}
      <PhotoModal
        photo={
          selectedPhoto
            ? {
                id: selectedPhoto.id,
                src: selectedPhoto.image_url,
                alt: selectedPhoto.title,
                title: selectedPhoto.title,
                description: selectedPhoto.description,
                date: selectedPhoto.taken_date,
                location: selectedPhoto.location,
                people: selectedPhoto.tags || [],
              }
            : null
        }
        photos={displayPhotos}
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onNavigate={handleNavigate}
      />
    </Layout>
  );
};

export default Index;
