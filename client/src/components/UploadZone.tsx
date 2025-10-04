import { Upload, Image as ImageIcon, Sparkles } from "lucide-react";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

interface UploadZoneProps {
  onFileSelect: (file: File, options: ProcessingOptions) => void;
}

export interface ProcessingOptions {
  instruction?: string;
  enableSuperResolution: boolean;
  enableFaceEnhancement: boolean;
  enableColorization: boolean;
  enableInpainting: boolean;
  srScale: number;
  faceFidelity: number;
}

export function UploadZone({ onFileSelect }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [instruction, setInstruction] = useState("");
  const [options, setOptions] = useState<ProcessingOptions>({
    instruction: "",
    enableSuperResolution: true,
    enableFaceEnhancement: true,
    enableColorization: true,
    enableInpainting: true,
    srScale: 2,
    faceFidelity: 0.5,
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const finalOptions = {
      ...options,
      instruction: instruction.trim() || undefined,
    };
    onFileSelect(file, finalOptions);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative min-h-80 border-2 border-dashed rounded-md
          flex flex-col items-center justify-center gap-4 p-12
          cursor-pointer transition-all
          hover-elevate
          ${isDragging ? "border-primary bg-primary/5 scale-105" : "border-border"}
        `}
        data-testid="upload-dropzone"
      >
        <div className={`transition-all ${isDragging ? "scale-110" : ""}`}>
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Upload className="w-10 h-10 text-primary" />
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">
            Drag your old photo here or click to browse
          </p>
          <p className="text-sm text-muted-foreground">
            Supported formats: JPG, PNG up to 10MB
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4">
          <div className="flex items-center gap-1">
            <ImageIcon className="w-4 h-4" />
            <span>High Quality</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            <span>Alqudimi Powered</span>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          data-testid="input-file"
        />
      </div>

      <div className="space-y-6 bg-card border rounded-lg p-6">
        <div className="space-y-3">
          <Label htmlFor="instruction" className="text-base font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Alqudimi Instructions (Optional)
          </Label>
          <Input
            id="instruction"
            type="text"
            placeholder="e.g., 'Remove noise and enhance details' or 'Make it look professional'"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            className="text-base"
            data-testid="input-instruction"
          />
          <p className="text-xs text-muted-foreground">
            Give natural language instructions to guide the Alqudimi restoration process
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-advanced"
          >
            {showAdvanced ? "Hide" : "Show"} Advanced Options
          </button>

          {showAdvanced && (
            <div className="space-y-4 pt-2 border-t">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="super-resolution" className="text-sm font-medium">
                    Super-Resolution (SwinIR)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Enhance image quality with AI upscaling
                  </p>
                </div>
                <Switch
                  id="super-resolution"
                  checked={options.enableSuperResolution}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, enableSuperResolution: checked })
                  }
                  data-testid="switch-super-resolution"
                />
              </div>

              {options.enableSuperResolution && (
                <div className="ml-4 space-y-2">
                  <Label className="text-xs">Upscale Factor: {options.srScale}x</Label>
                  <Slider
                    value={[options.srScale]}
                    onValueChange={([value]) => setOptions({ ...options, srScale: value })}
                    min={2}
                    max={4}
                    step={1}
                    className="w-full"
                    data-testid="slider-sr-scale"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="face-enhancement" className="text-sm font-medium">
                    Face Enhancement (CodeFormer)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Restore and enhance faces in photos
                  </p>
                </div>
                <Switch
                  id="face-enhancement"
                  checked={options.enableFaceEnhancement}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, enableFaceEnhancement: checked })
                  }
                  data-testid="switch-face-enhancement"
                />
              </div>

              {options.enableFaceEnhancement && (
                <div className="ml-4 space-y-2">
                  <Label className="text-xs">
                    Fidelity: {options.faceFidelity.toFixed(1)} 
                    <span className="text-muted-foreground ml-2">
                      ({options.faceFidelity < 0.5 ? "More Enhancement" : "Higher Fidelity"})
                    </span>
                  </Label>
                  <Slider
                    value={[options.faceFidelity]}
                    onValueChange={([value]) => setOptions({ ...options, faceFidelity: value })}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                    data-testid="slider-face-fidelity"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="colorization" className="text-sm font-medium">
                    Colorization (DDColor)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Add realistic colors to B&W photos
                  </p>
                </div>
                <Switch
                  id="colorization"
                  checked={options.enableColorization}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, enableColorization: checked })
                  }
                  data-testid="switch-colorization"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="inpainting" className="text-sm font-medium">
                    Damage Removal (Inpainting)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Remove scratches and damage
                  </p>
                </div>
                <Switch
                  id="inpainting"
                  checked={options.enableInpainting}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, enableInpainting: checked })
                  }
                  data-testid="switch-inpainting"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Powered by: SwinIR • CodeFormer • DDColor • InstructIR
        </p>
      </div>
    </div>
  );
}
