import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FAQSuggestions } from '@/components/FAQSuggestions';
import { useCreateRequest } from '@/hooks/useRequests';
import { useMatchingFAQs } from '@/hooks/useFAQs';
import { ISSUE_CATEGORIES, TRAINING_LEVELS } from '@/lib/constants';
import { IssueCategory, TrainingLevel } from '@/types/database';
import { Loader2 } from 'lucide-react';

const issueSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  category: z.string().min(1, 'Please select a category'),
  training_level: z.string().min(1, 'Please select a training level'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
});

type IssueFormData = z.infer<typeof issueSchema>;

interface IssueFormProps {
  onSuccess: () => void;
}

export function IssueForm({ onSuccess }: IssueFormProps) {
  const [showFAQs, setShowFAQs] = useState(true);
  const createRequest = useCreateRequest();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: '',
      category: '',
      training_level: '',
      description: '',
    },
  });

  const watchedCategory = watch('category') as IssueCategory;
  const watchedTitle = watch('title');
  const matchingFAQs = useMatchingFAQs(watchedCategory, watchedTitle);

  const onSubmit = async (data: IssueFormData) => {
    await createRequest.mutateAsync({
      request_type: 'issue',
      issue_category: data.category as IssueCategory,
      training_level: data.training_level as TrainingLevel,
      title: data.title,
      description: data.description,
    });
    onSuccess();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Issue / Doubt</CardTitle>
        <CardDescription>
          Describe your issue and we'll help you as soon as possible
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Brief summary of your issue"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={watch('category')}
                onValueChange={(value) => setValue('category', value)}
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
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="training_level">Training Level</Label>
              <Select
                value={watch('training_level')}
                onValueChange={(value) => setValue('training_level', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TRAINING_LEVELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.training_level && (
                <p className="text-sm text-destructive">{errors.training_level.message}</p>
              )}
            </div>
          </div>

          {showFAQs && matchingFAQs.length > 0 && (
            <FAQSuggestions
              faqs={matchingFAQs}
              onDismiss={() => setShowFAQs(false)}
            />
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Please provide all relevant details about your issue..."
              rows={5}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={createRequest.isPending}
          >
            {createRequest.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
