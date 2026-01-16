import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useActivityLogs } from '@/hooks/useActivityLogs';
import { ActivityLog, ActivityAction } from '@/types/database';
import { Search, Filter, History, User, FileText, MessageSquare, Bell } from 'lucide-react';
import { format } from 'date-fns';

const ACTION_LABELS: Record<ActivityAction, string> = {
  STATUS_UPDATED: 'Status Updated',
  ROLE_CHANGED: 'Role Changed',
  ANNOUNCEMENT_CREATED: 'Announcement Created',
  ANNOUNCEMENT_UPDATED: 'Announcement Updated',
  ANNOUNCEMENT_DELETED: 'Announcement Deleted',
  FAQ_CREATED: 'FAQ Created',
  FAQ_EDITED: 'FAQ Edited',
  FAQ_DELETED: 'FAQ Deleted',
  REQUEST_ASSIGNED: 'Request Assigned',
  NOTE_ADDED: 'Note Added',
};

const ACTION_COLORS: Record<ActivityAction, string> = {
  STATUS_UPDATED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  ROLE_CHANGED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  ANNOUNCEMENT_CREATED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  ANNOUNCEMENT_UPDATED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  ANNOUNCEMENT_DELETED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  FAQ_CREATED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  FAQ_EDITED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  FAQ_DELETED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  REQUEST_ASSIGNED: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  NOTE_ADDED: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
};

const getTargetIcon = (targetType: string) => {
  switch (targetType) {
    case 'request':
      return <FileText className="w-4 h-4" />;
    case 'user':
      return <User className="w-4 h-4" />;
    case 'announcement':
      return <Bell className="w-4 h-4" />;
    case 'faq':
      return <MessageSquare className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

const formatMetadata = (metadata: Record<string, any>) => {
  if (!metadata || Object.keys(metadata).length === 0) return null;

  return (
    <div className="mt-2 text-sm space-y-1">
      {metadata.old_value && metadata.new_value && (
        <div className="text-muted-foreground">
          <span className="line-through">{metadata.old_value}</span>
          {' → '}
          <span className="font-medium text-foreground">{metadata.new_value}</span>
        </div>
      )}
      {metadata.title && (
        <div className="text-muted-foreground">
          Title: <span className="font-medium text-foreground">{metadata.title}</span>
        </div>
      )}
      {metadata.question && (
        <div className="text-muted-foreground">
          Question: <span className="font-medium text-foreground">{metadata.question}</span>
        </div>
      )}
      {metadata.note_preview && (
        <div className="text-muted-foreground italic">
          "{metadata.note_preview}"
        </div>
      )}
      {metadata.changes && (
        <div className="text-muted-foreground">
          Changes: {Object.keys(metadata.changes).join(', ')}
        </div>
      )}
    </div>
  );
};

export default function AdminActivityLogs() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [targetFilter, setTargetFilter] = useState<string>('all');

  const { data: logs, isLoading } = useActivityLogs();

  const filteredLogs = logs?.filter((log) => {
    const matchesSearch = search
      ? log.actor_email.toLowerCase().includes(search.toLowerCase()) ||
        log.target_id.toLowerCase().includes(search.toLowerCase()) ||
        ACTION_LABELS[log.action_type].toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesAction = actionFilter === 'all' ? true : log.action_type === actionFilter;
    const matchesTarget = targetFilter === 'all' ? true : log.target_type === targetFilter;

    return matchesSearch && matchesAction && matchesTarget;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground flex items-center gap-2">
            <History className="w-6 h-6" />
            Activity Logs
          </h1>
          <p className="text-muted-foreground mt-1">Track all admin actions and changes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{logs?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Total Activities</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {new Set(logs?.map(l => l.actor_email)).size || 0}
              </div>
              <div className="text-sm text-muted-foreground">Active Admins</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {logs?.filter(l => {
                  const logDate = new Date(l.created_at);
                  const dayAgo = new Date();
                  dayAgo.setDate(dayAgo.getDate() - 1);
                  return logDate > dayAgo;
                }).length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Last 24 Hours</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by actor, target ID, or action..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="STATUS_UPDATED">Status Updated</SelectItem>
                  <SelectItem value="ROLE_CHANGED">Role Changed</SelectItem>
                  <SelectItem value="ANNOUNCEMENT_CREATED">Announcement Created</SelectItem>
                  <SelectItem value="ANNOUNCEMENT_UPDATED">Announcement Updated</SelectItem>
                  <SelectItem value="ANNOUNCEMENT_DELETED">Announcement Deleted</SelectItem>
                  <SelectItem value="FAQ_CREATED">FAQ Created</SelectItem>
                  <SelectItem value="FAQ_EDITED">FAQ Edited</SelectItem>
                  <SelectItem value="FAQ_DELETED">FAQ Deleted</SelectItem>
                  <SelectItem value="NOTE_ADDED">Note Added</SelectItem>
                </SelectContent>
              </Select>

              <Select value={targetFilter} onValueChange={setTargetFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by target" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Targets</SelectItem>
                  <SelectItem value="request">Requests</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="announcement">Announcements</SelectItem>
                  <SelectItem value="faq">FAQs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Activity Log List */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading activity logs...</div>
            ) : filteredLogs && filteredLogs.length > 0 ? (
              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={ACTION_COLORS[log.action_type]}>
                            {ACTION_LABELS[log.action_type]}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            {getTargetIcon(log.target_type)}
                            <span className="capitalize">{log.target_type}</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{log.actor_email}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Target ID: <code className="text-xs bg-muted px-1 py-0.5 rounded">{log.target_id}</code>
                          </div>
                        </div>

                        {formatMetadata(log.metadata)}
                      </div>

                      <div className="text-right text-sm text-muted-foreground whitespace-nowrap">
                        <div>{format(new Date(log.created_at), 'MMM d, yyyy')}</div>
                        <div>{format(new Date(log.created_at), 'h:mm a')}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {search || actionFilter !== 'all' || targetFilter !== 'all'
                  ? 'No activity logs match your filters'
                  : 'No activity logs yet'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
