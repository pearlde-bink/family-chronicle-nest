import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Heart, Gift, Camera, Plane } from "lucide-react";
import familyHero from "@/assets/family-hero.jpg";
import familyGrid from "@/assets/family-grid.jpg";

const Events = () => {
  // Sample events data
  const upcomingEvents = [
    {
      id: "1",
      title: "Alex's 13th Birthday",
      date: "September 3, 2025",
      time: "2:00 PM",
      location: "Chuck E. Cheese",
      description: "Alex is turning 13! Join us for pizza, games, and birthday fun.",
      attendees: ["Family", "Friends"],
      type: "birthday",
      image: familyGrid
    },
    {
      id: "2",
      title: "Thanksgiving Dinner",
      date: "November 27, 2025",
      time: "3:00 PM",
      location: "Eleanor's House",
      description: "Annual family Thanksgiving gathering with all the traditional favorites.",
      attendees: ["Everyone"],
      type: "holiday",
      image: familyHero
    },
    {
      id: "3",
      title: "Winter Family Ski Trip",
      date: "December 20-27, 2025",
      time: "All Week",
      location: "Lake Tahoe, CA",
      description: "Our annual winter vacation! A week of skiing, hot cocoa, and family bonding.",
      attendees: ["David", "Maria", "Sophie", "Alex"],
      type: "vacation",
      image: familyGrid
    }
  ];

  const pastEvents = [
    {
      id: "4",
      title: "Chinese New Year 2024",
      date: "February 10, 2024",
      time: "6:00 PM",
      location: "Chinatown",
      description: "Celebrated the Year of the Dragon with traditional food and decorations.",
      attendees: ["Everyone"],
      type: "holiday",
      image: familyHero,
      photos: 15
    },
    {
      id: "5",
      title: "Sophie's Art Exhibition",
      date: "May 15, 2024",
      time: "7:00 PM",
      location: "Local Gallery",
      description: "Sophie's first art show featuring her beautiful paintings.",
      attendees: ["Family", "Friends"],
      type: "milestone",
      image: familyGrid,
      photos: 8
    },
    {
      id: "6",
      title: "Yellowstone Family Trip",
      date: "July 15-22, 2024",
      time: "All Week",
      location: "Yellowstone National Park",
      description: "Amazing week exploring geysers, wildlife, and creating memories.",
      attendees: ["James", "David", "Maria", "Sophie", "Alex"],
      type: "vacation",
      image: familyHero,
      photos: 32
    },
    {
      id: "7",
      title: "Eleanor's 76th Birthday",
      date: "March 15, 2024",
      time: "1:00 PM",
      location: "Eleanor's Garden",
      description: "Beautiful garden party celebrating grandma's special day.",
      attendees: ["Everyone"],
      type: "birthday",
      image: familyGrid,
      photos: 12
    }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case "birthday":
        return <Gift className="w-5 h-5" />;
      case "holiday":
        return <Heart className="w-5 h-5" />;
      case "vacation":
        return <Plane className="w-5 h-5" />;
      case "milestone":
        return <Camera className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const getEventBadgeVariant = (type: string) => {
    switch (type) {
      case "birthday":
        return "default";
      case "holiday":
        return "destructive";
      case "vacation":
        return "secondary";
      case "milestone":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Family Events</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Celebrating life's special moments together. From birthdays and holidays to adventures 
          and milestones - these are the times that bring our family closer.
        </p>
      </div>

      {/* Upcoming Events */}
      <section className="mb-16">
        <div className="flex items-center mb-8">
          <Calendar className="w-6 h-6 text-family-warm mr-3" />
          <h2 className="text-3xl font-bold text-foreground">Upcoming Events</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {upcomingEvents.map((event, index) => (
            <Card 
              key={event.id} 
              className="group hover:shadow-photo transition-all duration-300 animate-fade-in bg-gradient-photo"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge 
                    variant={getEventBadgeVariant(event.type)}
                    className="flex items-center gap-1"
                  >
                    {getEventIcon(event.type)}
                    {event.type}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl text-foreground">{event.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2 text-family-warm" />
                  <span>{event.date}</span>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2 text-family-warm" />
                  <span>{event.time}</span>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2 text-family-warm" />
                  <span>{event.location}</span>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="w-4 h-4 mr-2 text-family-warm" />
                  <span>{event.attendees.join(", ")}</span>
                </div>
                
                <p className="text-sm text-foreground pt-2">{event.description}</p>
                
                <Button variant="family" size="sm" className="w-full mt-4">
                  Add to Calendar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Past Events */}
      <section>
        <div className="flex items-center mb-8">
          <Camera className="w-6 h-6 text-family-warm mr-3" />
          <h2 className="text-3xl font-bold text-foreground">Memory Lane</h2>
        </div>
        
        <div className="space-y-6">
          {pastEvents.map((event, index) => (
            <Card 
              key={event.id} 
              className="group hover:shadow-soft transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="md:flex">
                <div className="md:w-64 h-48 md:h-auto overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="flex-1">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-foreground mb-2">{event.title}</CardTitle>
                        <Badge 
                          variant={getEventBadgeVariant(event.type)}
                          className="flex items-center gap-1 w-fit"
                        >
                          {getEventIcon(event.type)}
                          {event.type}
                        </Badge>
                      </div>
                      {event.photos && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Camera className="w-3 h-3" />
                          {event.photos} photos
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-family-warm" />
                        <span>{event.date}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-family-warm" />
                        <span>{event.time}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-family-warm" />
                        <span>{event.location}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-family-warm" />
                        <span>{event.attendees.join(", ")}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-foreground">{event.description}</p>
                    
                    <div className="flex gap-2 pt-2">
                      <Button variant="cream" size="sm">
                        <Camera className="w-4 h-4 mr-1" />
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
      </section>

      {/* Add Event Button */}
      <div className="text-center mt-12">
        <Button 
          variant="warm" 
          size="lg"
          onClick={() => {
            // In a real app, this would open an event creation form
            alert("Add new event feature coming soon!");
          }}
        >
          <Calendar className="w-5 h-5 mr-2" />
          Add New Event
        </Button>
      </div>
    </Layout>
  );
};

export default Events;