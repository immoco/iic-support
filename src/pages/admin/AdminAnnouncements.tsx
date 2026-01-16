import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAnnouncements, useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement } from '@/hooks/useAnnouncements';
import { Announcement } from '@/types/database';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, Megaphone, Loader2 } from 'lucide-react';

export default function AdminAnnouncements() {
  const { data: announcements, isLoading } = useAnnouncements();
  const createAnnouncement = useCreateAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({ title: '', body: '', display_order: 0 });

  const handleCreate = async () => {
    await createAnnouncement.mutateAsync(formData);
    setFormData({ title: '', body: '', display_order: 0 });
    setIsCreateOpen(false);
  };

  const handleUpdate = async () => {
    if (!editingAnnouncement) return;
    await updateAnnouncement.mutateAsync({
      id: editingAnnouncement.id,
      ...formData,
    });
    setEditingAnnouncement(null);
    setFormData({ title: '', body: '', display_order: 0 });
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      await deleteAnnouncement.mutateAsync({ id, title });
    }
  };

  const handleToggleActive = async (announcement: Announcement) => {
    await updateAnnouncement.mutateAsync({
      id: announcement.id,
      active: !announcement.active,
    });
  };

  const openEditDialog = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      body: announcement.body,
      display_order: announcement.display_order,
    });
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Announcements</h1>
            <p className="text-muted-foreground mt-1">Manage student announcements</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Announcement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Announcement title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Body</Label>
                  <Textarea
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    placeholder="Announcement content..."
                    rows={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Display Order (lower = first)</Label>
                  <Input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <Button
                  onClick={handleCreate}
                  disabled={!formData.title || !formData.body || createAnnouncement.isPending}
                  className="w-full"
                >
                  {createAnnouncement.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Create Announcement
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 w-1/2 bg-muted rounded mb-3" />
                  <div className="h-3 w-full bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : announcements?.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Megaphone className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No announcements yet</h3>
              <p className="text-muted-foreground max-w-sm mb-4">
                Create your first announcement to inform students.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {announcements?.map((announcement) => (
              <Card key={announcement.id} className={!announcement.active ? 'opacity-60' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {!announcement.active && (
                          <span className="text-xs px-2 py-0.5 bg-muted rounded-full">
                            Inactive
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          Order: {announcement.display_order}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
                        {announcement.body}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={announcement.active}
                        onCheckedChange={() => handleToggleActive(announcement)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                    <span>Created {format(new Date(announcement.created_at), 'MMM d, yyyy')}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(announcement)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(announcement.id, announcement.title)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingAnnouncement} onOpenChange={() => setEditingAnnouncement(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Announcement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Body</Label>
                <Textarea
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <Button
                onClick={handleUpdate}
                disabled={!formData.title || !formData.body || updateAnnouncement.isPending}
                className="w-full"
              >
                {updateAnnouncement.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
