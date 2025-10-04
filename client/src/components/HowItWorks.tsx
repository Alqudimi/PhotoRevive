import { Upload, Cpu, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Photo",
    description: "Simply drag and drop your old or damaged photo into our secure platform.",
  },
  {
    icon: Cpu,
    title: "AI Processing",
    description: "Our advanced neural networks analyze, restore, colorize, and enhance your image.",
  },
  {
    icon: Download,
    title: "Download Results",
    description: "Get your beautifully restored photo in high quality, ready to share and preserve.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Restore your precious memories in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center space-y-4" data-testid={`step-${index}`}>
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center relative">
                  <step.icon className="w-10 h-10 text-primary" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
