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
import { AdminRequestCard } from '@/components/admin/AdminRequestCard';
import { useAllRequests } from '@/hooks/useRequests';
import { REQUEST_STATUSES, ISSUE_CATEGORIES, TRAINING_LEVELS } from '@/lib/constants';
import { RequestStatus, TrainingLevel } from '@/types/database';
import { Search, Filter, LayoutDashboard } from 'lucide-react';

export default function AdminDashboard() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  const { data: requests, isLoading } = useAllRequests();

  const filteredRequests = requests?.filter((request) => {
    const matchesSearch = search
      ? request.title.toLowerCase().includes(search.toLowerCase()) ||
        request.id.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesStatus = statusFilter === 'all' ? true : request.status === statusFilter;
    const matchesLevel = levelFilter === 'all' ? true : request.training_level === levelFilter;

    return matchesSearch && matchesStatus && matchesLevel;
  });

  const openCount = requests?.filter((r) => r.status === 'open').length || 0;
  const reviewCount = requests?.filter((r) => r.status === 'under_review').length || 0;
  const highPriorityCount = requests?.filter((r) => r.priority >= 4 && !['approved', 'rejected', 'resolved'].includes(r.status)).length || 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage student requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-status-open">{openCount}</div>
              <div className="text-sm text-muted-foreground">Open Requests</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-status-review">{reviewCount}</div>
              <div className="text-sm text-muted-foreground">Under Review</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-destructive">{highPriorityCount}</div>
              <div className="text-sm text-muted-foreground">High Priority</div>
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
                  placeholder="Search by title or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {Object.entries(REQUEST_STATUSES).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {Object.entries(TRAINING_LEVELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 w-2/3 bg-muted rounded mb-3" />
                  <div className="h-3 w-1/2 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredRequests?.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <LayoutDashboard className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No requests found</h3>
              <p className="text-muted-foreground max-w-sm">
                {search || statusFilter !== 'all' || levelFilter !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'No requests have been submitted yet.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRequests?.map((request) => (
              <AdminRequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
