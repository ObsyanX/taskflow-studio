import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20 pt-20 pb-16 sm:pt-32 sm:pb-24">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <CheckCircle2 className="h-4 w-4" />
            Modern Productivity Platform
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Organize Work Smarter with{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              TaskFlow Studio
            </span>
          </h1>

          {/* Subheading */}
          <p className="mb-8 text-lg text-muted-foreground sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            A powerful productivity platform that helps individuals and teams manage tasks, track workflows, and stay organized.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button asChild size="lg" className="gap-2 text-base px-8 py-6">
              <Link to="/auth">
                Start Managing Tasks
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base px-8 py-6">
              <Link to="/features">
                Explore Features
              </Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Trusted by thousands</span>
            </div>
          </div>
        </div>

        {/* Hero Image/Dashboard Preview */}
        <div className="mt-16 mx-auto max-w-6xl">
          <div className="relative rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-muted via-muted/50 to-background flex items-center justify-center">
              <div className="text-center space-y-4 p-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground">TaskFlow Studio Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bg-grid-pattern {
          background-image: linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px);
          background-size: 4rem 4rem;
        }
      `}</style>
    </section>
  );
}
