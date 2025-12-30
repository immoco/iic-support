import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Announcement } from '@/types/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export function AnnouncementsPanel() {
  const { data: announcements, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Announcement[];
    },
  });

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 w-40 bg-muted rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!announcements?.length) {
    return null;
  }

  return (
    <Card className="border-accent/20 bg-accent/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-accent">
          <Megaphone className="w-5 h-5" />
          Announcements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="pb-4 border-b border-border/50 last:border-0 last:pb-0"
          >
            <h4 className="font-semibold text-foreground mb-1">
              {announcement.title}
            </h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {announcement.body}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground/70">
              <Calendar className="w-3 h-3" />
              {format(new Date(announcement.created_at), 'MMM d, yyyy')}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
