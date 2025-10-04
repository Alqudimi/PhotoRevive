import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { ExamplesGallery } from "@/components/ExamplesGallery";
import { UploadZone } from "@/components/UploadZone";
import { ProcessingOverlay } from "@/components/ProcessingOverlay";
import { ComparisonSlider } from "@/components/ComparisonSlider";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type AppState = "landing" | "upload" | "processing" | "result";
type ProcessingStage = "analyzing" | "restoring" | "colorizing" | "enhancing";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>("analyzing");
  const [progress, setProgress] = useState(0);
  const [beforeImageUrl, setBeforeImageUrl] = useState<string>("");
  const [afterImageUrl, setAfterImageUrl] = useState<string>("");

  const handleUploadClick = () => {
    setAppState("upload");
    setTimeout(() => {
      document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleExamplesClick = () => {
    document.getElementById("examples")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    const fileUrl = URL.createObjectURL(file);
    setBeforeImageUrl(fileUrl);
    
    setAppState("processing");
    setProgress(0);
    setProcessingStage("analyzing");

    const stages: ProcessingStage[] = ["analyzing", "restoring", "colorizing", "enhancing"];
    let currentStageIndex = 0;
    let currentProgress = 0;

    const progressInterval = setInterval(() => {
      currentProgress += 3;
      if (currentProgress > 90) currentProgress = 90;
      setProgress(currentProgress);

      if (currentProgress >= 25 && currentStageIndex === 0) {
        currentStageIndex = 1;
        setProcessingStage(stages[1]);
      } else if (currentProgress >= 50 && currentStageIndex === 1) {
        currentStageIndex = 2;
        setProcessingStage(stages[2]);
      } else if (currentProgress >= 75 && currentStageIndex === 2) {
        currentStageIndex = 3;
        setProcessingStage(stages[3]);
      }
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/restore", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Failed to process image";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        
        const error = new Error(errorMessage) as any;
        error.status = response.status;
        throw error;
      }

      const blob = await response.blob();
      const restoredImageUrl = URL.createObjectURL(blob);
      
      clearInterval(progressInterval);
      setProgress(100);
      setAfterImageUrl(restoredImageUrl);
      
      setTimeout(() => {
        setAppState("result");
      }, 500);
    } catch (error: any) {
      console.error("Error processing image:", error);
      clearInterval(progressInterval);
      setProgress(0);
      
      let errorMessage = "Failed to process image. Please try again.";
      
      if (error.status === 504 || error.message?.toLowerCase().includes("timeout")) {
        errorMessage = "Processing took too long. Try a smaller image or different photo.";
      } else if (error.status === 503 || error.message?.toLowerCase().includes("unavailable") || error.message?.toLowerCase().includes("service")) {
        errorMessage = "AI service is currently unavailable. Please wait a moment and try again.";
      } else if (error.message?.includes("Failed to fetch") || error.name === "TypeError") {
        errorMessage = "Connection error. Please check your internet connection and ensure the Python API is running.";
      } else if (error.message && error.message !== "Failed to process image") {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
      setAppState("upload");
    }
  };

  const handleDownload = () => {
    if (afterImageUrl) {
      const link = document.createElement("a");
      link.href = afterImageUrl;
      link.download = `restored_${selectedFile?.name || "photo.jpg"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRestoreAnother = () => {
    setAppState("upload");
    setSelectedFile(null);
    setBeforeImageUrl("");
    setAfterImageUrl("");
    setProgress(0);
    setTimeout(() => {
      document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen">
      <Header onUploadClick={handleUploadClick} />
      
      {appState === "landing" && (
        <>
          <Hero 
            onUploadClick={handleUploadClick}
            onExamplesClick={handleExamplesClick}
          />
          
          <div id="how-it-works">
            <HowItWorks />
          </div>
          
          <div id="features">
            <Features />
          </div>
          
          <ExamplesGallery />
          
          <section className="py-20 bg-gradient-to-b from-muted/20 to-primary/5">
            <div className="container mx-auto px-4 text-center space-y-8">
              <h2 className="text-4xl font-bold">Ready to Restore Your Memories?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Upload your old photo now and see the magic of AI restoration in action
              </p>
              <Button size="lg" onClick={handleUploadClick} data-testid="button-cta-final">
                Get Started Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </section>
          
          <Footer />
        </>
      )}

      {(appState === "upload" || appState === "result") && (
        <>
          <div className="pt-20">
            <section id="upload-section" className="py-20 min-h-screen flex items-center">
              <div className="container mx-auto px-4">
                {appState === "upload" && (
                  <div className="space-y-8">
                    <div className="text-center space-y-4">
                      <h2 className="text-4xl font-bold">Upload Your Photo</h2>
                      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Select an old or damaged photo to restore with AI
                      </p>
                    </div>
                    <UploadZone onFileSelect={handleFileSelect} />
                  </div>
                )}

                {appState === "result" && beforeImageUrl && afterImageUrl && (
                  <div className="space-y-8">
                    <div className="text-center space-y-4">
                      <h2 className="text-4xl font-bold">Your Restored Photo</h2>
                      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Compare the original with the AI-enhanced version
                      </p>
                    </div>
                    <ComparisonSlider
                      beforeImage={beforeImageUrl}
                      afterImage={afterImageUrl}
                      onDownload={handleDownload}
                      onRestoreAnother={handleRestoreAnother}
                    />
                  </div>
                )}
              </div>
            </section>
          </div>
          <Footer />
        </>
      )}

      {appState === "processing" && (
        <ProcessingOverlay stage={processingStage} progress={progress} />
      )}
    </div>
  );
}
