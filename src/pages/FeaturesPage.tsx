import { SEOHead } from "@/components/seo/SEOHead";
import { Features } from "@/components/landing/Features";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function FeaturesPage() {
  return (
    <>
      <SEOHead
        title="Features – TaskFlow Studio Task Management Platform"
        description="Discover all the powerful features of TaskFlow Studio: task management, workflow tracking, team collaboration, productivity insights, habit tracking, goal setting, and more."
        keywords="task management features, productivity tools, workflow tracking, team collaboration, habit tracker, goal setting, task analytics"
      />

      <div>
        {/* Hero Section */}
        <section className="pt-20 pb-12 sm:pt-28 sm:pb-16 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <CheckCircle2 className="h-4 w-4" />
                Complete Feature Set
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
                Everything you need to{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  stay productive
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                TaskFlow Studio provides a comprehensive suite of tools to manage tasks, track habits, achieve goals, and boost your productivity.
              </p>

              <Button asChild size="lg" className="gap-2">
                <Link to="/auth">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <Features />

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center bg-card border border-border rounded-2xl p-8 sm:p-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Ready to transform your productivity?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of users who trust TaskFlow Studio to manage their tasks and achieve their goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/auth">
                    Start Managing Tasks
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/pricing">
                    View Pricing
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
