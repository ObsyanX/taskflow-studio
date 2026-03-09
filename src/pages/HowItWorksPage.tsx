import { SEOHead } from "@/components/seo/SEOHead";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <>
      <SEOHead
        title="How It Works – TaskFlow Studio Task Management"
        description="Learn how TaskFlow Studio helps you organize tasks, structure workflows, track progress, and achieve productivity. Step-by-step guide to getting started."
        keywords="how task management works, productivity workflow, task organization guide, project management process"
      />

      <div>
        {/* Hero Section */}
        <section className="pt-20 pb-12 sm:pt-28 sm:pb-16 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <CheckCircle2 className="h-4 w-4" />
                Simple and Effective
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
                Get started in{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  four simple steps
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                TaskFlow Studio makes task management and productivity simple. Here's how you can transform your workflow.
              </p>

              <Button asChild size="lg" className="gap-2">
                <Link to="/auth">
                  Start Now
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <HowItWorks />

        {/* Benefits Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Why TaskFlow Studio works
              </h2>
              <p className="text-lg text-muted-foreground">
                Built with productivity in mind, designed for real-world workflows
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Intuitive Design
                </h3>
                <p className="text-muted-foreground">
                  Clean, modern interface that's easy to learn and enjoyable to use every day.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Flexible Workflows
                </h3>
                <p className="text-muted-foreground">
                  Adapt to your unique process with customizable task management and tracking.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Data-Driven Insights
                </h3>
                <p className="text-muted-foreground">
                  Make better decisions with analytics and trends that show what's working.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-8 sm:p-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Ready to get started?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of users transforming their productivity with TaskFlow Studio.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/auth">
                    Create Free Account
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/features">
                    Explore Features
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        
      </div>
    </>
  );
}
