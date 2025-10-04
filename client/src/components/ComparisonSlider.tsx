import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  onDownload: () => void;
  onRestoreAnother: () => void;
}

export function ComparisonSlider({ 
  beforeImage, 
  afterImage, 
  onDownload,
  onRestoreAnother 
}: ComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<"compare" | "before" | "after">("compare");
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  const displayedSliderPosition = viewMode === "before" ? 100 : viewMode === "after" ? 0 : sliderPosition;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <Button
            variant={viewMode === "before" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("before")}
            data-testid="button-show-original"
          >
            Show Original
          </Button>
          <Button
            variant={viewMode === "compare" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("compare")}
            data-testid="button-compare"
          >
            Compare
          </Button>
          <Button
            variant={viewMode === "after" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("after")}
            data-testid="button-show-restored"
          >
            Show Restored
          </Button>
        </div>
        
        <Button onClick={onDownload} data-testid="button-download">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      <div
        ref={containerRef}
        className="relative w-full aspect-[4/3] bg-muted rounded-md overflow-hidden shadow-xl cursor-col-resize select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        data-testid="comparison-slider"
      >
        <img
          src={afterImage}
          alt="Restored"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${displayedSliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt="Original"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ width: containerRef.current ? `${(containerRef.current.offsetWidth / displayedSliderPosition) * 100}%` : "100%" }}
            draggable={false}
          />
        </div>

        {viewMode === "compare" && (
          <>
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
              style={{ left: `${sliderPosition}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-col-resize"
              style={{ left: `${sliderPosition}%`, marginLeft: "-24px" }}
              onMouseDown={handleMouseDown}
              data-testid="slider-handle"
            >
              <div className="flex gap-1">
                <div className="w-0.5 h-6 bg-foreground/50" />
                <div className="w-0.5 h-6 bg-foreground/50" />
              </div>
            </div>
          </>
        )}

        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-background/90 backdrop-blur-sm text-xs font-medium rounded-full">
            Original
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
            Restored
          </span>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={onRestoreAnother}
          data-testid="button-restore-another"
        >
          Restore Another Photo
        </Button>
      </div>
    </div>
  );
}
