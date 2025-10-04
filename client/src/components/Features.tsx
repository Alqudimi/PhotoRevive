import { Sparkles, Palette, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Sparkles,
    title: "Automatic Restoration",
    description: "AI detects and removes scratches, noise, and fading from damaged photos with professional precision.",
  },
  {
    icon: Palette,
    title: "Smart Colorization",
    description: "Transform black-and-white photos with realistic, historically accurate colors powered by deep learning.",
  },
  {
    icon: TrendingUp,
    title: "Quality Enhancement",
    description: "Upscale resolution and enhance sharpness using advanced super-resolution neural networks.",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold">Powered by Advanced AI</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our cutting-edge neural networks restore your precious memories with professional quality
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
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
