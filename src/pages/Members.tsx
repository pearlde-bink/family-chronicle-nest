import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, MapPin, Mail, Phone } from "lucide-react";
import familyHero from "@/assets/family-hero.jpg";
import familyGrid from "@/assets/family-grid.jpg";

const Members = () => {
  // Sample family members data
  const familyMembers = [
    {
      id: "1",
      name: "Eleanor Chen",
      role: "Grandmother",
      birthday: "March 15, 1948",
      location: "San Francisco, CA",
      bio: "The heart of our family. Eleanor loves gardening, cooking traditional recipes, and telling stories about the old days.",
      image: familyHero,
      email: "eleanor@family.com",
      phone: "(555) 123-4567",
      favoriteMemory: "Teaching grandchildren to cook dumplings"
    },
    {
      id: "2",
      name: "David Chen",
      role: "Father",
      birthday: "July 22, 1975",
      location: "San Francisco, CA",
      bio: "Software engineer and weekend photographer. Always ready with dad jokes and captures all our family moments.",
      image: familyGrid,
      email: "david@family.com",
      phone: "(555) 234-5678",
      favoriteMemory: "First family camping trip"
    },
    {
      id: "3",
      name: "Maria Chen",
      role: "Mother",
      birthday: "December 8, 1978",
      location: "San Francisco, CA",
      bio: "Teacher and family organizer. The one who makes sure everyone remembers birthdays and family gatherings.",
      image: familyHero,
      email: "maria@family.com",
      phone: "(555) 345-6789",
      favoriteMemory: "Our weekly Sunday dinners"
    },
    {
      id: "4",
      name: "Sophie Chen",
      role: "Daughter",
      birthday: "April 10, 2010",
      location: "San Francisco, CA",
      bio: "Artist in the making! Loves painting, dancing, and spending time with cousins during holidays.",
      image: familyGrid,
      email: "sophie@family.com",
      favoriteMemory: "Art class with grandma"
    },
    {
      id: "5",
      name: "Alex Chen",
      role: "Son",
      birthday: "September 3, 2012",
      location: "San Francisco, CA",
      bio: "Soccer enthusiast and future scientist. Always asking 'why' and 'how' about everything!",
      image: familyHero,
      email: "alex@family.com",
      favoriteMemory: "Building robots with dad"
    },
    {
      id: "6",
      name: "Uncle James",
      role: "Uncle",
      birthday: "November 18, 1972",
      location: "Portland, OR",
      bio: "Adventure seeker and travel photographer. Brings the best stories from around the world.",
      image: familyGrid,
      email: "james@family.com",
      phone: "(555) 456-7890",
      favoriteMemory: "Road trip to Yellowstone"
    }
  ];

  return (
    <ProtectedRoute>
      <Layout>
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Family</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Meet the amazing people who make our family special. Each person brings their own unique 
          personality, talents, and love to our close-knit family.
        </p>
      </div>

      {/* Family Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {familyMembers.map((member, index) => (
          <Card 
            key={member.id} 
            className="group hover:shadow-photo transition-all duration-300 animate-fade-in bg-gradient-photo"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="pb-4">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover rounded-full border-4 border-family-cream group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-family-warm rounded-full flex items-center justify-center">
                  <Heart className="w-3 h-3 text-white" />
                </div>
              </div>
              <CardTitle className="text-center">
                <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                <Badge variant="secondary" className="mt-2">
                  {member.role}
                </Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Birthday */}
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2 text-family-warm" />
                <span>{member.birthday}</span>
              </div>

              {/* Location */}
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2 text-family-warm" />
                <span>{member.location}</span>
              </div>

              {/* Bio */}
              <p className="text-sm text-foreground leading-relaxed">
                {member.bio}
              </p>

              {/* Favorite Memory */}
              <div className="bg-family-cream/50 rounded-lg p-3">
                <p className="text-xs font-medium text-family-brown mb-1">Favorite Memory:</p>
                <p className="text-sm text-foreground italic">"{member.favoriteMemory}"</p>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col gap-2 pt-2 border-t border-family-cream">
                {member.email && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Mail className="w-3 h-3 mr-2" />
                    <span>{member.email}</span>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Phone className="w-3 h-3 mr-2" />
                    <span>{member.phone}</span>
                  </div>
                )}
              </div>

              {/* View Profile Button */}
              <Button 
                variant="family" 
                size="sm" 
                className="w-full mt-4"
                onClick={() => {
                  // In a real app, this would navigate to individual profile
                  alert(`View ${member.name}'s full profile`);
                }}
              >
                View Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Family Stats */}
      <div className="mt-16 text-center">
        <Card className="bg-gradient-sunset max-w-2xl mx-auto">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Family at a Glance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl font-bold text-family-warm">6</div>
                <div className="text-sm text-muted-foreground">Members</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-family-warm">3</div>
                <div className="text-sm text-muted-foreground">Generations</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-family-warm">2</div>
                <div className="text-sm text-muted-foreground">Cities</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-family-warm">∞</div>
                <div className="text-sm text-muted-foreground">Love</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
    </ProtectedRoute>
  );
};

export default Members;