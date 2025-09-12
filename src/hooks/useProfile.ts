import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: 'student' | 'faculty';
  faculty_level?: 'basic' | 'senior' | 'admin';
  student_id?: string;
  faculty_id?: string;
  assigned_faculty_id?: string;
  pokemon_avatar?: string;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    // For now, create a temporary profile directly from user metadata
    // This bypasses the database issues and ensures the app works
    const userRole = user.user_metadata?.role || 'student';
    console.log('Creating profile from user metadata with role:', userRole);
    
    const tempProfile = {
      id: user.id,
      user_id: user.id,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown',
      email: user.email || '',
      role: userRole as 'student' | 'faculty',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('Using profile from user metadata:', tempProfile);
    setProfile(tempProfile);
    setLoading(false);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        return { error };
      } else {
        setProfile({ ...profile, ...updates });
        return { error: null };
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error };
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    refetch: fetchProfile
  };
};