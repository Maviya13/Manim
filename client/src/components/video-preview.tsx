import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, Play, RefreshCw, Share2, Film } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoPreviewProps {
  videoUrl: string | null;
  status: string;
  onRegenerate?: () => void;
}

export function VideoPreview({ videoUrl, status, onRegenerate }: VideoPreviewProps) {
  const { toast } = useToast();

  const getProgress = () => {
    switch (status) {
      case "queued":
        return 10;
      case "planning":
        return 30;
      case "generating":
        return 50;
      case "validating":
        return 70;
      case "rendering":
        return 90;
      case "completed":
        return 100;
      default:
        return 0;
    }
  };

  const handleDownload = async () => {
    if (!videoUrl) return;
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "animation.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: "Download started" });
    } catch {
      toast({ title: "Download failed", variant: "destructive" });
    }
  };

  const handleShare = async () => {
    if (!videoUrl) return;
    try {
      await navigator.clipboard.writeText(videoUrl);
      toast({ title: "Link copied to clipboard" });
    } catch {
      toast({ title: "Failed to copy link", variant: "destructive" });
    }
  };

  const isProcessing = ["queued", "planning", "generating", "validating", "rendering"].includes(status);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Film className="h-4 w-4" />
          Video Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
          {videoUrl ? (
            <video
              src={videoUrl}
              controls
              className="w-full h-full object-contain"
              data-testid="video-preview"
            >
              Your browser does not support the video tag.
            </video>
          ) : isProcessing ? (
            <div className="text-center space-y-4 p-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 animate-pulse">
                <Play className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium capitalize">{status}...</p>
                <Progress value={getProgress()} className="w-48 mx-auto" />
              </div>
            </div>
          ) : (
            <div className="text-center space-y-2 p-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Play className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                {status === "failed"
                  ? "Generation failed. Try again with a different prompt."
                  : "Your animation preview will appear here"}
              </p>
            </div>
          )}
        </div>

        {videoUrl && (
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleDownload} className="flex-1" data-testid="button-download-video">
              <Download className="h-4 w-4 mr-2" />
              Download MP4
            </Button>
            <Button variant="outline" onClick={handleShare} data-testid="button-share-video">
              <Share2 className="h-4 w-4" />
            </Button>
            {onRegenerate && (
              <Button variant="outline" onClick={onRegenerate} data-testid="button-regenerate">
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {status === "failed" && onRegenerate && (
          <Button
            variant="outline"
            onClick={onRegenerate}
            className="w-full"
            data-testid="button-try-again"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
