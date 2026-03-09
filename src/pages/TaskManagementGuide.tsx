import { SEOHead } from "@/components/seo/SEOHead";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  ArrowRight, 
  Target, 
  Users, 
  BarChart3, 
  Calendar,
  CheckSquare,
  Zap
} from "lucide-react";

export default function TaskManagementGuide() {
  return (
    <>
      <SEOHead
        title="Complete Task Management Guide 2026 – TaskFlow Studio"
        description="Master task management with this comprehensive guide. Learn proven strategies, best practices, and tools to organize tasks, boost productivity, and achieve your goals."
        keywords="task management guide, how to manage tasks, task organization, productivity guide, task management best practices, task management strategies"
      />

      <div className="min-h-screen bg-background">
        <Navbar />
        {/* Hero */}
        <section className="pt-20 pb-12 sm:pt-28 sm:pb-16 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <CheckCircle2 className="h-4 w-4" />
                Complete Guide
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
                The Complete{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Task Management
                </span>{" "}
                Guide
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Everything you need to know about managing tasks effectively, from basic principles to advanced strategies used by top performers.
              </p>

              <Button asChild size="lg" className="gap-2">
                <Link to="/auth">
                  Start Managing Tasks
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
              
              <h2>What is Task Management?</h2>
              <p>
                Task management is the process of managing tasks through their lifecycle—from creation to completion. It involves planning, tracking, and organizing work to ensure efficient execution and successful outcomes. Effective task management helps individuals and teams prioritize work, meet deadlines, and achieve goals.
              </p>

              <h2>Why Task Management Matters</h2>
              <p>
                In today's fast-paced work environment, proper task management is crucial for success:
              </p>
              <ul>
                <li><strong>Increased Productivity:</strong> Clear task lists prevent forgotten work and wasted time</li>
                <li><strong>Reduced Stress:</strong> Organized tasks provide clarity and control</li>
                <li><strong>Better Prioritization:</strong> Understand what matters most</li>
                <li><strong>Improved Collaboration:</strong> Teams stay aligned on who does what</li>
                <li><strong>Goal Achievement:</strong> Break big goals into manageable tasks</li>
              </ul>

              <h2>Core Task Management Principles</h2>

              <h3>1. Capture Everything</h3>
              <p>
                Your brain is for processing, not storing. Capture all tasks, ideas, and commitments in a trusted system. Use TaskFlow Studio to quickly capture tasks as they come to mind, ensuring nothing falls through the cracks.
              </p>

              <h3>2. Clarify and Define</h3>
              <p>
                Vague tasks create confusion. Every task should have:
              </p>
              <ul>
                <li>Clear description of what needs to be done</li>
                <li>Defined outcome or deliverable</li>
                <li>Realistic deadline</li>
                <li>Assigned owner</li>
              </ul>

              <h3>3. Organize Systematically</h3>
              <p>
                Group related tasks together using projects, categories, or tags. This provides context and makes it easier to focus on specific areas of work.
              </p>

              <h3>4. Review Regularly</h3>
              <p>
                Weekly reviews keep your task system healthy. Review completed work, update priorities, and plan for the week ahead.
              </p>

              <h3>5. Execute with Focus</h3>
              <p>
                When it's time to work, pick a task and give it your full attention. Single-tasking beats multitasking every time.
              </p>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-foreground mb-12">
                Essential Task Management Features
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-border">
                  <CardHeader>
                    <CheckSquare className="w-10 h-10 text-primary mb-3" />
                    <CardTitle>Task Lists</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Create, organize, and check off tasks with intuitive list views that keep you focused on what matters.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <Calendar className="w-10 h-10 text-primary mb-3" />
                    <CardTitle>Due Dates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Set deadlines and get reminders to ensure nothing is forgotten and all commitments are met.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <Target className="w-10 h-10 text-primary mb-3" />
                    <CardTitle>Priorities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Mark tasks as high, medium, or low priority to focus on what's most important first.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <Users className="w-10 h-10 text-primary mb-3" />
                    <CardTitle>Collaboration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Assign tasks to team members, share projects, and collaborate on shared goals.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <BarChart3 className="w-10 h-10 text-primary mb-3" />
                    <CardTitle>Progress Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Visualize completion rates, track streaks, and monitor productivity trends over time.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <Zap className="w-10 h-10 text-primary mb-3" />
                    <CardTitle>Automation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Set up recurring tasks, automatic reminders, and smart notifications to save time.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
              <h2>Task Management Best Practices</h2>

              <h3>Start Small and Build Habits</h3>
              <p>
                Don't try to implement a complex system overnight. Start with basic task lists and gradually add features like priorities, due dates, and categories as you become comfortable.
              </p>

              <h3>Use the Two-Minute Rule</h3>
              <p>
                If a task takes less than two minutes, do it immediately rather than adding it to your list. This prevents small tasks from cluttering your system.
              </p>

              <h3>Limit Work in Progress</h3>
              <p>
                Focus on completing tasks rather than starting many. Limit yourself to 3-5 active tasks at any time to maintain focus and momentum.
              </p>

              <h3>Batch Similar Tasks</h3>
              <p>
                Group similar tasks together and complete them in one session. This reduces context switching and improves efficiency.
              </p>

              <h3>Review and Reflect</h3>
              <p>
                Set aside time each week to review completed tasks, celebrate wins, and plan for the week ahead. Monthly reviews help assess long-term progress.
              </p>

              <h2>Common Task Management Mistakes</h2>

              <h3>Mistake 1: Keeping Tasks in Your Head</h3>
              <p>
                Your memory is unreliable. Always capture tasks in a trusted system where they can be reviewed and acted upon.
              </p>

              <h3>Mistake 2: Creating Vague Tasks</h3>
              <p>
                "Work on project" is too vague. Be specific: "Write introduction section for project proposal."
              </p>

              <h3>Mistake 3: No Prioritization</h3>
              <p>
                When everything is equally important, nothing is important. Ruthlessly prioritize to focus on what truly matters.
              </p>

              <h3>Mistake 4: Overcomplicating the System</h3>
              <p>
                Complex systems become overwhelming and abandoned. Keep your task management simple and sustainable.
              </p>

              <h2>Getting Started with TaskFlow Studio</h2>
              <p>
                TaskFlow Studio makes task management intuitive and enjoyable. Here's how to get started:
              </p>
              <ol>
                <li><strong>Create an account:</strong> Sign up free in seconds</li>
                <li><strong>Add your first tasks:</strong> Capture everything on your mind</li>
                <li><strong>Set priorities:</strong> Mark what's most important</li>
                <li><strong>Add due dates:</strong> Schedule time-sensitive tasks</li>
                <li><strong>Start completing:</strong> Check off tasks and build momentum</li>
              </ol>

              <p>
                TaskFlow Studio combines task management with habit tracking, goal setting, and productivity analytics to provide a complete productivity solution.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-8 sm:p-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Ready to master task management?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Start using TaskFlow Studio today and transform the way you manage tasks and achieve goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/auth">
                    Get Started Free
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

        <Footer />
      </div>
    </>
  );
}
