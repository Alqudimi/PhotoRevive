import { Sparkles, Palette, TrendingUp, Brain, Wand2, Image as ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: TrendingUp,
    title: "Super-Resolution",
    subtitle: "Powered by SwinIR",
    description: "Upscale and enhance image quality using state-of-the-art Swin Transformer technology for stunning detail.",
  },
  {
    icon: Sparkles,
    title: "Face Enhancement",
    subtitle: "Powered by CodeFormer",
    description: "Restore and enhance faces with robust blind face restoration using codebook lookup transformers.",
  },
  {
    icon: Palette,
    title: "Photo-Realistic Colorization",
    subtitle: "Powered by DDColor",
    description: "Transform black-and-white photos with realistic, vibrant colors using dual decoder architecture.",
  },
  {
    icon: Brain,
    title: "Text-Based Control",
    subtitle: "Powered by InstructIR",
    description: "Guide restoration with natural language instructions like 'Remove noise and enhance details'.",
  },
  {
    icon: Wand2,
    title: "Damage Removal",
    subtitle: "Inpainting Technology",
    description: "Automatically detect and remove scratches, tears, and damage from old photographs.",
  },
  {
    icon: ImageIcon,
    title: "Complete Pipeline",
    subtitle: "All-in-One Solution",
    description: "Combine multiple AI models in a single workflow for comprehensive photo restoration.",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold">Powered by Alqudimi Technology</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Leveraging state-of-the-art AI models and cutting-edge research from leading institutions to bring your memories back to life
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-8 space-y-4 hover-elevate transition-all"
              data-testid={`card-feature-${index}`}
            >
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-xs text-primary font-medium mt-1">{feature.subtitle}</p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block px-6 py-3 bg-primary/5 border border-primary/20 rounded-full">
            <p className="text-sm font-medium text-muted-foreground">
              Research-backed models: <span className="text-primary">SwinIR (ICCV 2021)</span> • 
              <span className="text-primary"> CodeFormer (NeurIPS 2022)</span> • 
              <span className="text-primary"> DDColor (ICCV 2023)</span> • 
              <span className="text-primary"> InstructIR (ECCV 2024)</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
