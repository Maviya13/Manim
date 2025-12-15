import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Search, 
  Calculator, 
  Atom, 
  Dna, 
  Cpu, 
  Beaker,
  ArrowRight 
} from "lucide-react";
import { animationTemplates, type Template } from "@/lib/templates";

const categoryIcons: Record<string, typeof Calculator> = {
  mathematics: Calculator,
  physics: Atom,
  chemistry: Beaker,
  biology: Dna,
  computer_science: Cpu,
  general: BookOpen,
};

const difficultyColors: Record<string, string> = {
  beginner: "text-green-600 border-green-600",
  intermediate: "text-yellow-600 border-yellow-600",
  advanced: "text-red-600 border-red-600",
};

export default function Templates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredTemplates = animationTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", name: "All", count: animationTemplates.length },
    { id: "mathematics", name: "Mathematics", count: animationTemplates.filter((t) => t.category === "mathematics").length },
    { id: "physics", name: "Physics", count: animationTemplates.filter((t) => t.category === "physics").length },
    { id: "chemistry", name: "Chemistry", count: animationTemplates.filter((t) => t.category === "chemistry").length },
    { id: "biology", name: "Biology", count: animationTemplates.filter((t) => t.category === "biology").length },
    { id: "computer_science", name: "Computer Science", count: animationTemplates.filter((t) => t.category === "computer_science").length },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2" data-testid="text-page-title">
          Animation Templates
        </h1>
        <p className="text-muted-foreground">
          Start with a pre-built template to create educational animations quickly
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search"
          />
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="mb-6 flex-wrap h-auto gap-1">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="gap-2"
              data-testid={`tab-${category.id}`}
            >
              {category.name}
              <Badge variant="secondary" className="text-xs">
                {category.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-0">
          {filteredTemplates.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-lg font-medium mb-2">No templates found</h2>
                <p className="text-muted-foreground">
                  Try adjusting your search or browse a different category.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => {
                const Icon = categoryIcons[template.category] || BookOpen;
                return (
                  <Card
                    key={template.id}
                    className="hover-elevate flex flex-col"
                    data-testid={`card-template-${template.id}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                        <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <Badge
                          variant="outline"
                          className={`capitalize ${difficultyColors[template.difficulty]}`}
                        >
                          {template.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-end pt-0">
                      <div className="space-y-3">
                        <div className="p-3 rounded-md bg-muted/50">
                          <p className="text-xs text-muted-foreground line-clamp-3 font-mono">
                            {template.promptTemplate}
                          </p>
                        </div>
                        <Link href={`/create?template=${template.id}`}>
                          <Button
                            variant="outline"
                            className="w-full"
                            data-testid={`button-use-${template.id}`}
                          >
                            Use Template
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
