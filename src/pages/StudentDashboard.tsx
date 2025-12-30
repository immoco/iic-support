import { MainLayout } from '@/components/layout/MainLayout';
import { AnnouncementsPanel } from '@/components/AnnouncementsPanel';
import { RequestCard } from '@/components/RequestCard';
import { useMyRequests } from '@/hooks/useRequests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { data: requests, isLoading } = useMyRequests();

  return (
    <MainLayout>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif font-bold text-foreground">My Requests</h1>
              <p className="text-muted-foreground mt-1">Track your submitted issues and requests</p>
            </div>
            <Button asChild>
              <Link to="/new-request">
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Link>
            </Button>
          </div>

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
          ) : requests?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No requests yet</h3>
                <p className="text-muted-foreground mb-4 max-w-sm">
                  Submit your first request to get help from the IIC team.
                </p>
                <Button asChild>
                  <Link to="/new-request">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Request
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {requests?.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AnnouncementsPanel />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/new-request">
                  <Plus className="w-4 h-4 mr-2" />
                  Submit New Request
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/library">
                  <FileText className="w-4 h-4 mr-2" />
                  Browse Resolved Issues
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
