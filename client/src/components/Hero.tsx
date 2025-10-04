import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import beforeImage from "@assets/generated_images/Vintage_damaged_family_photo_23f9ee2a.png";
import afterImage from "@assets/generated_images/Restored_colorized_vintage_photo_3f663333.png";

interface HeroProps {
  onUploadClick: () => void;
  onExamplesClick: () => void;
}

export function Hero({ onUploadClick, onExamplesClick }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Alqudimi Technology</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Bring Your Old Photos{" "}
              <span className="text-primary">Back to Life</span>
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Transform damaged, faded memories into vibrant, high-quality images with our advanced Alqudimi restoration technology. Automatically remove scratches, add realistic colors, and enhance quality.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                onClick={onUploadClick}
                data-testid="button-upload-hero"
              >
                Upload Your Photo
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={onExamplesClick}
                data-testid="button-examples"
              >
                See Examples
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background" />
                <div className="w-8 h-8 rounded-full bg-primary/30 border-2 border-background" />
                <div className="w-8 h-8 rounded-full bg-primary/40 border-2 border-background" />
              </div>
              <span>10,000+ photos restored with Alqudimi</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative rounded-md overflow-hidden shadow-2xl">
              <div className="grid grid-cols-2">
                <div className="relative group">
                  <img 
                    src={beforeImage} 
                    alt="Original damaged photo" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-background/90 backdrop-blur-sm text-xs font-medium rounded-full">
                      Original
                    </span>
                  </div>
                </div>
                <div className="relative group">
                  <img 
                    src={afterImage} 
                    alt="Restored colorized photo" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 right-4">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      Restored
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
