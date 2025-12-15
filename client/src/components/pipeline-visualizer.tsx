import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Code, CheckCircle, Cpu, Clock, Loader2, XCircle } from "lucide-react";
import type { AgentLog } from "@shared/schema";
import { cn } from "@/lib/utils";

interface Agent {
  id: "planner" | "generator" | "validator" | "orchestrator";
  name: string;
  description: string;
  icon: typeof Brain;
}

const agents: Agent[] = [
  {
    id: "planner",
    name: "Scene Planner",
    description: "Analyzes prompt and creates animation blueprint",
    icon: Brain,
  },
  {
    id: "generator",
    name: "Code Generator",
    description: "Converts plan to Manim Python code",
    icon: Code,
  },
  {
    id: "validator",
    name: "Validator",
    description: "Reviews code for errors and best practices",
    icon: CheckCircle,
  },
  {
    id: "orchestrator",
    name: "Orchestrator",
    description: "Manages execution and rendering",
    icon: Cpu,
  },
];

interface PipelineVisualizerProps {
  logs: AgentLog[];
  currentStatus: string;
}

export function PipelineVisualizer({ logs, currentStatus }: PipelineVisualizerProps) {
  const getAgentStatus = (agentId: string): "waiting" | "active" | "completed" | "failed" => {
    const agentLogs = logs.filter((log) => log.agent === agentId);
    if (agentLogs.length === 0) return "waiting";
    const lastLog = agentLogs[agentLogs.length - 1];
    return lastLog.status;
  };

  const getAgentTime = (agentId: string): number | null => {
    const agentLogs = logs.filter((log) => log.agent === agentId);
    if (agentLogs.length < 2) return null;
    const start = agentLogs[0].timestamp;
    const end = agentLogs[agentLogs.length - 1].timestamp;
    return Math.round((end - start) / 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "waiting":
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case "active":
        return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      waiting: "outline",
      active: "default",
      completed: "secondary",
      failed: "destructive",
    };
    return (
      <Badge variant={variants[status] || "outline"} className="capitalize text-xs">
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map((agent, index) => {
          const status = getAgentStatus(agent.id);
          const time = getAgentTime(agent.id);
          const isActive = status === "active";
          
          return (
            <Card
              key={agent.id}
              className={cn(
                "relative transition-all duration-200",
                isActive && "ring-2 ring-primary ring-offset-2 ring-offset-background"
              )}
              data-testid={`agent-card-${agent.id}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-md flex items-center justify-center",
                        status === "completed"
                          ? "bg-green-500/10"
                          : status === "active"
                          ? "bg-primary/10"
                          : status === "failed"
                          ? "bg-destructive/10"
                          : "bg-muted"
                      )}
                    >
                      <agent.icon
                        className={cn(
                          "h-4 w-4",
                          status === "completed"
                            ? "text-green-500"
                            : status === "active"
                            ? "text-primary"
                            : status === "failed"
                            ? "text-destructive"
                            : "text-muted-foreground"
                        )}
                      />
                    </div>
                    <CardTitle className="text-sm font-medium">{agent.name}</CardTitle>
                  </div>
                  {getStatusIcon(status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground">{agent.description}</p>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  {getStatusBadge(status)}
                  {time !== null && (
                    <span className="text-xs text-muted-foreground">{time}s</span>
                  )}
                </div>
              </CardContent>
              {index < agents.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                  <div
                    className={cn(
                      "w-4 h-0.5",
                      status === "completed" ? "bg-green-500" : "bg-muted"
                    )}
                  />
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {logs.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Agent Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 text-sm border-l-2 pl-3 py-1"
                    style={{
                      borderColor:
                        log.status === "completed"
                          ? "rgb(34 197 94)"
                          : log.status === "active"
                          ? "hsl(var(--primary))"
                          : log.status === "failed"
                          ? "hsl(var(--destructive))"
                          : "hsl(var(--muted))",
                    }}
                  >
                    <Badge variant="outline" className="capitalize shrink-0 text-xs">
                      {log.agent}
                    </Badge>
                    <span className="text-muted-foreground flex-1">{log.message}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
