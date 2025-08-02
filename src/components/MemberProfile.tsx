import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Camera,
  Users,
  ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PhotoGrid from './PhotoGrid';

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  birthday: string;
  location: string;
  bio: string;
  image: string;
  email?: string;
  phone?: string;
  favoriteMemory: string;
  photos?: Array<{
    id: string;
    src: string;
    alt: string;
    title?: string;
  }>;
}

interface MemberProfileProps {
  member: FamilyMember;
  onClose: () => void;
}

const MemberProfile = ({ member, onClose }: MemberProfileProps) => {
  const [activeTab, setActiveTab] = useState<'about' | 'photos' | 'memories'>(
    'about'
  );

  // Sample photos for the member (in a real app, these would come from the database)
  const memberPhotos = member.photos || [
    {
      id: '1',
      src: member.image,
      alt: `${member.name} portrait`,
      title: 'Portrait',
    },
    {
      id: '2',
      src: member.image,
      alt: `${member.name} with family`,
      title: 'With Family',
    },
    {
      id: '3',
      src: member.image,
      alt: `${member.name} celebration`,
      title: 'Celebration',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-family-cream to-white">
      {/* Header */}
      <div className="relative h-64 overflow-hidden bg-gradient-warm">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover rounded-full border-4 border-white/30"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-family-warm rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">{member.name}</h1>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {member.role}
            </Badge>
          </div>
        </div>

        {/* Back Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 text-white hover:bg-white/20"
          onClick={onClose}
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
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2 text-family-warm" />
                  <span>Born: {member.birthday}</span>
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2 text-family-warm" />
                  <span>{member.location}</span>
                </div>

                {member.email && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 mr-2 text-family-warm" />
                    <span>{member.email}</span>
                  </div>
                )}

                {member.phone && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 mr-2 text-family-warm" />
                    <span>{member.phone}</span>
                  </div>
                )}

                <div className="pt-4">
                  <h4 className="font-semibold mb-2">Biography</h4>
                  <p className="text-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                <div className="bg-family-cream/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-family-brown">
                    Favorite Memory
                  </h4>
                  <p className="text-foreground italic">
                    "{member.favoriteMemory}"
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-family-warm">12</div>
                  <div className="text-sm text-muted-foreground">Photos</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-family-warm">8</div>
                  <div className="text-sm text-muted-foreground">Events</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-family-warm">5</div>
                  <div className="text-sm text-muted-foreground">Memories</div>
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
            <PhotoGrid photos={memberPhotos} />
          </div>
        )}

        {activeTab === 'memories' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Special Memories
              </h2>
              <p className="text-muted-foreground">
                Cherished moments and stories about {member.name}
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-family-warm rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        First Family Trip
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Summer 2020
                      </p>
                      <p className="text-foreground mt-2">
                        Our first big family vacation together. {member.name}{' '}
                        was so excited to see the ocean for the first time!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-family-gold rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        Graduation Day
                      </h4>
                      <p className="text-sm text-muted-foreground">June 2023</p>
                      <p className="text-foreground mt-2">
                        Watching {member.name} walk across the stage was one of
                        the proudest moments of our lives.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-family-brown rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        Sunday Dinners
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Every Sunday
                      </p>
                      <p className="text-foreground mt-2">
                        Our weekly tradition where {member.name} always helps
                        set the table and tells us about their week.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberProfile;
