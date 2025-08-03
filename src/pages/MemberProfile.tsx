import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Heart,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Users,
  Camera,
  ArrowLeft,
  User,
  Edit,
  Plus,
  Trash2,
  Star,
} from 'lucide-react';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';
import { dataService } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type FamilyMember = Database['public']['Tables']['family_members']['Row'];
type FamilyPhoto = Database['public']['Tables']['family_photos']['Row'];
type FamilyMemory = Database['public']['Tables']['family_memories']['Row'];

const MemberProfile = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [member, setMember] = useState<FamilyMember | null>(
    location.state?.member || null
  );
  const [photos, setPhotos] = useState<FamilyPhoto[]>([]);
  const [memories, setMemories] = useState<FamilyMemory[]>([]);
  const [loading, setLoading] = useState(!member);
  const [activeTab, setActiveTab] = useState<'about' | 'photos' | 'memories'>(
    'about'
  );
  const [showEditForm, setShowEditForm] = useState(false);
  const [editForm, setEditForm] = useState<Partial<FamilyMember>>({});
  const [showProfilePictureUpload, setShowProfilePictureUpload] = useState(false);
  const [showMemoryForm, setShowMemoryForm] = useState(false);
  const [editingMemory, setEditingMemory] = useState<FamilyMemory | null>(null);
  const [memoryForm, setMemoryForm] = useState({
    title: '',
    content: '',
    memory_date: '',
    location: '',
    is_favorite: false,
  });

  useEffect(() => {
    const loadMemberData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // If we don't have member data, fetch it
        if (!member) {
          const foundMember = await dataService.getFamilyMemberById(id);
          if (foundMember) {
            setMember(foundMember);
          } else {
            throw new Error('Member not found');
          }
        }

        // Load photos for this member
        const memberPhotos = await dataService.getPhotosForMember(id);
        setPhotos(memberPhotos);

        // Load memories for this member
        const memberMemories = await dataService.getMemoriesForMember(id);
        setMemories(memberMemories);
      } catch (error) {
        console.error('Error loading member data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load member data. Please try again.',
          variant: 'destructive',
        });
        navigate('/members');
      } finally {
        setLoading(false);
      }
    };

    loadMemberData();
  }, [id, member, navigate, toast]);

  const handleEditClick = () => {
    setEditForm({
      name: member?.name || '',
      relationship: member?.relationship || '',
      birthday: member?.birthday || '',
      bio: member?.bio || '',
      fun_facts: member?.fun_facts || [],
    });
    setShowEditForm(true);
  };

  const handleSaveEdit = async () => {
    if (!member) return;

    try {
      const updatedMember = await dataService.updateFamilyMember(
        member.id,
        editForm
      );
      if (updatedMember) {
        setMember(updatedMember);
        setShowEditForm(false);
        toast({
          title: 'Success!',
          description: 'Member information updated successfully.',
        });
      }
    } catch (error) {
      console.error('Error updating member:', error);
      toast({
        title: 'Error',
        description: 'Failed to update member information. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAddMemory = () => {
    setMemoryForm({
      title: '',
      content: '',
      memory_date: '',
      location: '',
      is_favorite: false,
    });
    setEditingMemory(null);
    setShowMemoryForm(true);
  };

  const handleEditMemory = (memory: FamilyMemory) => {
    setMemoryForm({
      title: memory.title,
      content: memory.content,
      memory_date: memory.memory_date || '',
      location: memory.location || '',
      is_favorite: memory.is_favorite || false,
    });
    setEditingMemory(memory);
    setShowMemoryForm(true);
  };

  const handleSaveMemory = async () => {
    if (!member) return;

    try {
      if (editingMemory) {
        // Update existing memory
        const updatedMemory = await dataService.updateMemory(editingMemory.id, {
          ...memoryForm,
          memory_date: memoryForm.memory_date || null,
          location: memoryForm.location || null,
        });
        if (updatedMemory) {
          setMemories(memories.map(m => 
            m.id === updatedMemory.id ? updatedMemory : m
          ));
        }
      } else {
        // Create new memory
        const newMemory = await dataService.createMemory({
          ...memoryForm,
          member_id: member.id,
          memory_date: memoryForm.memory_date || null,
          location: memoryForm.location || null,
        });
        if (newMemory) {
          setMemories([newMemory, ...memories]);
        }
      }
      
      setShowMemoryForm(false);
      toast({
        title: 'Success!',
        description: `Memory ${editingMemory ? 'updated' : 'created'} successfully.`,
      });
    } catch (error) {
      console.error('Error saving memory:', error);
      toast({
        title: 'Error',
        description: 'Failed to save memory. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteMemory = async (memoryId: string) => {
    try {
      const success = await dataService.deleteMemory(memoryId);
      if (success) {
        setMemories(memories.filter(m => m.id !== memoryId));
        toast({
          title: 'Success!',
          description: 'Memory deleted successfully.',
        });
      }
    } catch (error) {
      console.error('Error deleting memory:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete memory. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!member) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Member Not Found
              </h2>
              <p className="text-muted-foreground mb-4">
                The family member you're looking for doesn't exist.
              </p>
              <Button onClick={() => navigate('/members')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Family
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
              <div className="relative w-32 h-32 mx-auto mb-4">
                {member.avatar_url ? (
                  <img
                    src={member.avatar_url}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full border-4 border-white/30"
                  />
                 ) : (
                   <div className="w-full h-full bg-white/20 rounded-full border-4 border-white/30 flex items-center justify-center">
                     <User className="w-16 h-16 text-white" />
                   </div>
                 )}
                 <button
                   onClick={() => setShowProfilePictureUpload(true)}
                   className="absolute -bottom-2 -right-2 w-8 h-8 bg-family-warm rounded-full flex items-center justify-center hover:bg-family-warm/80 transition-colors"
                   title="Change profile picture"
                 >
                   <Camera className="w-4 h-4 text-white" />
                 </button>
              </div>
              <h1 className="text-3xl font-bold mb-2">{member.name}</h1>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {member.relationship || 'Family Member'}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="mt-4 text-white hover:bg-white/20"
                onClick={handleEditClick}
              >
                <Edit className="w-4 h-4 mr-2" />
                Update Info
              </Button>
            </div>
          </div>

          {/* Back Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 text-white hover:bg-white/20"
            onClick={() => navigate('/members')}
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
                { id: 'about', label: 'About', icon: Users },
                { id: 'photos', label: 'Photos', icon: Camera },
                { id: 'memories', label: 'Memories', icon: Heart },
              ].map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  variant={activeTab === id ? 'family' : 'ghost'}
                  size="sm"
                  onClick={() =>
                    setActiveTab(id as 'about' | 'photos' | 'memories')
                  }
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>About {member.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {member.birthday && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2 text-family-warm" />
                      <span>
                        Born: {new Date(member.birthday).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {member.bio && (
                    <div className="pt-4">
                      <h4 className="font-semibold mb-2">Biography</h4>
                      <p className="text-foreground leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  )}

                  {member.fun_facts && member.fun_facts.length > 0 && (
                    <div className="bg-family-cream/50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 text-family-brown">
                        Fun Facts
                      </h4>
                      <ul className="text-foreground space-y-1">
                        {member.fun_facts.map((fact, index) => (
                          <li key={index} className="text-sm">
                            • {fact}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
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
                    <div className="text-2xl font-bold text-family-warm">0</div>
                    <div className="text-sm text-muted-foreground">Events</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-family-warm">
                      {member.fun_facts?.length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Fun Facts
                    </div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-family-warm">∞</div>
                    <div className="text-sm text-muted-foreground">Love</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Photos of {member.name}
                </h2>
                <p className="text-muted-foreground">
                  Special moments captured through the years
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
                    Photos of {member.name} will appear here when uploaded.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'memories' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <div className="text-center flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Special Memories
                  </h2>
                  <p className="text-muted-foreground">
                    Cherished moments and stories about {member.name}
                  </p>
                </div>
                <Button onClick={handleAddMemory} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Memory
                </Button>
              </div>

              {memories.length > 0 ? (
                <div className="space-y-4">
                  {memories.map((memory) => (
                    <Card key={memory.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 bg-family-warm rounded-full flex items-center justify-center flex-shrink-0">
                              {memory.is_favorite ? (
                                <Star className="w-6 h-6 text-white fill-current" />
                              ) : (
                                <Heart className="w-6 h-6 text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-foreground">
                                  {memory.title}
                                </h4>
                                {memory.is_favorite && (
                                  <Badge variant="secondary" className="text-xs">
                                    Favorite
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                {memory.memory_date && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(memory.memory_date).toLocaleDateString()}
                                  </div>
                                )}
                                {memory.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {memory.location}
                                  </div>
                                )}
                              </div>
                              <p className="text-foreground leading-relaxed">
                                {memory.content}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditMemory(memory)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMemory(memory.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No memories yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Start collecting precious memories about {member.name}.
                  </p>
                  <Button onClick={handleAddMemory}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Memory
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Edit Form Modal */}
        {showEditForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">
                  Update {member?.name}'s Information
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowEditForm(false)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={editForm.name || ''}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    placeholder="Enter name"
                  />
                </div>

                <div>
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input
                    id="relationship"
                    value={editForm.relationship || ''}
                    onChange={(e) =>
                      setEditForm({ ...editForm, relationship: e.target.value })
                    }
                    placeholder="e.g., Father, Mother, Son, Daughter"
                  />
                </div>

                <div>
                  <Label htmlFor="birthday">Birthday</Label>
                  <Input
                    id="birthday"
                    type="date"
                    value={editForm.birthday || ''}
                    onChange={(e) =>
                      setEditForm({ ...editForm, birthday: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Biography</Label>
                  <Textarea
                    id="bio"
                    value={editForm.bio || ''}
                    onChange={(e) =>
                      setEditForm({ ...editForm, bio: e.target.value })
                    }
                    placeholder="Tell us about this family member..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowEditForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit} className="flex-1">
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Picture Upload Modal */}
        {showProfilePictureUpload && member && (
          <ProfilePictureUpload
            memberId={member.id}
            currentAvatarUrl={member.avatar_url}
            memberName={member.name}
            onClose={() => setShowProfilePictureUpload(false)}
            onUploadSuccess={(newAvatarUrl) => {
              setMember({ ...member, avatar_url: newAvatarUrl });
              setShowProfilePictureUpload(false);
            }}
          />
        )}

        {/* Memory Form Modal */}
        {showMemoryForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">
                  {editingMemory ? 'Edit Memory' : 'Add New Memory'}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMemoryForm(false)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <Label htmlFor="memory-title">Title</Label>
                  <Input
                    id="memory-title"
                    value={memoryForm.title}
                    onChange={(e) =>
                      setMemoryForm({ ...memoryForm, title: e.target.value })
                    }
                    placeholder="Enter memory title"
                  />
                </div>

                <div>
                  <Label htmlFor="memory-content">Memory</Label>
                  <Textarea
                    id="memory-content"
                    value={memoryForm.content}
                    onChange={(e) =>
                      setMemoryForm({ ...memoryForm, content: e.target.value })
                    }
                    placeholder="Share this special memory..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="memory-date">Date</Label>
                    <Input
                      id="memory-date"
                      type="date"
                      value={memoryForm.memory_date}
                      onChange={(e) =>
                        setMemoryForm({ ...memoryForm, memory_date: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="memory-location">Location</Label>
                    <Input
                      id="memory-location"
                      value={memoryForm.location}
                      onChange={(e) =>
                        setMemoryForm({ ...memoryForm, location: e.target.value })
                      }
                      placeholder="Where did this happen?"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is-favorite"
                    checked={memoryForm.is_favorite}
                    onChange={(e) =>
                      setMemoryForm({ ...memoryForm, is_favorite: e.target.checked })
                    }
                    className="rounded"
                  />
                  <Label htmlFor="is-favorite">Mark as favorite memory</Label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowMemoryForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveMemory} className="flex-1">
                    {editingMemory ? 'Update Memory' : 'Save Memory'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </ProtectedRoute>
  );
};

export default MemberProfile;
