import { FAQ } from '@/types/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FAQSuggestionsProps {
  faqs: FAQ[];
  onDismiss: () => void;
}

export function FAQSuggestions({ faqs, onDismiss }: FAQSuggestionsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (faqs.length === 0) return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            These FAQs might help
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onDismiss} className="h-7 w-7 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-card rounded-lg border p-3 cursor-pointer transition-colors hover:bg-muted/50"
            onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium">{faq.question}</p>
              {expandedId === faq.id ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
            </div>
            {expandedId === faq.id && (
              <p className="text-sm text-muted-foreground mt-2 animate-fade-in">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
        <p className="text-xs text-muted-foreground text-center pt-2">
          If these don't answer your question, continue with the form below.
        </p>
      </CardContent>
    </Card>
  );
}
