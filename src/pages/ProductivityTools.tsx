import { SEOHead } from "@/components/seo/SEOHead";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  ArrowRight, 
  CheckSquare,
  Target,
  Calendar,
  BarChart3,
  Zap,
  BookOpen,
  TrendingUp,
  Clock
} from "lucide-react";

const tools = [
  {
    icon: CheckSquare,
    title: "Task Management",
    description: "Create, organize, and track tasks with priorities, due dates, and categories. Never miss a deadline again.",
    link: "/task-management-guide"
  },
  {
    icon: Target,
    title: "Habit Tracking",
    description: "Build better habits with streak tracking, completion calendars, and visual progress indicators.",
    link: "/features"
  },
  {
    icon: Calendar,
    title: "Goal Setting",
    description: "Set long-term goals with milestones, deadlines, and progress tracking to achieve what matters most.",
    link: "/features"
  },
  {
    icon: BookOpen,
    title: "Diary Journaling",
    description: "Reflect on your day with encrypted diary entries, mood tracking, and thoughtful prompts.",
    link: "/features"
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Monitor productivity trends, completion rates, and performance metrics with detailed visualizations.",
    link: "/features"
  },
  {
    icon: TrendingUp,
    title: "Workflow Tracking",
    description: "Visualize your workflow stages and track progress through customizable kanban-style boards.",
    link: "/workflow-management"
  }
];

export default function ProductivityTools() {
  return (
    <>
      <SEOHead
        title="Best Productivity Tools 2026 – TaskFlow Studio"
        description="Discover the best productivity tools to organize work, manage tasks, track habits, and achieve goals. Complete guide to modern productivity software and techniques."
        keywords="productivity tools, best productivity apps, task management tools, habit tracker, goal setting app, productivity software, time management tools"
      />

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="pt-20 pb-12 sm:pt-28 sm:pb-16 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <CheckCircle2 className="h-4 w-4" />
                Productivity Guide
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
                Best{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Productivity Tools
                </span>{" "}
                for 2026
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Discover the tools and techniques that help individuals and teams work smarter, stay organized, and achieve their goals.
              </p>

              <Button asChild size="lg" className="gap-2">
                <Link to="/auth">
                  Try TaskFlow Studio Free
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
              
              <h2>What Makes a Great Productivity Tool?</h2>
              <p>
                The best productivity tools share common characteristics that make them effective for managing work and achieving goals:
              </p>
              <ul>
                <li><strong>Intuitive Interface:</strong> Easy to learn and use without extensive training</li>
                <li><strong>Flexibility:</strong> Adapts to your workflow rather than forcing you to adapt</li>
                <li><strong>Integration:</strong> Works well with other tools you already use</li>
                <li><strong>Reliability:</strong> Always available when you need it</li>
                <li><strong>Analytics:</strong> Provides insights into your productivity patterns</li>
              </ul>

              <h2>Categories of Productivity Tools</h2>
              
              <h3>Task Management Tools</h3>
              <p>
                Task management tools help you capture, organize, and complete tasks efficiently. They range from simple to-do lists to comprehensive project management platforms.
              </p>
              <p>
                <strong>Key Features to Look For:</strong>
              </p>
              <ul>
                <li>Quick task capture</li>
                <li>Priority levels</li>
                <li>Due dates and reminders</li>
                <li>Categories and tags</li>
                <li>Recurring tasks</li>
                <li>Search and filtering</li>
              </ul>

              <h3>Time Management Tools</h3>
              <p>
                Time management tools help you understand where your time goes and make better decisions about how to spend it.
              </p>
              <ul>
                <li>Time tracking and logging</li>
                <li>Calendar integration</li>
                <li>Pomodoro timers</li>
                <li>Schedule optimization</li>
              </ul>

              <h3>Habit Tracking Tools</h3>
              <p>
                Habit trackers help you build positive routines by tracking consistency and visualizing progress over time.
              </p>
              <ul>
                <li>Daily check-ins</li>
                <li>Streak tracking</li>
                <li>Progress visualization</li>
                <li>Reminder notifications</li>
              </ul>

              <h3>Goal Setting Tools</h3>
              <p>
                Goal setting tools help you define objectives, break them into actionable steps, and track progress toward achievement.
              </p>
              <ul>
                <li>Goal creation and planning</li>
                <li>Milestone tracking</li>
                <li>Progress percentage</li>
                <li>Deadline management</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-foreground mb-4">
                TaskFlow Studio: All-in-One Productivity Platform
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Instead of juggling multiple apps, TaskFlow Studio combines essential productivity tools in one integrated platform.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool, index) => (
                  <Card key={index} className="border-border hover:border-primary/50 transition-all duration-300">
                    <CardHeader>
                      <tool.icon className="w-10 h-10 text-primary mb-3" />
                      <CardTitle>{tool.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base mb-4">
                        {tool.description}
                      </CardDescription>
                      <Link 
                        to={tool.link} 
                        className="text-primary text-sm font-medium hover:underline"
                      >
                        Learn more →
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
              <h2>Productivity Tool Best Practices</h2>

              <h3>Start with One Tool</h3>
              <p>
                Don't try to implement multiple productivity tools at once. Start with a single, comprehensive platform like TaskFlow Studio and master it before adding others.
              </p>

              <h3>Establish Daily Routines</h3>
              <p>
                The best productivity tools are only effective when used consistently. Build daily habits around:
              </p>
              <ul>
                <li>Morning planning sessions</li>
                <li>Task capture throughout the day</li>
                <li>End-of-day reviews</li>
                <li>Weekly reflection and planning</li>
              </ul>

              <h3>Keep It Simple</h3>
              <p>
                Complex systems create friction. Use only the features you need and add complexity gradually as you become comfortable.
              </p>

              <h3>Review and Adjust</h3>
              <p>
                Regularly evaluate whether your tools are serving your needs. If something isn't working, adjust your approach or try different features.
              </p>

              <h2>Choosing the Right Productivity Tool</h2>
              <p>
                Consider these factors when selecting productivity tools:
              </p>
              <ul>
                <li><strong>Your workflow:</strong> Does the tool fit how you naturally work?</li>
                <li><strong>Team vs. individual:</strong> Do you need collaboration features?</li>
                <li><strong>Platform:</strong> Is it available on all your devices?</li>
                <li><strong>Price:</strong> Does it fit your budget?</li>
                <li><strong>Learning curve:</strong> How quickly can you get productive?</li>
              </ul>

              <h2>Why TaskFlow Studio?</h2>
              <p>
                TaskFlow Studio provides the perfect balance of power and simplicity:
              </p>
              <ul>
                <li>Modern, intuitive interface that's enjoyable to use</li>
                <li>Comprehensive feature set without overwhelming complexity</li>
                <li>Integrated tools that work together seamlessly</li>
                <li>Free tier that covers essential needs</li>
                <li>Regular updates with new features and improvements</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-8 sm:p-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Ready to boost your productivity?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Start using TaskFlow Studio today and experience the difference an integrated productivity platform makes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/auth">
                    Get Started Free
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/blog">
                    Read Our Blog
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
