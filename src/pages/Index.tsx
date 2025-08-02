import Layout from "@/components/Layout";
import PhotoGrid from "@/components/PhotoGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Calendar, Camera, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import familyHero from "@/assets/family-hero.jpg";
import familyGrid from "@/assets/family-grid.jpg";

const Index = () => {
  const { user, loading } = useAuth();

  // Sample family photos for the grid
  const recentPhotos = [
    { id: "1", src: familyGrid, alt: "Family moments", title: "Recent Memories" },
    { id: "2", src: familyHero, alt: "Family gathering", title: "Holiday 2024" },
    { id: "3", src: familyGrid, alt: "Birthday party", title: "Birthday Fun" },
    { id: "4", src: familyHero, alt: "Vacation", title: "Summer Trip" },
    { id: "5", src: familyGrid, alt: "Family dinner", title: "Sunday Dinner" },
    { id: "6", src: familyHero, alt: "New Year", title: "New Year 2024" },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        {/* Hero Section - Unauthenticated */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-warm mb-12 animate-fade-in">
          <div className="relative z-10 px-8 py-16 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full">
                <Heart className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
                Welcome to Our Family Chronicle
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
                A private space where we celebrate our bonds, share memories, and create lasting connections. 
                Sign in to access our family photos, events, and memories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <Button variant="cream" size="lg" className="w-full sm:w-auto">
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/30 text-primary-foreground hover:bg-white/10">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-black/20"></div>
          <img 
            src={familyHero} 
            alt="Our beautiful family" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </section>

        {/* Preview Info */}
        <section className="text-center mb-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">Sign in to explore</h2>
            <p className="text-muted-foreground mb-8">
              Once signed in, you'll have access to family photos, event calendars, member profiles, and more.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Users, label: "Family Profiles", color: "text-family-warm" },
                { icon: Camera, label: "Photo Gallery", color: "text-primary" },
                { icon: Calendar, label: "Events", color: "text-family-brown" },
                { icon: Heart, label: "Memories", color: "text-family-gold" },
              ].map(({ icon: Icon, label, color }) => (
                <Card key={label} className="text-center hover:shadow-soft transition-shadow">
                  <CardContent className="p-6">
                    <Icon className={`w-8 h-8 mx-auto mb-3 ${color}`} />
                    <div className="text-sm text-muted-foreground">{label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-warm mb-12 animate-fade-in">
        <div className="relative z-10 px-8 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full">
              <Heart className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
              Welcome to Our Family
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              A private space where we celebrate our bonds, share memories, and create lasting connections. 
              Explore our family tree, relive precious moments, and stay connected with those who matter most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/members">
                <Button variant="cream" size="lg" className="w-full sm:w-auto">
                  <Users className="w-5 h-5 mr-2" />
                  Meet the Family
                </Button>
              </Link>
              <Link to="/photos">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/30 text-primary-foreground hover:bg-white/10">
                  <Camera className="w-5 h-5 mr-2" />
                  View Photos
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/20"></div>
        <img 
          src={familyHero} 
          alt="Our beautiful family" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { icon: Users, label: "Family Members", value: "12", color: "text-family-warm" },
          { icon: Camera, label: "Shared Photos", value: "847", color: "text-primary" },
          { icon: Calendar, label: "Events", value: "23", color: "text-family-brown" },
          { icon: Heart, label: "Years Together", value: "∞", color: "text-family-gold" },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label} className="text-center hover:shadow-soft transition-shadow animate-fade-in">
            <CardContent className="p-6">
              <Icon className={`w-8 h-8 mx-auto mb-3 ${color}`} />
              <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Recent Photos Section */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">Recent Memories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our latest adventures, celebrations, and everyday moments that make our family special.
          </p>
        </div>
        <PhotoGrid photos={recentPhotos} className="animate-fade-in" />
        <div className="text-center mt-8">
          <Link to="/photos">
            <Button variant="family" size="lg">
              <Camera className="w-5 h-5 mr-2" />
              View All Photos
            </Button>
          </Link>
        </div>
      </section>

      {/* Quick Links */}
      <section className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-sunset hover:shadow-warm transition-shadow animate-fade-in">
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 text-family-warm mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-3">Upcoming Events</h3>
            <p className="text-muted-foreground mb-6">
              Never miss a birthday, anniversary, or family gathering. Stay connected with what's coming up.
            </p>
            <Link to="/events">
              <Button variant="family">View Events</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-photo hover:shadow-warm transition-shadow animate-fade-in">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-3">Family Members</h3>
            <p className="text-muted-foreground mb-6">
              Get to know everyone better with individual profiles, stories, and personal galleries.
            </p>
            <Link to="/members">
              <Button variant="family">Meet Everyone</Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
};

export default Index;
