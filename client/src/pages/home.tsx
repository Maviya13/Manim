import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Shield, Play, ArrowRight, Brain, Code, CheckCircle, Cpu } from "lucide-react";
import { animationTemplates } from "@/lib/templates";

const features = [
  {
    icon: Brain,
    title: "Multi-Agent Intelligence",
    description: "Four specialized AI agents work together: scene planning, code generation, validation, and orchestration.",
  },
  {
    icon: Shield,
    title: "Sandboxed Execution",
    description: "Safe rendering environment with timeout controls and resource limits for secure code execution.",
  },
  {
    icon: Play,
    title: "Instant Preview",
    description: "Watch your animations come to life and download MP4 videos instantly.",
  },
];

const pipelineSteps = [
  {
    number: 1,
    title: "Describe",
    description: "Enter a natural language prompt describing your educational animation",
    icon: Sparkles,
  },
  {
    number: 2,
    title: "Plan",
    description: "AI analyzes your prompt and creates a structured scene blueprint",
    icon: Brain,
  },
  {
    number: 3,
    title: "Generate",
    description: "Manim code is generated with proper syntax and scene composition",
    icon: Code,
  },
  {
    number: 4,
    title: "Render",
    description: "Code is validated and executed in a sandboxed environment",
    icon: Cpu,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      <section className="relative py-16 px-6 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="gap-1">
                <Zap className="h-3 w-3" />
                Powered by Gemini AI
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight" data-testid="text-hero-title">
                Natural Language to{" "}
                <span className="text-primary">Educational Animation</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                Transform your ideas into stunning Manim animations with our multi-agent AI pipeline. 
                Perfect for educators, students, and content creators.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/create">
                  <Button size="lg" data-testid="button-start-creating">
                    Start Creating
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button size="lg" variant="outline" data-testid="button-view-examples">
                    View Examples
                  </Button>
                </Link>
              </div>
              
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Trusted by educators worldwide
              </p>
            </div>
            
            <div className="relative">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center">
                    <div className="text-center space-y-4 p-8">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Play className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your animations will appear here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Powerful Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create professional educational animations
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover-elevate">
                <CardHeader>
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center mb-2">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our multi-agent pipeline transforms your ideas into animations in four steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pipelineSteps.map((step, index) => (
              <div key={step.number} className="relative">
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                        {step.number}
                      </div>
                      <step.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-base">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{step.description}</CardDescription>
                  </CardContent>
                </Card>
                {index < pipelineSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Example Animations
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore what you can create with our templates
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {animationTemplates.slice(0, 6).map((template) => (
              <Card key={template.id} className="hover-elevate">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <Badge variant="secondary" className="capitalize">
                      {template.category.replace("_", " ")}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {template.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                  <Link href={`/create?template=${template.id}`}>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      Use Template
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/templates">
              <Button variant="outline" size="lg">
                View All Templates
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Ready to Create?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start transforming your educational content into engaging animations today.
          </p>
          <Link href="/create">
            <Button size="lg">
              <Sparkles className="mr-2 h-4 w-4" />
              Create Your First Animation
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
