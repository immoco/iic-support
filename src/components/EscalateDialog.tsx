import { useState } from 'react';
import { Request } from '@/types/database';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';
import { useCanEscalate, useEscalateRequest } from '@/hooks/useEscalation';
import { MAX_PRIORITY } from '@/lib/constants';

interface EscalateDialogProps {
  request: Request;
}

export function EscalateDialog({ request }: EscalateDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const { canEscalate, reason: cannotReason } = useCanEscalate(
    request.id,
    request.priority,
    request.status
  );
  const escalateMutation = useEscalateRequest();

  const handleEscalate = async () => {
    if (!reason.trim()) return;
    
    await escalateMutation.mutateAsync({
      requestId: request.id,
      reason: reason.trim(),
    });
    
    setReason('');
    setOpen(false);
  };

  if (!canEscalate) {
    return (
      <Button variant="ghost" size="sm" disabled className="h-7 px-2 text-xs">
        <AlertTriangle className="w-3 h-3 mr-1" />
        {cannotReason}
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Escalate Priority
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Escalate Request Priority</DialogTitle>
          <DialogDescription>
            Increase the priority of this request from {request.priority} to{' '}
            {Math.min(request.priority + 1, MAX_PRIORITY)}.
            You can escalate once every 60 minutes.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Escalation</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please explain why this needs higher priority..."
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleEscalate}
            disabled={!reason.trim() || escalateMutation.isPending}
          >
            {escalateMutation.isPending ? 'Escalating...' : 'Escalate'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
