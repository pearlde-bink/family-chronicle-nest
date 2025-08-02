import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import PhotoGrid from '@/components/PhotoGrid';
import PhotoModal from '@/components/PhotoModal';
import UploadPhoto from '@/components/UploadPhoto';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Calendar, Users, MapPin, Plus } from 'lucide-react';
import { dataService, PhotoWithCategory } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

const Photos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoWithCategory | null>(
    null
  );
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [photos, setPhotos] = useState<PhotoWithCategory[]>([]);
  const [categories, setCategories] = useState<
    Database['public']['Tables']['photo_categories']['Row'][]
  >([]);
  const [familyMembers, setFamilyMembers] = useState<
    Database['public']['Tables']['family_members']['Row'][]
  >([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load photos and categories from Supabase
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [photosData, categoriesData, membersData] = await Promise.all([
          dataService.getFamilyPhotos(),
          dataService.getPhotoCategories(),
          dataService.getFamilyMembers(),
        ]);
        setPhotos(photosData);
        setCategories(categoriesData);
        setFamilyMembers(membersData);
      } catch (error) {
        console.error('Error loading photos:', error);
        toast({
          title: 'Error',
          description: 'Failed to load photos. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Filter photos based on search and category
  const filteredPhotos = photos.filter((photo) => {
    const matchesSearch =
      photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (photo.location &&
        photo.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (photo.description &&
        photo.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'all' || photo.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePhotoClick = (photo: PhotoWithCategory) => {
    const index = filteredPhotos.findIndex((p) => p.id === photo.id);
    setCurrentPhotoIndex(index);
    setSelectedPhoto(photo);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    let newIndex;
    if (direction === 'prev') {
      newIndex =
        currentPhotoIndex > 0
          ? currentPhotoIndex - 1
          : filteredPhotos.length - 1;
    } else {
      newIndex =
        currentPhotoIndex < filteredPhotos.length - 1
          ? currentPhotoIndex + 1
          : 0;
    }
    setCurrentPhotoIndex(newIndex);
    setSelectedPhoto(filteredPhotos[newIndex]);
  };

  const handleUpload = async (photoData: {
    file: File;
    title: string;
    description: string;
    category: string;
    date: string;
    location: string;
    people: string[];
  }) => {
    try {
      // Upload file to Supabase storage
      const fileName = `${Date.now()}-${photoData.file.name}`;
      const imageUrl = await dataService.uploadPhotoToStorage(
        photoData.file,
        fileName
      );

      if (!imageUrl) {
        throw new Error('Failed to upload image');
      }

      // Save photo metadata to database
      const newPhoto = await dataService.createFamilyPhoto({
        title: photoData.title,
        description: photoData.description,
        image_url: imageUrl,
        location: photoData.location,
        taken_date: photoData.date,
        tags: photoData.people,
        category_id:
          photoData.category && photoData.category !== 'all'
            ? photoData.category
            : null,
        featured: false,
      });

      if (newPhoto) {
        // Refresh photos list
        const updatedPhotos = await dataService.getFamilyPhotos();
        setPhotos(updatedPhotos);

        toast({
          title: 'Success!',
          description: 'Photo uploaded successfully.',
        });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload photo. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setShowUploadModal(false);
    }
  };

  // Convert database photos to display format
  const displayPhotos = filteredPhotos.map((photo) => ({
    id: photo.id,
    src: photo.image_url,
    alt: photo.title,
    title: photo.title,
    description: photo.description,
    date: photo.taken_date,
    location: photo.location,
    people: photo.tags || [],
    category: photo.category?.name || 'Uncategorized',
  }));

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading photos...</p>
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
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Family Photos
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our precious memories captured through the years. From holidays and
            birthdays to everyday moments that make our family special.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search photos, locations, events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="warm"
              size="lg"
              onClick={() => setShowUploadModal(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Photo
            </Button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'family' : 'cream'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
              className="flex items-center gap-2"
            >
              <Filter className="w-3 h-3" />
              All Photos
              <Badge variant="secondary" className="ml-1 text-xs">
                {photos.length}
              </Badge>
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'family' : 'cream'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <Filter className="w-3 h-3" />
                {category.name}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {photos.filter((p) => p.category_id === category.id).length}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredPhotos.length} of {photos.length} photos
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
                  onClick={() => handlePhotoClick(photo)}
                >
                  <div className="relative overflow-hidden rounded-lg bg-gradient-photo hover:shadow-photo transition-all duration-300">
                    <img
                      src={photo.image_url}
                      alt={photo.title}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-semibold mb-1">{photo.title}</h3>
                        {photo.taken_date && (
                          <div className="flex items-center text-xs mb-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(photo.taken_date).toLocaleDateString()}
                          </div>
                        )}
                        {photo.location && (
                          <div className="flex items-center text-xs mb-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {photo.location}
                          </div>
                        )}
                        {photo.tags && photo.tags.length > 0 && (
                          <div className="flex items-center text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            {photo.tags.join(', ')}
                          </div>
                        )}
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
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No photos found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>

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

        {/* Upload Modal */}
        {showUploadModal && (
          <UploadPhoto
            onClose={() => setShowUploadModal(false)}
            onUpload={handleUpload}
            categories={categories}
            familyMembers={familyMembers}
          />
        )}
      </Layout>
    </ProtectedRoute>
  );
};

export default Photos;
