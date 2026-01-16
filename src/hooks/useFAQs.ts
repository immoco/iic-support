import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FAQ, IssueCategory } from '@/types/database';
import { toast } from 'sonner';
import { activityLogger } from '@/lib/activityLogger';

export function useFAQs() {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('category')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as FAQ[];
    },
    // Cache for 5 minutes to reduce DB hits
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useActiveFAQs() {
  return useQuery({
    queryKey: ['active-faqs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('active', true)
        .order('category');
      
      if (error) throw error;
      return data as FAQ[];
    },
    // Cache for 5 minutes to reduce DB hits
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useMatchingFAQs(category: IssueCategory | null, titleKeywords: string) {
  const { data: faqs } = useActiveFAQs();

  if (!faqs || !category) return [];

  const keywords = titleKeywords.toLowerCase().split(/\s+/).filter(w => w.length > 2);

  return faqs.filter(faq => {
    // Must match category
    if (faq.category !== category) return false;

    // Check if any keywords match
    if (keywords.length === 0) return true;

    const faqText = `${faq.question} ${faq.answer} ${faq.keywords.join(' ')}`.toLowerCase();
    return keywords.some(keyword => faqText.includes(keyword));
  }).slice(0, 5); // Limit to 5 suggestions
}

interface CreateFAQInput {
  category: IssueCategory;
  question: string;
  answer: string;
  keywords?: string[];
}

export function useCreateFAQ() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateFAQInput) => {
      const { data, error } = await supabase
        .from('faqs')
        .insert(input)
        .select()
        .single();
      
      if (error) throw error;
      
      // Log FAQ creation
      await activityLogger.faqCreated(data.id, data.question);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      queryClient.invalidateQueries({ queryKey: ['active-faqs'] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
      toast.success('FAQ created');
    },
    onError: (error) => {
      toast.error('Failed to create FAQ: ' + error.message);
    },
  });
}

export function useUpdateFAQ() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FAQ> & { id: string }) => {
      const { data, error } = await supabase
        .from('faqs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Log FAQ update
      await activityLogger.faqEdited(id, updates);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      queryClient.invalidateQueries({ queryKey: ['active-faqs'] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
      toast.success('FAQ updated');
    },
    onError: (error) => {
      toast.error('Failed to update FAQ: ' + error.message);
    },
  });
}

export function useDeleteFAQ() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, question }: { id: string; question: string }) => {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Log FAQ deletion
      await activityLogger.faqDeleted(id, question);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      queryClient.invalidateQueries({ queryKey: ['active-faqs'] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
      toast.success('FAQ deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete FAQ: ' + error.message);
    },
  });
}
