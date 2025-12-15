import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Film, 
  Plus, 
  Play, 
  Download, 
  Trash2, 
  Clock, 
  CheckCircle,
  XCircle,
  Loader2 
} from "lucide-react";
import type { JobResponse } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

export default function Gallery() {
  const { toast } = useToast();
  
  const { data: jobs, isLoading, error } = useQuery<JobResponse[]>({
    queryKey: ["/api/jobs"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/jobs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      toast({ title: "Animation deleted" });
    },
    onError: () => {
      toast({ title: "Failed to delete", variant: "destructive" });
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "queued":
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "secondary",
      failed: "destructive",
      queued: "outline",
    };
    return (
      <Badge variant={variants[status] || "default"} className="capitalize gap-1">
        {getStatusIcon(status)}
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
          <div>
            <h1 className="text-2xl font-semibold">My Animations</h1>
            <p className="text-muted-foreground">View and manage your generated animations</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <Skeleton className="aspect-video" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-lg font-medium mb-2">Failed to load animations</h2>
            <p className="text-muted-foreground mb-4">
              There was an error loading your animations. Please try again.
            </p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sortedJobs = [...(jobs || [])].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">My Animations</h1>
          <p className="text-muted-foreground">
            {jobs?.length || 0} animation{(jobs?.length || 0) !== 1 ? "s" : ""} created
          </p>
        </div>
        <Link href="/create">
          <Button data-testid="button-create-new">
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </Link>
      </div>

      {sortedJobs.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <Film className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-medium mb-2">No animations yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first educational animation by describing it in natural language.
            </p>
            <Link href="/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Animation
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedJobs.map((job) => (
            <Card key={job.id} className="overflow-hidden" data-testid={`card-job-${job.id}`}>
              <CardContent className="p-0">
                <div className="aspect-video bg-muted flex items-center justify-center relative">
                  {job.videoUrl ? (
                    <video
                      src={job.videoUrl}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                      onMouseLeave={(e) => {
                        const video = e.target as HTMLVideoElement;
                        video.pause();
                        video.currentTime = 0;
                      }}
                    />
                  ) : (
                    <div className="text-center p-4">
                      {job.status === "failed" ? (
                        <XCircle className="h-8 w-8 text-destructive mx-auto" />
                      ) : job.status === "completed" ? (
                        <Film className="h-8 w-8 text-muted-foreground mx-auto" />
                      ) : (
                        <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
                      )}
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(job.status)}
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-sm line-clamp-2" data-testid={`text-prompt-${job.id}`}>
                    {job.prompt}
                  </p>
                  <div className="flex items-center justify-between gap-2 flex-wrap text-xs text-muted-foreground">
                    <span>
                      {job.createdAt
                        ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })
                        : "Unknown date"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {job.videoUrl && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          asChild
                        >
                          <a href={job.videoUrl} target="_blank" rel="noopener noreferrer">
                            <Play className="h-4 w-4 mr-1" />
                            View
                          </a>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                        >
                          <a href={job.videoUrl} download>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteMutation.mutate(job.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${job.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
