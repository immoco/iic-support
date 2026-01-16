import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Announcement } from '@/types/database';
import { toast } from 'sonner';
import { activityLogger } from '@/lib/activityLogger';

export function useAnnouncements() {
  return useQuery({
    queryKey: ['announcements-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Announcement[];
    },
    // Cache for 5 minutes to reduce DB hits
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

interface CreateAnnouncementInput {
  title: string;
  body: string;
  display_order?: number;
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateAnnouncementInput) => {
      const { data, error } = await supabase
        .from('announcements')
        .insert(input)
        .select()
        .single();
      
      if (error) throw error;
      
      // Log announcement creation
      await activityLogger.announcementCreated(data.id, data.title);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcements-admin'] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
      toast.success('Announcement created');
    },
    onError: (error) => {
      toast.error('Failed to create announcement: ' + error.message);
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Announcement> & { id: string }) => {
      const { data, error } = await supabase
        .from('announcements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Log announcement update
      await activityLogger.announcementUpdated(id, updates);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcements-admin'] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
      toast.success('Announcement updated');
    },
    onError: (error) => {
      toast.error('Failed to update announcement: ' + error.message);
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Log announcement deletion
      await activityLogger.announcementDeleted(id, title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcements-admin'] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
      toast.success('Announcement deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete announcement: ' + error.message);
    },
  });
}
