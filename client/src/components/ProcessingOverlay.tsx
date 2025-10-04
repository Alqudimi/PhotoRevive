import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface ProcessingOverlayProps {
  stage: "analyzing" | "restoring" | "colorizing" | "enhancing";
  progress: number;
}

const stageMessages = {
  analyzing: "Analyzing your photo...",
  restoring: "Removing damage and scratches...",
  colorizing: "Applying realistic colors...",
  enhancing: "Enhancing quality and details...",
};

export function ProcessingOverlay({ stage, progress }: ProcessingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-full max-w-md mx-4">
        <div className="bg-card border border-card-border rounded-md p-8 shadow-2xl">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
            
            <div className="text-center space-y-2 w-full">
              <h3 className="text-lg font-semibold">Processing Your Photo</h3>
              <p className="text-sm text-muted-foreground">
                {stageMessages[stage]}
              </p>
            </div>

            <div className="w-full space-y-2">
              <Progress value={progress} className="h-2" data-testid="progress-bar" />
              <p className="text-xs text-muted-foreground text-center">
                {progress}% complete
              </p>
            </div>

            <div className="flex gap-2 text-xs text-muted-foreground">
              <div className={stage === "analyzing" ? "text-primary font-medium" : ""}>
                Analyze
              </div>
              <span>→</span>
              <div className={stage === "restoring" ? "text-primary font-medium" : ""}>
                Restore
              </div>
              <span>→</span>
              <div className={stage === "colorizing" ? "text-primary font-medium" : ""}>
                Colorize
              </div>
              <span>→</span>
              <div className={stage === "enhancing" ? "text-primary font-medium" : ""}>
                Enhance
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
