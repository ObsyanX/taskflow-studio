import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check, CheckCircle2 } from "lucide-react";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for individuals getting started with task management",
    features: [
      "Unlimited tasks",
      "Basic task management",
      "Habit tracking",
      "Goal setting",
      "Diary journaling",
      "Mobile responsive",
      "Community support"
    ],
    cta: "Get Started Free",
    highlighted: false
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "Ideal for professionals who need advanced features",
    features: [
      "Everything in Free",
      "Advanced analytics",
      "Priority support",
      "Custom categories",
      "Export & reports",
      "Team collaboration",
      "Unlimited integrations",
      "Advanced workflows"
    ],
    cta: "Start Pro Trial",
    highlighted: true
  },
  {
    name: "Team",
    price: "$19",
    period: "per user/month",
    description: "Built for teams that need collaboration and control",
    features: [
      "Everything in Pro",
      "Team management",
      "Shared workspaces",
      "Role-based access",
      "Advanced permissions",
      "Dedicated support",
      "Custom onboarding",
      "SLA guarantee"
    ],
    cta: "Contact Sales",
    highlighted: false
  }
];

export default function PricingPage() {
  return (
    <>
      <SEOHead
        title="Pricing – TaskFlow Studio Task Management Platform"
        description="Choose the perfect TaskFlow Studio plan for your needs. Start free or upgrade to Pro and Team plans for advanced features, collaboration, and priority support."
        keywords="task management pricing, productivity software pricing, task app plans, team collaboration pricing"
      />

      <div>
        {/* Hero Section */}
        <section className="pt-20 pb-12 sm:pt-28 sm:pb-16 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <CheckCircle2 className="h-4 w-4" />
                Simple, Transparent Pricing
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
                Choose the{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  perfect plan
                </span>{" "}
                for you
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Start free and upgrade as you grow. All plans include core features to help you stay productive.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative ${
                    plan.highlighted
                      ? "border-primary shadow-lg scale-105"
                      : "border-border"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground ml-2">/ {plan.period}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  
                  <CardFooter>
                    <Button
                      asChild
                      className="w-full"
                      variant={plan.highlighted ? "default" : "outline"}
                    >
                      <Link to="/auth">{plan.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-12">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Can I change plans later?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                  </p>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Is there a free trial for paid plans?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes, we offer a 14-day free trial for Pro and Team plans. No credit card required.
                  </p>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-muted-foreground">
                    We accept all major credit cards, PayPal, and bank transfers for annual plans.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
