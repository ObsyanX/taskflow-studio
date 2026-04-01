import { SEOHead } from "@/components/seo/SEOHead";
import { StructuredData } from "@/components/seo/StructuredData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Heart, 
  Target, 
  User, 
  Code2, 
  Sparkles,
  Calendar
} from "lucide-react";

const techStack = [
  { name: "React", color: "bg-sky-500/10 text-sky-600 border-sky-500/20" },
  { name: "TypeScript", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { name: "Supabase", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { name: "Vercel", color: "bg-foreground/10 text-foreground border-foreground/20" },
  { name: "Tailwind CSS", color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20" },
  { name: "shadcn/ui", color: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const faqData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is BloomScheduler?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "BloomScheduler is a modern scheduling and productivity platform designed to simplify meeting coordination, automate booking workflows, and help individuals and teams manage their time efficiently."
      }
    },
    {
      "@type": "Question",
      "name": "Who built BloomScheduler?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "BloomScheduler was created by Sayan Dutta, a Computer Science and Engineering student and software developer focused on building intelligent web applications and SaaS products."
      }
    }
  ]
};

export default function AboutPage() {
  return (
    <>
      <SEOHead
        title="About BloomScheduler – Our Story, Mission & Team"
        description="Learn about BloomScheduler, the modern scheduling platform built to simplify meeting coordination and boost productivity. Meet the developer and discover our mission."
        keywords="about BloomScheduler, scheduling platform, SaaS, productivity, Sayan Dutta, mission"
      />
      <StructuredData type="FAQPage" data={faqData} />

      <div>
        {/* Hero Section */}
        <section className="pt-20 pb-16 sm:pt-28 sm:pb-20 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="max-w-4xl mx-auto text-center" {...fadeUp}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <Calendar className="h-4 w-4" />
                About Us
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
                About{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  BloomScheduler
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                BloomScheduler is a modern scheduling platform designed to simplify meeting coordination, automate booking workflows, and help individuals and teams manage their time efficiently.
              </p>

              <p className="mt-6 text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                BloomScheduler was created to eliminate the back-and-forth communication involved in scheduling meetings. With simple booking links, smart availability management, and an intuitive interface, the platform makes scheduling seamless for professionals, teams, and businesses.
              </p>
            </motion.div>
          </div>
        </section>

        {/* The Story */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="max-w-3xl mx-auto" {...fadeUp}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                  Why BloomScheduler Was Built
                </h2>
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                In today's fast-paced digital environment, coordinating meetings and managing availability often becomes unnecessarily complicated. BloomScheduler was created to solve this problem by providing a clean, efficient scheduling platform that automates the process.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The goal is to help professionals spend less time organizing meetings and more time focusing on meaningful work.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="max-w-3xl mx-auto text-center" {...fadeUp}>
              <div className="mx-auto mb-6 h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                The mission of BloomScheduler is to simplify scheduling through intelligent automation and thoughtful design. The platform aims to provide a reliable scheduling solution that reduces friction, improves productivity, and enables seamless collaboration.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Developer Profile */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="max-w-3xl mx-auto" {...fadeUp}>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-10 text-center">
                Meet the Developer
              </h2>
              
              <Card className="border-border bg-card overflow-hidden">
                <CardContent className="p-8 sm:p-10">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                    {/* Profile Photo */}
                    <div className="shrink-0">
                      <div className="h-28 w-28 rounded-full border-4 border-primary/10 shadow-lg overflow-hidden">
                        <img
                          src="https://res.cloudinary.com/dpmtulfdy/image/upload/v1774867601/creator-photo_oje6z6.png"
                          alt="Profile"
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="text-center sm:text-left">
                      <h3 className="text-2xl font-bold text-foreground mb-1">Sayan Dutta</h3>
                      <p className="text-primary font-medium mb-4">Software Developer & Creator of BloomScheduler</p>
                      <p className="text-muted-foreground leading-relaxed">
                        Sayan Dutta is a Computer Science and Engineering student and developer focused on building intelligent web applications and SaaS products. BloomScheduler was developed as part of an effort to create practical tools that simplify everyday workflows and improve productivity through thoughtful design and modern technology.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="max-w-3xl mx-auto text-center" {...fadeUp}>
              <div className="mx-auto mb-6 h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Code2 className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Technology Behind BloomScheduler
              </h2>
              <p className="text-lg text-muted-foreground mb-10">
                BloomScheduler is built using modern web technologies to ensure performance, reliability, and scalability.
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                {techStack.map((tech) => (
                  <span
                    key={tech.name}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold border ${tech.color}`}
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="max-w-3xl mx-auto text-center" {...fadeUp}>
              <div className="mx-auto mb-6 h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Start Scheduling Smarter
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Experience a simpler way to manage meetings and appointments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 px-8 py-6 text-base">
                  <Link to="/auth">
                    Try BloomScheduler
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8 py-6 text-base">
                  <Link to="/app">Go to Dashboard</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
