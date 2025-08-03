import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type FamilyMember = Database['public']['Tables']['family_members']['Row'];
type FamilyEvent = Database['public']['Tables']['family_events']['Row'];
type FamilyPhoto = Database['public']['Tables']['family_photos']['Row'];
type FamilyPost = Database['public']['Tables']['family_posts']['Row'];
type PhotoCategory = Database['public']['Tables']['photo_categories']['Row'];
type FamilyMemory = Database['public']['Tables']['family_memories']['Row'];

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

  async getFamilyMemberById(id: string): Promise<FamilyMember | null> {
    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching family member:', error);
      return null;
    }

    return data;
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

  async associatePhotoWithMembers(photoId: string, memberIds: string[]): Promise<boolean> {
    if (memberIds.length === 0) return true;

    const associations = memberIds.map(memberId => ({
      photo_id: photoId,
      member_id: memberId
    }));

    const { error } = await supabase
      .from('photo_members')
      .insert(associations);

    if (error) {
      console.error('Error associating photo with members:', error);
      return false;
    }

    return true;
  },

  async getPhotosForMember(memberId: string): Promise<PhotoWithCategory[]> {
    const { data, error } = await supabase
      .from('photo_members')
      .select(`
        family_photos!inner(
          *,
          category:photo_categories(*)
        )
      `)
      .eq('member_id', memberId);

    if (error) {
      console.error('Error fetching photos for member:', error);
      return [];
    }

    return data?.map(item => item.family_photos).filter(Boolean) || [];
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

  // Family Memories
  async getMemoriesForMember(memberId: string): Promise<FamilyMemory[]> {
    const { data, error } = await supabase
      .from('family_memories')
      .select('*')
      .eq('member_id', memberId)
      .order('memory_date', { ascending: false });

    if (error) {
      console.error('Error fetching memories for member:', error);
      return [];
    }

    return data || [];
  },

  async createMemory(
    memory: Database['public']['Tables']['family_memories']['Insert']
  ): Promise<FamilyMemory | null> {
    const { data, error } = await supabase
      .from('family_memories')
      .insert(memory)
      .select()
      .single();

    if (error) {
      console.error('Error creating memory:', error);
      return null;
    }

    return data;
  },

  async updateMemory(
    id: string,
    updates: Database['public']['Tables']['family_memories']['Update']
  ): Promise<FamilyMemory | null> {
    const { data, error } = await supabase
      .from('family_memories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating memory:', error);
      return null;
    }

    return data;
  },

  async deleteMemory(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('family_memories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting memory:', error);
      return false;
    }

    return true;
  },
};
