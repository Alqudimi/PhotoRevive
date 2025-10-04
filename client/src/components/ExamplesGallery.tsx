import { useState } from "react";
import { Card } from "@/components/ui/card";
import beforeImage1 from "@assets/generated_images/Vintage_damaged_family_photo_23f9ee2a.png";
import afterImage1 from "@assets/generated_images/Restored_colorized_vintage_photo_3f663333.png";
import beforeImage2 from "@assets/generated_images/Old_faded_portrait_woman_8dd55ebe.png";
import afterImage2 from "@assets/generated_images/Restored_colorized_portrait_woman_b504a183.png";
import beforeImage3 from "@assets/generated_images/Damaged_vintage_landscape_photo_1b121723.png";
import afterImage3 from "@assets/generated_images/Restored_landscape_photo_colors_e5472791.png";

const examples = [
  { before: beforeImage1, after: afterImage1, title: "Family Portrait" },
  { before: beforeImage2, after: afterImage2, title: "Vintage Portrait" },
  { before: beforeImage3, after: afterImage3, title: "Landscape Scene" },
  { before: beforeImage1, after: afterImage1, title: "Group Photo" },
];

export function ExamplesGallery() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="examples" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold">Restoration Examples</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See the dramatic transformations our AI can achieve with your old photos
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {examples.map((example, index) => (
            <Card
              key={index}
              className="relative overflow-hidden cursor-pointer group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              data-testid={`example-card-${index}`}
            >
              <div className="aspect-[3/4] relative">
                <img
                  src={hoveredIndex === index ? example.after : example.before}
                  alt={example.title}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-sm font-medium">{example.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {hoveredIndex === index ? "Restored" : "Original"}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
