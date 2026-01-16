import { supabase } from '@/integrations/supabase/client';
import { ActivityAction, ActivityTargetType } from '@/types/database';

interface LogActivityParams {
  action: ActivityAction;
  targetId: string;
  targetType: ActivityTargetType;
  metadata?: Record<string, any>;
}

export async function logActivity({
  action,
  targetId,
  targetType,
  metadata = {},
}: LogActivityParams): Promise<void> {
  try {
    // Get current user's email
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      console.error('No authenticated user found for activity logging');
      return;
    }

    const { error } = await supabase
      .from('activity_logs')
      .insert({
        actor_email: user.email,
        action_type: action,
        target_id: targetId,
        target_type: targetType,
        metadata,
      });

    if (error) {
      console.error('Failed to log activity:', error);
    }
  } catch (err) {
    console.error('Error logging activity:', err);
  }
}

// Helper functions for common actions
export const activityLogger = {
  statusUpdated: (requestId: string, oldStatus: string, newStatus: string) =>
    logActivity({
      action: 'STATUS_UPDATED',
      targetId: requestId,
      targetType: 'request',
      metadata: { old_value: oldStatus, new_value: newStatus },
    }),

  roleChanged: (userId: string, oldRole: string, newRole: string) =>
    logActivity({
      action: 'ROLE_CHANGED',
      targetId: userId,
      targetType: 'user',
      metadata: { old_value: oldRole, new_value: newRole },
    }),

  announcementCreated: (announcementId: string, title: string) =>
    logActivity({
      action: 'ANNOUNCEMENT_CREATED',
      targetId: announcementId,
      targetType: 'announcement',
      metadata: { title },
    }),

  announcementUpdated: (announcementId: string, changes: Record<string, any>) =>
    logActivity({
      action: 'ANNOUNCEMENT_UPDATED',
      targetId: announcementId,
      targetType: 'announcement',
      metadata: changes,
    }),

  announcementDeleted: (announcementId: string, title: string) =>
    logActivity({
      action: 'ANNOUNCEMENT_DELETED',
      targetId: announcementId,
      targetType: 'announcement',
      metadata: { title },
    }),

  faqCreated: (faqId: string, question: string) =>
    logActivity({
      action: 'FAQ_CREATED',
      targetId: faqId,
      targetType: 'faq',
      metadata: { question },
    }),

  faqEdited: (faqId: string, changes: Record<string, any>) =>
    logActivity({
      action: 'FAQ_EDITED',
      targetId: faqId,
      targetType: 'faq',
      metadata: changes,
    }),

  faqDeleted: (faqId: string, question: string) =>
    logActivity({
      action: 'FAQ_DELETED',
      targetId: faqId,
      targetType: 'faq',
      metadata: { question },
    }),

  noteAdded: (requestId: string, notePreview: string) =>
    logActivity({
      action: 'NOTE_ADDED',
      targetId: requestId,
      targetType: 'request',
      metadata: { note_preview: notePreview.substring(0, 100) },
    }),
};
