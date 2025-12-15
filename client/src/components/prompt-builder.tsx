import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Sparkles, ChevronDown, Loader2, Lightbulb } from "lucide-react";
import { animationTemplates, getTemplateById } from "@/lib/templates";
import type { Template } from "@shared/schema";

interface PromptBuilderProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  initialTemplate?: string;
}

const examplePrompts = [
  "Animate the Pythagorean theorem with colored squares on each side of a right triangle",
  "Show how binary search works step by step on a sorted array",
  "Visualize the derivative of x² as the slope of the tangent line",
  "Demonstrate wave interference with two overlapping sine waves",
];

export function PromptBuilder({ onSubmit, isLoading, initialTemplate }: PromptBuilderProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [advancedOpen, setAdvancedOpen] = useState(false);

  useEffect(() => {
    if (initialTemplate) {
      const template = getTemplateById(initialTemplate);
      if (template) {
        setPrompt(template.promptTemplate);
      }
    }
  }, [initialTemplate]);

  const handleTemplateSelect = (templateId: string) => {
    const template = getTemplateById(templateId);
    if (template) {
      setPrompt(template.promptTemplate);
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim().length >= 10) {
      onSubmit(prompt.trim());
    }
  };

  const filteredTemplates =
    selectedCategory === "all"
      ? animationTemplates
      : animationTemplates.filter((t) => t.category === selectedCategory);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "mathematics", label: "Mathematics" },
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "biology", label: "Biology" },
    { value: "computer_science", label: "Computer Science" },
    { value: "general", label: "General" },
  ];

  const charCount = prompt.length;
  const isValidLength = charCount >= 10;
  const complexity = charCount < 50 ? "Simple" : charCount < 150 ? "Medium" : "Complex";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Create Animation
        </CardTitle>
        <CardDescription>
          Describe your educational animation in natural language
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <label className="text-sm font-medium">Template (optional)</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40" data-testid="select-category">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-2">
              {filteredTemplates.slice(0, 4).map((template) => (
                <Button
                  key={template.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleTemplateSelect(template.id)}
                  data-testid={`template-${template.id}`}
                >
                  {template.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Prompt</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the educational animation you want to create. For example: 'Create an animation showing how the Pythagorean theorem works with animated squares on each side of a right triangle...'"
              className="min-h-32 resize-y"
              data-testid="input-prompt"
            />
            <div className="flex items-center justify-between gap-4 flex-wrap text-xs">
              <span className={isValidLength ? "text-muted-foreground" : "text-destructive"}>
                {charCount} characters {!isValidLength && "(minimum 10)"}
              </span>
              <Badge variant="outline" className="text-xs">
                {complexity}
              </Badge>
            </div>
          </div>

          <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="gap-2">
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${advancedOpen ? "rotate-180" : ""}`}
                />
                Tips for better prompts
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <Card className="bg-muted/50">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-primary mt-0.5" />
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">Tips for effective prompts:</p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Be specific about the concept you want to visualize</li>
                        <li>Mention colors, shapes, and visual elements</li>
                        <li>Describe the sequence of animations</li>
                        <li>Include any formulas or equations to display</li>
                        <li>Specify the educational level (beginner, intermediate, advanced)</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Try these examples:</p>
                    <div className="flex flex-wrap gap-2">
                      {examplePrompts.map((example, index) => (
                        <Button
                          key={index}
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="text-xs h-auto py-1 px-2 text-left whitespace-normal"
                          onClick={() => handleExampleClick(example)}
                          data-testid={`example-prompt-${index}`}
                        >
                          {example.slice(0, 50)}...
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          <Button
            type="submit"
            className="w-full"
            disabled={!isValidLength || isLoading}
            data-testid="button-generate"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Animation...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Animation
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
