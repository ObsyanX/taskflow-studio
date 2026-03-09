import { SEOHead } from "@/components/seo/SEOHead";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  ArrowRight, 
  GitBranch,
  Settings,
  Zap,
  BarChart3,
  Users,
  Clock
} from "lucide-react";

export default function WorkflowManagement() {
  return (
    <>
      <SEOHead
        title="Workflow Management Guide 2026 – TaskFlow Studio"
        description="Master workflow management with this comprehensive guide. Learn to design, optimize, and automate workflows for maximum efficiency and team productivity."
        keywords="workflow management, workflow optimization, business process management, workflow automation, workflow software, process improvement"
      />

      <div className="min-h-screen bg-background">
        <Navbar />
        {/* Hero */}
        <section className="pt-20 pb-12 sm:pt-28 sm:pb-16 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <GitBranch className="h-4 w-4" />
                Complete Guide
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Workflow Management
                </span>{" "}
                Guide
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Learn how to design, implement, and optimize workflows that improve efficiency, reduce errors, and help your team deliver better results.
              </p>

              <Button asChild size="lg" className="gap-2">
                <Link to="/auth">
                  Start Optimizing Workflows
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
              
              <h2>What is Workflow Management?</h2>
              <p>
                Workflow management is the process of designing, executing, and monitoring defined task sequences to achieve specific business outcomes. It involves coordinating people, processes, and technology to move work efficiently from start to completion.
              </p>
              <p>
                Effective workflow management ensures that:
              </p>
              <ul>
                <li>Work flows smoothly between team members and stages</li>
                <li>Bottlenecks are identified and eliminated</li>
                <li>Resources are used efficiently</li>
                <li>Quality standards are maintained</li>
                <li>Progress is visible to all stakeholders</li>
              </ul>

              <h2>Benefits of Workflow Management</h2>

              <h3>Increased Efficiency</h3>
              <p>
                Well-designed workflows eliminate unnecessary steps, reduce wait times, and ensure work moves quickly through each stage. Teams spend less time on logistics and more time on productive work.
              </p>

              <h3>Improved Consistency</h3>
              <p>
                Defined workflows ensure that work is completed the same way every time, reducing errors and maintaining quality standards regardless of who performs the tasks.
              </p>

              <h3>Better Visibility</h3>
              <p>
                Workflow management provides clear visibility into where work stands, who's responsible for what, and where bottlenecks occur. This transparency enables better decision-making.
              </p>

              <h3>Enhanced Collaboration</h3>
              <p>
                Clear workflows define handoffs between team members, reducing confusion and ensuring smooth collaboration across departments and roles.
              </p>

              <h2>Types of Workflows</h2>

              <h3>Sequential Workflows</h3>
              <p>
                Tasks are completed in a specific order, with each step depending on the completion of the previous one. Common in approval processes and manufacturing.
              </p>
              <p><strong>Example:</strong> Document approval moving from draft → review → revision → final approval → publication.</p>

              <h3>Parallel Workflows</h3>
              <p>
                Multiple tasks can occur simultaneously, speeding up overall completion time. Useful when tasks are independent of each other.
              </p>
              <p><strong>Example:</strong> Website launch with design, content, and development tracks running concurrently.</p>

              <h3>State Machine Workflows</h3>
              <p>
                Work items move between states based on specific triggers or conditions. Provides flexibility for complex processes with multiple possible paths.
              </p>
              <p><strong>Example:</strong> Support ticket moving between New → Assigned → In Progress → Resolved → Closed based on agent actions.</p>

              <h2>Designing Effective Workflows</h2>

              <h3>Step 1: Document Current State</h3>
              <p>
                Before improving, understand your current process. Map out all steps, participants, decision points, and pain points.
              </p>

              <h3>Step 2: Define Objectives</h3>
              <p>
                Set clear goals for what the workflow should achieve. Common objectives include:
              </p>
              <ul>
                <li>Reduce cycle time by X%</li>
                <li>Decrease error rate</li>
                <li>Improve customer satisfaction</li>
                <li>Reduce costs</li>
              </ul>

              <h3>Step 3: Identify Improvements</h3>
              <p>
                Look for opportunities to:
              </p>
              <ul>
                <li>Eliminate unnecessary steps</li>
                <li>Automate repetitive tasks</li>
                <li>Parallelize independent activities</li>
                <li>Add quality checkpoints</li>
                <li>Clarify handoffs between roles</li>
              </ul>

              <h3>Step 4: Design the New Workflow</h3>
              <p>
                Create the optimized workflow with clear stages, responsibilities, and transition criteria. Keep it as simple as possible while meeting objectives.
              </p>

              <h3>Step 5: Implement and Iterate</h3>
              <p>
                Roll out the new workflow gradually, gather feedback, and refine based on real-world experience. Workflows should evolve as your needs change.
              </p>

              <h2>Workflow Management Best Practices</h2>

              <h3>Keep It Simple</h3>
              <p>
                Complex workflows confuse users and slow adoption. Start with the minimum viable process and add complexity only when necessary.
              </p>

              <h3>Define Clear Ownership</h3>
              <p>
                Every task and stage needs a clear owner. Ambiguous ownership leads to delays and dropped work.
              </p>

              <h3>Build in Quality Gates</h3>
              <p>
                Add checkpoints where work is reviewed before moving to the next stage. Catching issues early is cheaper than fixing them later.
              </p>

              <h3>Monitor and Measure</h3>
              <p>
                Track key metrics like cycle time, throughput, and error rate. Use data to identify improvement opportunities.
              </p>

              <h3>Automate Where Possible</h3>
              <p>
                Identify repetitive, rule-based tasks that can be automated. Automation reduces errors and frees people for higher-value work.
              </p>

              <h2>Workflow Management with TaskFlow Studio</h2>
              <p>
                TaskFlow Studio provides intuitive workflow management features:
              </p>
              <ul>
                <li><strong>Visual Task Boards:</strong> See work status at a glance</li>
                <li><strong>Custom Stages:</strong> Define workflow stages that match your process</li>
                <li><strong>Priority Management:</strong> Ensure important work gets attention</li>
                <li><strong>Progress Tracking:</strong> Monitor completion rates and trends</li>
                <li><strong>Team Collaboration:</strong> Assign tasks and coordinate handoffs</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Key Benefits Grid */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-foreground mb-12">
                Workflow Management Capabilities
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-card border border-border rounded-xl p-6">
                  <Settings className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Process Design</h3>
                  <p className="text-muted-foreground">
                    Create and customize workflows that match your unique business processes.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <Zap className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Automation</h3>
                  <p className="text-muted-foreground">
                    Automate repetitive tasks, notifications, and status updates.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <BarChart3 className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Analytics</h3>
                  <p className="text-muted-foreground">
                    Track workflow performance with detailed metrics and reporting.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <Users className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Collaboration</h3>
                  <p className="text-muted-foreground">
                    Enable seamless handoffs and collaboration between team members.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <Clock className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Time Tracking</h3>
                  <p className="text-muted-foreground">
                    Monitor cycle times and identify bottlenecks in your workflows.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <GitBranch className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Flexibility</h3>
                  <p className="text-muted-foreground">
                    Adapt workflows easily as your processes and requirements evolve.
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
                Ready to optimize your workflows?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Start using TaskFlow Studio to design, execute, and improve your team's workflows.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/auth">
                    Get Started Free
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/task-management-guide">
                    Task Management Guide
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
