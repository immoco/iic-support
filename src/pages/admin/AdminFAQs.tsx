import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useFAQs, useCreateFAQ, useUpdateFAQ, useDeleteFAQ } from '@/hooks/useFAQs';
import { ISSUE_CATEGORIES } from '@/lib/constants';
import { FAQ, IssueCategory } from '@/types/database';
import { Plus, Edit, Trash2, HelpCircle, Loader2 } from 'lucide-react';

export default function AdminFAQs() {
  const { data: faqs, isLoading } = useFAQs();
  const createFAQ = useCreateFAQ();
  const updateFAQ = useUpdateFAQ();
  const deleteFAQ = useDeleteFAQ();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    category: '' as IssueCategory | '',
    question: '',
    answer: '',
    keywords: '',
  });

  const handleCreate = async () => {
    if (!formData.category) return;
    await createFAQ.mutateAsync({
      category: formData.category as IssueCategory,
      question: formData.question,
      answer: formData.answer,
      keywords: formData.keywords.split(',').map((k) => k.trim()).filter(Boolean),
    });
    setFormData({ category: '', question: '', answer: '', keywords: '' });
    setIsCreateOpen(false);
  };

  const handleUpdate = async () => {
    if (!editingFAQ || !formData.category) return;
    await updateFAQ.mutateAsync({
      id: editingFAQ.id,
      category: formData.category as IssueCategory,
      question: formData.question,
      answer: formData.answer,
      keywords: formData.keywords.split(',').map((k) => k.trim()).filter(Boolean),
    });
    setEditingFAQ(null);
    setFormData({ category: '', question: '', answer: '', keywords: '' });
  };

  const handleDelete = async (id: string, question: string) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      await deleteFAQ.mutateAsync({ id, question });
    }
  };

  const handleToggleActive = async (faq: FAQ) => {
    await updateFAQ.mutateAsync({
      id: faq.id,
      active: !faq.active,
    });
  };

  const openEditDialog = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFormData({
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      keywords: faq.keywords.join(', '),
    });
  };

  // Group FAQs by category
  const groupedFAQs = faqs?.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<IssueCategory, FAQ[]>);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">FAQ Management</h1>
            <p className="text-muted-foreground mt-1">Manage frequently asked questions</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New FAQ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create FAQ</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => setFormData({ ...formData, category: v as IssueCategory })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ISSUE_CATEGORIES).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Question</Label>
                  <Input
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="What is the question?"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Answer</Label>
                  <Textarea
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    placeholder="Answer to the question..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Keywords (comma-separated)</Label>
                  <Input
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    placeholder="payment, refund, fee"
                  />
                  <p className="text-xs text-muted-foreground">
                    Keywords help match this FAQ to student questions
                  </p>
                </div>
                <Button
                  onClick={handleCreate}
                  disabled={!formData.category || !formData.question || !formData.answer || createFAQ.isPending}
                  className="w-full"
                >
                  {createFAQ.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Create FAQ
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
        ) : !faqs?.length ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <HelpCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No FAQs yet</h3>
              <p className="text-muted-foreground max-w-sm mb-4">
                Create FAQs to help students find answers quickly.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedFAQs || {}).map(([category, categoryFAQs]) => (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {ISSUE_CATEGORIES[category as IssueCategory]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {categoryFAQs.map((faq) => (
                    <div
                      key={faq.id}
                      className={`p-3 rounded-lg border ${!faq.active ? 'opacity-60 bg-muted/30' : 'bg-card'}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {!faq.active && (
                              <span className="text-xs px-2 py-0.5 bg-muted rounded-full">
                                Inactive
                              </span>
                            )}
                          </div>
                          <p className="font-medium text-sm">{faq.question}</p>
                          <p className="text-sm text-muted-foreground mt-1">{faq.answer}</p>
                          {faq.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {faq.keywords.map((keyword) => (
                                <span
                                  key={keyword}
                                  className="text-xs px-1.5 py-0.5 bg-secondary rounded"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Switch
                            checked={faq.active}
                            onCheckedChange={() => handleToggleActive(faq)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(faq)}
                            className="h-8 w-8"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(faq.id, faq.question)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingFAQ} onOpenChange={() => setEditingFAQ(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit FAQ</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData({ ...formData, category: v as IssueCategory })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ISSUE_CATEGORIES).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Question</Label>
                <Input
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Answer</Label>
                <Textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Keywords (comma-separated)</Label>
                <Input
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                />
              </div>
              <Button
                onClick={handleUpdate}
                disabled={!formData.category || !formData.question || !formData.answer || updateFAQ.isPending}
                className="w-full"
              >
                {updateFAQ.isPending ? (
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
