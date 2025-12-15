import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, Check, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ValidationResult } from "@shared/schema";
import { cn } from "@/lib/utils";

interface CodePreviewProps {
  code: string | null;
  validation: ValidationResult | null;
}

export function CodePreview({ code, validation }: CodePreviewProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({ title: "Copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  const handleDownload = () => {
    if (!code) return;
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "animation.py";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded animation.py" });
  };

  const getSeverityIcon = (severity: "error" | "warning" | "info") => {
    switch (severity) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityClass = (severity: "error" | "warning" | "info") => {
    switch (severity) {
      case "error":
        return "border-destructive bg-destructive/5";
      case "warning":
        return "border-yellow-500 bg-yellow-500/5";
      case "info":
        return "border-blue-500 bg-blue-500/5";
    }
  };

  if (!code) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <p>No code generated yet</p>
            <p className="text-sm mt-1">Submit a prompt to generate Manim code</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const codeLines = code.split("\n");

  return (
    <Card>
      <Tabs defaultValue="code">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <TabsList>
              <TabsTrigger value="code" data-testid="tab-code">Code</TabsTrigger>
              <TabsTrigger value="validation" data-testid="tab-validation">
                Validation
                {validation && validation.errors.length > 0 && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    {validation.errors.filter((e) => e.severity === "error").length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                data-testid="button-copy-code"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownload}
                data-testid="button-download-code"
              >
                <Download className="h-4 w-4" />
                <span className="ml-2">Download</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <TabsContent value="code" className="mt-0">
            <ScrollArea className="h-96 rounded-md border bg-muted/30">
              <pre className="p-4 text-sm font-mono">
                <code>
                  {codeLines.map((line, index) => (
                    <div key={index} className="flex">
                      <span className="w-10 text-right pr-4 text-muted-foreground select-none">
                        {index + 1}
                      </span>
                      <span className="flex-1">{line || " "}</span>
                    </div>
                  ))}
                </code>
              </pre>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="validation" className="mt-0 space-y-4">
            {validation ? (
              <>
                <div className="flex items-center gap-4 flex-wrap">
                  <Badge
                    variant={validation.isValid ? "secondary" : "destructive"}
                    className="text-sm"
                  >
                    {validation.isValid ? "Valid Code" : "Issues Found"}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Educational Score:
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-sm",
                        validation.educationalScore >= 80
                          ? "border-green-500 text-green-500"
                          : validation.educationalScore >= 50
                          ? "border-yellow-500 text-yellow-500"
                          : "border-destructive text-destructive"
                      )}
                    >
                      {validation.educationalScore}/100
                    </Badge>
                  </div>
                </div>

                {validation.errors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Issues</h4>
                    {validation.errors.map((error, index) => (
                      <div
                        key={index}
                        className={cn(
                          "p-3 rounded-md border-l-4 text-sm",
                          getSeverityClass(error.severity)
                        )}
                      >
                        <div className="flex items-start gap-2">
                          {getSeverityIcon(error.severity)}
                          <div className="flex-1">
                            {error.line && (
                              <span className="text-muted-foreground mr-2">
                                Line {error.line}:
                              </span>
                            )}
                            <span>{error.message}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {validation.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Suggestions</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {validation.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Validation results will appear here after code generation
              </p>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
