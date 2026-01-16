import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Request, RequestType, IssueCategory, ExceptionType, TrainingLevel, RequestStatus } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { activityLogger } from '@/lib/activityLogger';

export function useMyRequests() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-requests', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Request[];
    },
    enabled: !!user,
  });
}

export function useAllRequests() {
  return useQuery({
    queryKey: ['all-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Request[];
    },
  });
}

export function useResolvedRequests() {
  return useQuery({
    queryKey: ['resolved-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('requests')
        .select('id, title, request_type, issue_category, exception_type, training_level, admin_response, created_at')
        .eq('status', 'resolved')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

interface CreateRequestInput {
  request_type: RequestType;
  issue_category?: IssueCategory;
  exception_type?: ExceptionType;
  training_level: TrainingLevel;
  affected_activity?: string;
  title: string;
  description: string;
}

export function useCreateRequest() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateRequestInput) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('requests')
        .insert({
          student_id: user.id,
          ...input,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-requests'] });
      toast.success('Request submitted successfully');
    },
    onError: (error) => {
      toast.error('Failed to submit request: ' + error.message);
    },
  });
}

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      requestId, 
      status, 
      adminResponse,
      oldStatus,
    }: { 
      requestId: string; 
      status: RequestStatus; 
      adminResponse?: string;
      oldStatus?: RequestStatus;
    }) => {
      const updateData: Partial<Request> = { status };
      if (adminResponse !== undefined) {
        updateData.admin_response = adminResponse;
      }

      const { data, error } = await supabase
        .from('requests')
        .update(updateData)
        .eq('id', requestId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Log status update if status changed
      if (oldStatus && oldStatus !== status) {
        await activityLogger.statusUpdated(requestId, oldStatus, status);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-requests'] });
      queryClient.invalidateQueries({ queryKey: ['my-requests'] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
      toast.success('Request updated');
    },
    onError: (error) => {
      toast.error('Failed to update request: ' + error.message);
    },
  });
}
