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
import { useResolvedRequests } from '@/hooks/useRequests';
import { ISSUE_CATEGORIES, EXCEPTION_TYPES, TRAINING_LEVELS } from '@/lib/constants';
import { IssueCategory, TrainingLevel } from '@/types/database';
import { Search, BookOpen, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

export default function ResolvedLibrary() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  const { data: requests, isLoading } = useResolvedRequests();

  const filteredRequests = requests?.filter((request) => {
    const matchesSearch = search
      ? request.title.toLowerCase().includes(search.toLowerCase()) ||
        request.admin_response?.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesCategory = categoryFilter === 'all'
      ? true
      : request.issue_category === categoryFilter || request.exception_type === categoryFilter;

    const matchesLevel = levelFilter === 'all'
      ? true
      : request.training_level === levelFilter;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-serif font-bold text-foreground">Resolved Requests Library</h1>
          <p className="text-muted-foreground mt-1">
            Browse previously resolved requests for reference
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search resolved requests..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="header-issues" disabled className="font-semibold">
                      Issues
                    </SelectItem>
                    {Object.entries(ISSUE_CATEGORIES).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                    <SelectItem value="header-exceptions" disabled className="font-semibold">
                      Exceptions
                    </SelectItem>
                    {Object.entries(EXCEPTION_TYPES).map(([value, label]) => (
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

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 w-2/3 bg-muted rounded mb-3" />
                  <div className="h-3 w-full bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredRequests?.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No resolved requests found</h3>
              <p className="text-muted-foreground max-w-sm">
                {search || categoryFilter !== 'all' || levelFilter !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'Resolved requests will appear here for reference.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRequests?.map((request) => {
              const categoryLabel = request.request_type === 'issue'
                ? ISSUE_CATEGORIES[request.issue_category as IssueCategory]
                : EXCEPTION_TYPES[request.exception_type as keyof typeof EXCEPTION_TYPES];

              return (
                <Card key={request.id} className="transition-all hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 bg-success/15 text-success rounded-full">
                            Resolved
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(request.created_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <CardTitle className="text-base">{request.title}</CardTitle>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{categoryLabel}</span>
                      <span className="text-border">•</span>
                      <span>{TRAINING_LEVELS[request.training_level as TrainingLevel]}</span>
                    </div>
                  </CardHeader>
                  {request.admin_response && (
                    <CardContent className="pt-0">
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="w-3 h-3 text-primary" />
                          <span className="text-xs font-medium">Resolution</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {request.admin_response}
                        </p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
