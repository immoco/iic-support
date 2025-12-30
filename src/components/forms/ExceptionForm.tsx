import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateRequest } from '@/hooks/useRequests';
import { EXCEPTION_TYPES, TRAINING_LEVELS } from '@/lib/constants';
import { ExceptionType, TrainingLevel } from '@/types/database';
import { Loader2, AlertTriangle } from 'lucide-react';

const exceptionSchema = z.object({
  exception_type: z.string().min(1, 'Please select a request type'),
  affected_activity: z.string().min(1, 'Please specify the affected activity'),
  training_level: z.string().min(1, 'Please select a training level'),
  description: z.string().min(20, 'Explanation must be at least 20 characters').max(2000),
  declaration: z.boolean().refine((val) => val === true, {
    message: 'You must accept the declaration to proceed',
  }),
});

type ExceptionFormData = z.infer<typeof exceptionSchema>;

interface ExceptionFormProps {
  onSuccess: () => void;
}

export function ExceptionForm({ onSuccess }: ExceptionFormProps) {
  const createRequest = useCreateRequest();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExceptionFormData>({
    resolver: zodResolver(exceptionSchema),
    defaultValues: {
      exception_type: '',
      affected_activity: '',
      training_level: '',
      description: '',
      declaration: false,
    },
  });

  const onSubmit = async (data: ExceptionFormData) => {
    const exceptionType = data.exception_type as ExceptionType;
    const title = `${EXCEPTION_TYPES[exceptionType]}: ${data.affected_activity}`;

    await createRequest.mutateAsync({
      request_type: 'exception',
      exception_type: exceptionType,
      training_level: data.training_level as TrainingLevel,
      affected_activity: data.affected_activity,
      title,
      description: data.description,
    });
    onSuccess();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Exception / Extension Request</CardTitle>
        <CardDescription>
          Request special consideration for emergencies or unforeseen circumstances
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="exception_type">Request Type</Label>
            <Select
              value={watch('exception_type')}
              onValueChange={(value) => setValue('exception_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(EXCEPTION_TYPES).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.exception_type && (
              <p className="text-sm text-destructive">{errors.exception_type.message}</p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="affected_activity">Affected Activity</Label>
              <Input
                id="affected_activity"
                {...register('affected_activity')}
                placeholder="e.g., Week 3 Quiz, Project Submission"
              />
              {errors.affected_activity && (
                <p className="text-sm text-destructive">{errors.affected_activity.message}</p>
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

          <div className="space-y-2">
            <Label htmlFor="description">Explanation / Justification</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Please explain your circumstances in detail..."
              rows={5}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="declaration"
                    checked={watch('declaration')}
                    onCheckedChange={(checked) => setValue('declaration', checked as boolean)}
                  />
                  <Label
                    htmlFor="declaration"
                    className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed cursor-pointer"
                  >
                    I understand this request will be reviewed and approval is not guaranteed.
                    I have provided accurate information and understand that false claims may
                    result in disciplinary action.
                  </Label>
                </div>
                {errors.declaration && (
                  <p className="text-sm text-destructive mt-2">{errors.declaration.message}</p>
                )}
              </div>
            </div>
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
