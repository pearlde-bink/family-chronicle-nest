import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type FamilyMember = Database['public']['Tables']['family_members']['Row'];
type FamilyEvent = Database['public']['Tables']['family_events']['Row'];
type FamilyPhoto = Database['public']['Tables']['family_photos']['Row'];
type FamilyPost = Database['public']['Tables']['family_posts']['Row'];
type PhotoCategory = Database['public']['Tables']['photo_categories']['Row'];

export interface PhotoWithCategory extends FamilyPhoto {
  category?: PhotoCategory;
}

export interface EventWithPhotos extends FamilyEvent {
  photoDetails?: PhotoWithCategory[];
}

export const dataService = {
  // Family Members
  async getFamilyMembers(): Promise<FamilyMember[]> {
    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching family members:', error);
      return [];
    }

    return data || [];
  },

  async createFamilyMember(
    member: Database['public']['Tables']['family_members']['Insert']
  ): Promise<FamilyMember | null> {
    const { data, error } = await supabase
      .from('family_members')
      .insert(member)
      .select()
      .single();

    if (error) {
      console.error('Error creating family member:', error);
      return null;
    }

    return data;
  },

  async updateFamilyMember(
    id: string,
    updates: Database['public']['Tables']['family_members']['Update']
  ): Promise<FamilyMember | null> {
    const { data, error } = await supabase
      .from('family_members')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating family member:', error);
      return null;
    }

    return data;
  },

  // Family Events
  async getFamilyEvents(): Promise<EventWithPhotos[]> {
    const { data, error } = await supabase
      .from('family_events')
      .select('*')
      .order('event_date', { ascending: false });

    if (error) {
      console.error('Error fetching family events:', error);
      return [];
    }

    return data || [];
  },

  async createFamilyEvent(
    event: Database['public']['Tables']['family_events']['Insert']
  ): Promise<FamilyEvent | null> {
    const { data, error } = await supabase
      .from('family_events')
      .insert(event)
      .select()
      .single();

    if (error) {
      console.error('Error creating family event:', error);
      return null;
    }

    return data;
  },

  // Family Photos
  async getFamilyPhotos(): Promise<PhotoWithCategory[]> {
    const { data, error } = await supabase
      .from('family_photos')
      .select(
        `
        *,
        category:photo_categories(*)
      `
      )
      .order('taken_date', { ascending: false });

    if (error) {
      console.error('Error fetching family photos:', error);
      return [];
    }

    return data || [];
  },

  async createFamilyPhoto(
    photo: Database['public']['Tables']['family_photos']['Insert']
  ): Promise<FamilyPhoto | null> {
    const { data, error } = await supabase
      .from('family_photos')
      .insert(photo)
      .select()
      .single();

    if (error) {
      console.error('Error creating family photo:', error);
      return null;
    }

    return data;
  },

  async uploadPhotoToStorage(file: File, path: string): Promise<string | null> {
    const { data, error } = await supabase.storage
      .from('family-photos')
      .upload(path, file);

    if (error) {
      console.error('Error uploading photo:', error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('family-photos')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  },

  // Photo Categories
  async getPhotoCategories(): Promise<PhotoCategory[]> {
    const { data, error } = await supabase
      .from('photo_categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching photo categories:', error);
      return [];
    }

    return data || [];
  },

  // Family Posts
  async getFamilyPosts(): Promise<FamilyPost[]> {
    const { data, error } = await supabase
      .from('family_posts')
      .select('*')
      .order('post_date', { ascending: false });

    if (error) {
      console.error('Error fetching family posts:', error);
      return [];
    }

    return data || [];
  },

  async createFamilyPost(
    post: Database['public']['Tables']['family_posts']['Insert']
  ): Promise<FamilyPost | null> {
    const { data, error } = await supabase
      .from('family_posts')
      .insert(post)
      .select()
      .single();

    if (error) {
      console.error('Error creating family post:', error);
      return null;
    }

    return data;
  },
};
