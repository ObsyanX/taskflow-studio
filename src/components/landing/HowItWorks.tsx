import { CheckCircle2, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create and organize tasks",
    description: "Start by creating tasks with titles, descriptions, priorities, and due dates. Organize them into categories and projects for better clarity.",
    highlights: ["Quick task creation", "Flexible categorization", "Priority levels"]
  },
  {
    number: "02",
    title: "Structure workflows and assign priorities",
    description: "Build efficient workflows by setting priorities, creating dependencies, and tracking progress. Customize your workflow to match your process.",
    highlights: ["Custom workflows", "Priority management", "Progress tracking"]
  },
  {
    number: "03",
    title: "Track progress in real time",
    description: "Monitor task completion, analyze productivity trends, and get insights into your work patterns with detailed analytics and dashboards.",
    highlights: ["Live updates", "Analytics dashboard", "Productivity metrics"]
  },
  {
    number: "04",
    title: "Achieve productivity and project clarity",
    description: "Complete tasks efficiently, meet deadlines consistently, and maintain clear visibility into all your projects and goals.",
    highlights: ["Goal achievement", "Deadline management", "Project clarity"]
  }
];

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            How TaskFlow Studio Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started in four simple steps and transform the way you manage tasks and workflows.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary-foreground">{step.number}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-3">
                    {step.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Connector Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex justify-center my-8">
                  <ArrowRight className="w-8 h-8 text-primary/40" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
