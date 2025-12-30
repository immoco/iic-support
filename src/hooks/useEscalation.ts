import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Escalation } from '@/types/database';
import { ESCALATION_COOLDOWN_MS, MAX_PRIORITY } from '@/lib/constants';
import { toast } from 'sonner';

export function useRequestEscalations(requestId: string) {
  return useQuery({
    queryKey: ['escalations', requestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('escalations')
        .select('*')
        .eq('request_id', requestId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Escalation[];
    },
    enabled: !!requestId,
  });
}

export function useCanEscalate(requestId: string, currentPriority: number, status: string) {
  const { data: escalations } = useRequestEscalations(requestId);
  
  if (currentPriority >= MAX_PRIORITY) return { canEscalate: false, reason: 'Maximum priority reached' };
  if (['approved', 'rejected', 'resolved'].includes(status)) {
    return { canEscalate: false, reason: 'Request is closed' };
  }
  
  if (escalations && escalations.length > 0) {
    const lastEscalation = new Date(escalations[0].created_at);
    const timeSince = Date.now() - lastEscalation.getTime();
    
    if (timeSince < ESCALATION_COOLDOWN_MS) {
      const minutesLeft = Math.ceil((ESCALATION_COOLDOWN_MS - timeSince) / 60000);
      return { canEscalate: false, reason: `Wait ${minutesLeft} minutes before next escalation` };
    }
  }
  
  return { canEscalate: true, reason: null };
}

export function useEscalateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, reason }: { requestId: string; reason: string }) => {
      // First, create escalation record
      const { error: escalationError } = await supabase
        .from('escalations')
        .insert({ request_id: requestId, reason });
      
      if (escalationError) throw escalationError;

      // Then, increment priority using a raw query approach
      const { data: currentRequest, error: fetchError } = await supabase
        .from('requests')
        .select('priority')
        .eq('id', requestId)
        .single();
      
      if (fetchError) throw fetchError;

      const newPriority = Math.min((currentRequest?.priority || 1) + 1, MAX_PRIORITY);
      
      const { error: updateError } = await supabase
        .from('requests')
        .update({ priority: newPriority })
        .eq('id', requestId);
      
      if (updateError) throw updateError;

      return { newPriority };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['my-requests'] });
      queryClient.invalidateQueries({ queryKey: ['escalations'] });
      toast.success(`Priority escalated to ${data.newPriority}`);
    },
    onError: (error) => {
      toast.error('Failed to escalate: ' + error.message);
    },
  });
}
