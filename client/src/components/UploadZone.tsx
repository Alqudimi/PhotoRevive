import { Upload, Image as ImageIcon } from "lucide-react";
import { useState, useRef } from "react";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export function UploadZone({ onFileSelect }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      onFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative min-h-96 border-2 border-dashed rounded-md
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
            <span>Secure Processing</span>
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
    </div>
  );
}
