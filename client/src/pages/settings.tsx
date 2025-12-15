import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Brain, Code, CheckCircle, Cpu, Zap } from "lucide-react";

export default function Settings() {
  const agents = [
    {
      id: "planner",
      name: "Scene Planner Agent",
      description: "Analyzes prompts and creates structured animation blueprints",
      icon: Brain,
      model: "gemini-2.5-flash",
    },
    {
      id: "generator",
      name: "Code Generator Agent",
      description: "Converts scene plans into valid Manim Python code",
      icon: Code,
      model: "gemini-2.5-flash",
    },
    {
      id: "validator",
      name: "Validation Agent",
      description: "Reviews code for errors and educational effectiveness",
      icon: CheckCircle,
      model: "gemini-2.5-flash",
    },
    {
      id: "orchestrator",
      name: "Orchestrator Agent",
      description: "Manages execution flow and rendering pipeline",
      icon: Cpu,
      model: "gemini-2.5-flash",
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2 flex items-center gap-2" data-testid="text-page-title">
          <SettingsIcon className="h-6 w-6" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Configure your animation generation preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            API Configuration
          </CardTitle>
          <CardDescription>
            Your Gemini API key is securely stored and used for all AI agents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 rounded-md bg-muted/50">
            <Badge variant="secondary" className="gap-1">
              <CheckCircle className="h-3 w-3" />
              Connected
            </Badge>
            <span className="text-sm text-muted-foreground">
              Using GEMINI_API_KEY environment variable
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Multi-Agent Pipeline</CardTitle>
          <CardDescription>
            Four specialized AI agents work together to generate your animations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {agents.map((agent, index) => (
            <div key={agent.id}>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <agent.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-sm">{agent.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {agent.model}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {agent.description}
                  </p>
                </div>
              </div>
              {index < agents.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Execution Settings</CardTitle>
          <CardDescription>
            Configure sandboxed execution parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-md bg-muted/50">
              <h4 className="font-medium text-sm mb-1">Timeout</h4>
              <p className="text-2xl font-semibold">60s</p>
              <p className="text-xs text-muted-foreground mt-1">
                Maximum execution time for Manim scripts
              </p>
            </div>
            <div className="p-4 rounded-md bg-muted/50">
              <h4 className="font-medium text-sm mb-1">Output Quality</h4>
              <p className="text-2xl font-semibold">720p</p>
              <p className="text-xs text-muted-foreground mt-1">
                Default video resolution for rendered animations
              </p>
            </div>
            <div className="p-4 rounded-md bg-muted/50">
              <h4 className="font-medium text-sm mb-1">Frame Rate</h4>
              <p className="text-2xl font-semibold">30 FPS</p>
              <p className="text-xs text-muted-foreground mt-1">
                Animation playback frame rate
              </p>
            </div>
            <div className="p-4 rounded-md bg-muted/50">
              <h4 className="font-medium text-sm mb-1">Max Duration</h4>
              <p className="text-2xl font-semibold">2 min</p>
              <p className="text-xs text-muted-foreground mt-1">
                Maximum animation length
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
