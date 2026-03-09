import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  ArrowRight, 
  ListTodo,
  Calendar,
  Target,
  Clock,
  Lightbulb,
  CheckSquare
} from "lucide-react";

export default function TaskPlanningGuide() {
  return (
    <>
      <SEOHead
        title="Task Planning Guide 2026 – Plan Tasks Effectively | TaskFlow Studio"
        description="Master task planning with proven strategies. Learn to break down projects, estimate time, prioritize work, and create actionable plans that drive results."
        keywords="task planning, how to plan tasks, task breakdown, project planning, task estimation, task prioritization, planning strategies"
      />

      <div className="min-h-screen bg-background">
        <Navbar />
        {/* Hero */}
        <section className="pt-20 pb-12 sm:pt-28 sm:pb-16 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <ListTodo className="h-4 w-4" />
                Planning Guide
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
                The Complete{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Task Planning
                </span>{" "}
                Guide
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Learn how to plan tasks effectively, break down complex projects, and create actionable plans that lead to successful completion.
              </p>

              <Button asChild size="lg" className="gap-2">
                <Link to="/auth">
                  Start Planning Tasks
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
              
              <h2>Why Task Planning Matters</h2>
              <p>
                Effective task planning is the foundation of productivity. Without a clear plan, even simple projects can become overwhelming, deadlines get missed, and important work falls through the cracks.
              </p>
              <p>
                Good task planning helps you:
              </p>
              <ul>
                <li>Understand the full scope of work before starting</li>
                <li>Identify dependencies and potential blockers early</li>
                <li>Allocate time and resources appropriately</li>
                <li>Track progress and stay on schedule</li>
                <li>Communicate clearly with stakeholders</li>
              </ul>

              <h2>The Task Planning Process</h2>

              <h3>Step 1: Define the Outcome</h3>
              <p>
                Before planning tasks, clearly define what success looks like. Ask yourself:
              </p>
              <ul>
                <li>What is the final deliverable?</li>
                <li>What criteria will indicate completion?</li>
                <li>Who needs to approve or accept the result?</li>
                <li>When does it need to be done?</li>
              </ul>

              <h3>Step 2: Break Down the Work</h3>
              <p>
                Large projects are overwhelming. Break them into smaller, manageable tasks:
              </p>
              <ul>
                <li><strong>Work Breakdown Structure:</strong> Decompose the project into phases, then tasks, then subtasks</li>
                <li><strong>Actionable Tasks:</strong> Each task should be specific enough that you know exactly what to do</li>
                <li><strong>Right Size:</strong> Tasks should take between 30 minutes and 4 hours. Smaller tasks create overhead; larger tasks are hard to track</li>
              </ul>

              <h3>Step 3: Identify Dependencies</h3>
              <p>
                Determine which tasks depend on others:
              </p>
              <ul>
                <li><strong>Sequential Dependencies:</strong> Task B can't start until Task A is complete</li>
                <li><strong>Resource Dependencies:</strong> Tasks requiring the same person or tool</li>
                <li><strong>External Dependencies:</strong> Waiting for approvals, vendors, or other teams</li>
              </ul>

              <h3>Step 4: Estimate Time</h3>
              <p>
                Time estimation is challenging but essential:
              </p>
              <ul>
                <li><strong>Use Historical Data:</strong> How long did similar tasks take before?</li>
                <li><strong>Add Buffer:</strong> Things usually take longer than expected. Add 20-30% buffer</li>
                <li><strong>Account for Interruptions:</strong> You won't have 8 hours of focused work in a day</li>
                <li><strong>Consider Complexity:</strong> New or uncertain tasks take longer</li>
              </ul>

              <h3>Step 5: Prioritize Tasks</h3>
              <p>
                Not all tasks are equally important. Prioritize using:
              </p>
              <ul>
                <li><strong>Urgency:</strong> What's the deadline?</li>
                <li><strong>Importance:</strong> What's the impact if not done?</li>
                <li><strong>Dependencies:</strong> What's blocking other work?</li>
                <li><strong>Effort:</strong> Quick wins vs. major investments</li>
              </ul>

              <h3>Step 6: Schedule and Assign</h3>
              <p>
                Put tasks on the calendar:
              </p>
              <ul>
                <li>Assign specific dates or time blocks</li>
                <li>Designate owners for each task</li>
                <li>Leave buffer time for unexpected issues</li>
                <li>Balance workload across team members</li>
              </ul>

              <h2>Task Planning Techniques</h2>

              <h3>Time Boxing</h3>
              <p>
                Allocate fixed time periods for tasks rather than working until done. This prevents perfectionism and keeps you moving forward.
              </p>

              <h3>Reverse Planning</h3>
              <p>
                Start from the deadline and work backward, scheduling each task to ensure on-time completion.
              </p>

              <h3>Daily Planning</h3>
              <p>
                Each morning, identify your top 3 priorities for the day. This focuses your energy on what matters most.
              </p>

              <h3>Weekly Planning</h3>
              <p>
                Review the upcoming week every Sunday or Monday. Schedule important tasks first, then fit in routine work around them.
              </p>

              <h2>Common Task Planning Mistakes</h2>

              <h3>Mistake 1: Vague Tasks</h3>
              <p>
                "Work on project" is not a task. Be specific: "Write introduction section for project proposal."
              </p>

              <h3>Mistake 2: No Estimates</h3>
              <p>
                Tasks without time estimates are hard to schedule and easy to procrastinate. Always estimate duration.
              </p>

              <h3>Mistake 3: Overplanning</h3>
              <p>
                Don't plan more than 2 weeks in detail. Too much planning becomes outdated quickly and wastes time.
              </p>

              <h3>Mistake 4: Ignoring Reality</h3>
              <p>
                You can't work 8 productive hours every day. Account for meetings, email, and unexpected issues.
              </p>

              <h3>Mistake 5: No Review</h3>
              <p>
                Plans need regular review and adjustment. Schedule weekly reviews to update priorities and timelines.
              </p>

              <h2>Task Planning with TaskFlow Studio</h2>
              <p>
                TaskFlow Studio makes task planning intuitive and efficient:
              </p>
              <ul>
                <li><strong>Quick Capture:</strong> Add tasks quickly before you forget</li>
                <li><strong>Easy Organization:</strong> Group tasks by project or category</li>
                <li><strong>Priority Levels:</strong> Mark tasks as high, medium, or low priority</li>
                <li><strong>Due Dates:</strong> Set deadlines and get reminders</li>
                <li><strong>Progress Tracking:</strong> See what's done and what's pending</li>
                <li><strong>Analytics:</strong> Review your productivity patterns</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Planning Steps Visual */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-foreground mb-12">
                The 6-Step Task Planning Framework
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">1. Define Outcome</h3>
                  <p className="text-muted-foreground">
                    Clearly define what success looks like and when it's needed.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <ListTodo className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">2. Break It Down</h3>
                  <p className="text-muted-foreground">
                    Decompose large projects into manageable, actionable tasks.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Lightbulb className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">3. Find Dependencies</h3>
                  <p className="text-muted-foreground">
                    Identify which tasks depend on others or external factors.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">4. Estimate Time</h3>
                  <p className="text-muted-foreground">
                    Assign realistic time estimates with appropriate buffer.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <CheckSquare className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">5. Prioritize</h3>
                  <p className="text-muted-foreground">
                    Rank tasks by urgency, importance, and impact.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">6. Schedule</h3>
                  <p className="text-muted-foreground">
                    Assign dates, times, and owners to each task.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-8 sm:p-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Ready to plan tasks more effectively?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Start using TaskFlow Studio to plan, organize, and complete tasks with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/auth">
                    Get Started Free
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/productivity-tools">
                    Explore Tools
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
