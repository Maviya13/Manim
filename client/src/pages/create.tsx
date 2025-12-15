import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PromptBuilder } from "@/components/prompt-builder";
import { PipelineVisualizer } from "@/components/pipeline-visualizer";
import { CodePreview } from "@/components/code-preview";
import { VideoPreview } from "@/components/video-preview";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { JobResponse, AgentLog } from "@shared/schema";

export default function Create() {
  const search = useSearch();
  const templateParam = new URLSearchParams(search).get("template") || undefined;
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const { toast } = useToast();

  const createJobMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await apiRequest("POST", "/api/jobs", { prompt });
      return response as JobResponse;
    },
    onSuccess: (data) => {
      setCurrentJobId(data.id);
      toast({ title: "Animation generation started!" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to start generation", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const { data: job } = useQuery<JobResponse>({
    queryKey: [`/api/jobs/${currentJobId}`],
    enabled: !!currentJobId,
    refetchInterval: (query) => {
      const data = query.state.data as JobResponse | undefined;
      if (!data) return 2000;
      if (["completed", "failed"].includes(data.status)) {
        return false;
      }
      return 2000;
    },
  });

  useEffect(() => {
    if (job?.status === "completed") {
      toast({ title: "Animation generated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
    } else if (job?.status === "failed") {
      toast({ 
        title: "Generation failed", 
        description: job.errorMessage || "An error occurred",
        variant: "destructive" 
      });
    }
  }, [job?.status]);

  const handleSubmit = (prompt: string) => {
    createJobMutation.mutate(prompt);
  };

  const handleRegenerate = () => {
    if (job?.prompt) {
      createJobMutation.mutate(job.prompt);
    }
  };

  const isProcessing = createJobMutation.isPending || 
    (job && !["completed", "failed"].includes(job.status));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <PromptBuilder 
            onSubmit={handleSubmit}
            isLoading={isProcessing}
            initialTemplate={templateParam}
          />
          
          {job && (
            <PipelineVisualizer 
              logs={(job.agentLogs || []) as AgentLog[]}
              currentStatus={job.status}
            />
          )}
        </div>
        
        <div className="space-y-6">
          <VideoPreview 
            videoUrl={job?.videoUrl || null}
            status={job?.status || "idle"}
            onRegenerate={handleRegenerate}
          />
          
          <CodePreview 
            code={job?.generatedCode || null}
            validation={job?.validationResult || null}
          />
        </div>
      </div>
    </div>
  );
}
