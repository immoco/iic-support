import { useState } from 'react';
import { Request } from '@/types/database';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { ISSUE_CATEGORIES, EXCEPTION_TYPES, TRAINING_LEVELS } from '@/lib/constants';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Clock, AlertTriangle, MessageSquare } from 'lucide-react';
import { EscalateDialog } from './EscalateDialog';

interface RequestCardProps {
  request: Request;
}

export function RequestCard({ request }: RequestCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryLabel = request.request_type === 'issue'
    ? ISSUE_CATEGORIES[request.issue_category!]
    : EXCEPTION_TYPES[request.exception_type!];

  const isClosedStatus = ['approved', 'rejected', 'resolved'].includes(request.status);

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
            </div>
            <h3 className="font-semibold text-foreground truncate">{request.title}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-muted-foreground">
              <span>{categoryLabel}</span>
              <span className="text-border">•</span>
              <span>{TRAINING_LEVELS[request.training_level]}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex flex-col items-end gap-1">
              <StatusBadge status={request.status} />
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">Priority</span>
                <PriorityBadge priority={request.priority} />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Submitted {format(new Date(request.created_at), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            {!isClosedStatus && (
              <EscalateDialog request={request} />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-7 px-2"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Details
                </>
              )}
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t space-y-4 animate-fade-in">
            <div>
              <h4 className="text-sm font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {request.description}
              </p>
            </div>

            {request.affected_activity && (
              <div>
                <h4 className="text-sm font-medium mb-1">Affected Activity</h4>
                <p className="text-sm text-muted-foreground">{request.affected_activity}</p>
              </div>
            )}

            {request.admin_response && (
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-medium">Admin Response</h4>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {request.admin_response}
                </p>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              Last updated: {format(new Date(request.updated_at), 'MMM d, yyyy h:mm a')}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
