import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Calendar, MapPin, Mail, Phone, User } from 'lucide-react';
import { dataService } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type FamilyMember = Database['public']['Tables']['family_members']['Row'];

const Members = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load family members from Supabase
  useEffect(() => {
    const loadMembers = async () => {
      setLoading(true);
      try {
        const membersData = await dataService.getFamilyMembers();
        setFamilyMembers(membersData);
      } catch (error) {
        console.error('Error loading family members:', error);
        toast({
          title: 'Error',
          description: 'Failed to load family members. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [toast]);

  const handleViewProfile = (member: FamilyMember) => {
    // Navigate to a separate profile page
    navigate(`/members/${member.id}`, { state: { member } });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading family members...</p>
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
            Our Family
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Meet the amazing people who make our family special. Each person
            brings their own unique personality, talents, and love to our
            close-knit family.
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
                  <div className="w-full h-full bg-gradient-warm rounded-full border-4 border-family-cream group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                    {member.avatar_url ? (
                      <img
                        src={member.avatar_url}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User className="w-12 h-12 text-white" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-family-warm rounded-full flex items-center justify-center">
                    <Heart className="w-3 h-3 text-white" />
                  </div>
                </div>
                <CardTitle className="text-center">
                  <h3 className="text-xl font-bold text-foreground">
                    {member.name}
                  </h3>
                  <Badge variant="secondary" className="mt-2">
                    {member.relationship || 'Family Member'}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Birthday */}
                {member.birthday && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2 text-family-warm" />
                    <span>
                      {new Date(member.birthday).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {/* Bio */}
                {member.bio && (
                  <p className="text-sm text-foreground leading-relaxed">
                    {member.bio}
                  </p>
                )}

                {/* Fun Facts */}
                {member.fun_facts && member.fun_facts.length > 0 && (
                  <div className="bg-family-cream/50 rounded-lg p-3">
                    <p className="text-xs font-medium text-family-brown mb-1">
                      Fun Facts:
                    </p>
                    <ul className="text-sm text-foreground">
                      {member.fun_facts.map((fact, index) => (
                        <li key={index} className="text-xs">
                          • {fact}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* View Profile Button */}
                <Button
                  variant="family"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => handleViewProfile(member)}
                >
                  <User className="w-4 h-4 mr-2" />
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
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Family at a Glance
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-2xl font-bold text-family-warm">
                    {familyMembers.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Members</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-family-warm">
                    {new Set(familyMembers.map((m) => m.relationship)).size}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Relationships
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-family-warm">
                    {familyMembers.filter((m) => m.birthday).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Birthdays</div>
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
