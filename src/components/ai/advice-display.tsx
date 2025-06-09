import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface AdviceDisplayProps {
  advice: string | null;
}

export function AdviceDisplay({ advice }: AdviceDisplayProps) {
  if (!advice) {
    return null;
  }

  // Split advice into paragraphs for better readability
  const paragraphs = advice.split('\n').filter(p => p.trim() !== '');

  return (
    <Card className="mt-8 shadow-lg animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-6 w-6 text-accent" />
          Your AI Financial Advice
        </CardTitle>
        <CardDescription>Here are some suggestions to help you manage your finances better.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-foreground leading-relaxed">
            {paragraph}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}
