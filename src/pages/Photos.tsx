import { useState } from "react";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import PhotoGrid from "@/components/PhotoGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar, Users, MapPin } from "lucide-react";
import familyHero from "@/assets/family-hero.jpg";
import familyGrid from "@/assets/family-grid.jpg";

const Photos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Sample photo categories
  const categories = [
    { id: "all", name: "All Photos", count: 42 },
    { id: "holidays", name: "Holidays", count: 12 },
    { id: "birthdays", name: "Birthdays", count: 8 },
    { id: "vacations", name: "Vacations", count: 15 },
    { id: "gatherings", name: "Family Gatherings", count: 7 }
  ];

  // Sample photos with metadata
  const allPhotos = [
    { 
      id: "1", 
      src: familyHero, 
      alt: "Chinese New Year 2024", 
      title: "Chinese New Year 2024",
      category: "holidays",
      date: "February 10, 2024",
      location: "San Francisco, CA",
      people: ["Eleanor", "David", "Maria", "Sophie", "Alex"]
    },
    { 
      id: "2", 
      src: familyGrid, 
      alt: "Sophie's Birthday Party", 
      title: "Sophie's 14th Birthday",
      category: "birthdays",
      date: "April 10, 2024",
      location: "Home",
      people: ["Sophie", "Family"]
    },
    { 
      id: "3", 
      src: familyHero, 
      alt: "Summer Vacation 2024", 
      title: "Yellowstone Adventure",
      category: "vacations",
      date: "July 15, 2024",
      location: "Yellowstone National Park",
      people: ["James", "David", "Maria", "Sophie", "Alex"]
    },
    { 
      id: "4", 
      src: familyGrid, 
      alt: "Thanksgiving Dinner", 
      title: "Thanksgiving 2023",
      category: "holidays",
      date: "November 23, 2023",
      location: "Eleanor's House",
      people: ["Everyone"]
    },
    { 
      id: "5", 
      src: familyHero, 
      alt: "Beach Day", 
      title: "Family Beach Day",
      category: "vacations",
      date: "August 5, 2024",
      location: "Santa Cruz, CA",
      people: ["David", "Maria", "Sophie", "Alex"]
    },
    { 
      id: "6", 
      src: familyGrid, 
      alt: "Eleanor's Garden", 
      title: "Grandma's Garden",
      category: "gatherings",
      date: "May 20, 2024",
      location: "Eleanor's Backyard",
      people: ["Eleanor", "Sophie"]
    },
    { 
      id: "7", 
      src: familyHero, 
      alt: "Christmas Morning", 
      title: "Christmas Morning 2023",
      category: "holidays",
      date: "December 25, 2023",
      location: "Home",
      people: ["Everyone"]
    },
    { 
      id: "8", 
      src: familyGrid, 
      alt: "Alex's Soccer Game", 
      title: "Soccer Championship",
      category: "gatherings",
      date: "September 15, 2024",
      location: "Local Soccer Field",
      people: ["Alex", "David", "Maria"]
    },
    { 
      id: "9", 
      src: familyHero, 
      alt: "David's Birthday", 
      title: "Dad's 49th Birthday",
      category: "birthdays",
      date: "July 22, 2024",
      location: "Restaurant",
      people: ["David", "Maria", "Sophie", "Alex", "Eleanor"]
    }
  ];

  // Filter photos based on search and category
  const filteredPhotos = allPhotos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || photo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <ProtectedRoute>
      <Layout>
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Family Photos</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Our precious memories captured through the years. From holidays and birthdays to 
          everyday moments that make our family special.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4 animate-fade-in">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search photos, locations, events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "family" : "cream"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <Filter className="w-3 h-3" />
              {category.name}
              <Badge variant="secondary" className="ml-1 text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Results Counter */}
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredPhotos.length} of {allPhotos.length} photos
        </p>
      </div>

      {/* Photo Grid */}
      <div className="mb-8">
        {filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo, index) => (
              <div 
                key={photo.id} 
                className="group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => {
                  // In a real app, this would open a photo modal/lightbox
                  alert(`View ${photo.title} in full size`);
                }}
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
                      <div className="flex items-center text-xs mb-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {photo.date}
                      </div>
                      <div className="flex items-center text-xs mb-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {photo.location}
                      </div>
                      <div className="flex items-center text-xs">
                        <Users className="w-3 h-3 mr-1" />
                        {photo.people.join(", ")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No photos found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div className="text-center">
        <Button 
          variant="warm" 
          size="lg"
          onClick={() => {
            // In a real app, this would open an upload modal
            alert("Upload new photos feature coming soon!");
          }}
        >
          Add New Photos
        </Button>
      </div>
    </Layout>
    </ProtectedRoute>
  );
};

export default Photos;