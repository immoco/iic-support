import { useState } from 'react';
import { Request, RequestStatus } from '@/types/database';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { ISSUE_CATEGORIES, EXCEPTION_TYPES, TRAINING_LEVELS, REQUEST_STATUSES } from '@/lib/constants';
import { useUpdateRequestStatus } from '@/hooks/useRequests';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Clock, User, Loader2 } from 'lucide-react';

interface AdminRequestCardProps {
  request: Request;
}

export function AdminRequestCard({ request }: AdminRequestCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newStatus, setNewStatus] = useState<RequestStatus>(request.status);
  const [adminResponse, setAdminResponse] = useState(request.admin_response || '');
  const updateStatus = useUpdateRequestStatus();

  const categoryLabel = request.request_type === 'issue'
    ? ISSUE_CATEGORIES[request.issue_category!]
    : EXCEPTION_TYPES[request.exception_type!];

  const hasChanges = newStatus !== request.status || adminResponse !== (request.admin_response || '');

  const handleSave = async () => {
    await updateStatus.mutateAsync({
      requestId: request.id,
      status: newStatus,
      adminResponse: adminResponse || undefined,
      oldStatus: request.status,
    });
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-muted-foreground">
                #{request.id.slice(0, 8).toUpperCase()}
              </span>
              <span className="text-xs px-2 py-0.5 bg-secondary rounded-full">
                {request.request_type === 'issue' ? 'Issue' : 'Exception'}
              </span>
              <PriorityBadge priority={request.priority} />
            </div>
            <h3 className="font-semibold text-foreground">{request.title}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-muted-foreground">
              <span>{categoryLabel}</span>
              <span className="text-border">•</span>
              <span>{TRAINING_LEVELS[request.training_level]}</span>
            </div>
          </div>
          <StatusBadge status={request.status} />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{format(new Date(request.created_at), 'MMM d, yyyy h:mm a')}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-7 px-2"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Manage
              </>
            )}
          </Button>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t space-y-4 animate-fade-in">
            <div>
              <h4 className="text-sm font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/30 p-3 rounded-lg">
                {request.description}
              </p>
            </div>

            {request.affected_activity && (
              <div>
                <h4 className="text-sm font-medium mb-1">Affected Activity</h4>
                <p className="text-sm text-muted-foreground">{request.affected_activity}</p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label>Update Status</Label>
                <Select value={newStatus} onValueChange={(v) => setNewStatus(v as RequestStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(REQUEST_STATUSES).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Response to Student (visible)</Label>
              <Textarea
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                placeholder="Add a response that will be visible to the student..."
                rows={3}
              />
            </div>

            {hasChanges && (
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewStatus(request.status);
                    setAdminResponse(request.admin_response || '');
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={updateStatus.isPending}>
                  {updateStatus.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
