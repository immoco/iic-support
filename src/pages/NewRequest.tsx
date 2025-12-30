import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IssueForm } from '@/components/forms/IssueForm';
import { ExceptionForm } from '@/components/forms/ExceptionForm';
import { AlertCircle, HelpCircle, ArrowLeft } from 'lucide-react';

type RequestTypeSelection = 'issue' | 'exception' | null;

export default function NewRequest() {
  const [selectedType, setSelectedType] = useState<RequestTypeSelection>(null);
  const navigate = useNavigate();

  if (selectedType === 'issue') {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setSelectedType(null)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <IssueForm onSuccess={() => navigate('/dashboard')} />
        </div>
      </MainLayout>
    );
  }

  if (selectedType === 'exception') {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setSelectedType(null)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <ExceptionForm onSuccess={() => navigate('/dashboard')} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-serif font-bold text-foreground">Submit New Request</h1>
          <p className="text-muted-foreground mt-2">
            Choose the type of request you want to submit
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Card
            className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 group"
            onClick={() => setSelectedType('issue')}
          >
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                <HelpCircle className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Issue / Doubt</CardTitle>
              <CardDescription>
                Questions about registration, payments, activities, schedule, or technical issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Registration / Eligibility</li>
                <li>• Payment / Refund</li>
                <li>• Activity Points</li>
                <li>• Training Schedule</li>
                <li>• Portal / Technical</li>
              </ul>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-all hover:shadow-lg hover:border-accent/50 group"
            onClick={() => setSelectedType('exception')}
          >
            <CardHeader>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-2 group-hover:bg-accent/20 transition-colors">
                <AlertCircle className="w-6 h-6 text-accent" />
              </div>
              <CardTitle className="text-lg">Exception / Extension</CardTitle>
              <CardDescription>
                Special requests for medical emergencies, missed activities, or deadline extensions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Medical Emergency</li>
                <li>• Personal / Unforeseen Circumstance</li>
                <li>• Missed Activity</li>
                <li>• Deadline Extension</li>
                <li>• Reattempt Request</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
