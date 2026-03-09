import { 
  CheckSquare, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Zap, 
  Target,
  Calendar,
  BookOpen
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: CheckSquare,
    title: "Task Management",
    description: "Create, edit, and organize tasks easily with an intuitive interface. Set priorities, due dates, and categories.",
    color: "text-blue-500"
  },
  {
    icon: TrendingUp,
    title: "Workflow Tracking",
    description: "Visualize progress and track workflows efficiently with real-time updates and analytics.",
    color: "text-green-500"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Assign tasks and collaborate with teammates seamlessly. Share projects and stay synchronized.",
    color: "text-purple-500"
  },
  {
    icon: BarChart3,
    title: "Productivity Insights",
    description: "Monitor productivity trends and task completion patterns with detailed analytics and reports.",
    color: "text-orange-500"
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    description: "Stay updated with instant task changes and notifications. Never miss important deadlines.",
    color: "text-yellow-500"
  },
  {
    icon: Target,
    title: "Habit Tracking",
    description: "Build better habits with streak tracking, completion calendars, and progress visualization.",
    color: "text-red-500"
  },
  {
    icon: Calendar,
    title: "Goal Setting",
    description: "Set and track long-term goals with milestones, deadlines, and progress percentage tracking.",
    color: "text-indigo-500"
  },
  {
    icon: BookOpen,
    title: "Diary Journaling",
    description: "Reflect on your day with encrypted diary entries, mood tracking, and daily prompts.",
    color: "text-pink-500"
  }
];

export function Features() {
  return (
    <section className="py-20 sm:py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything you need to stay productive
          </h2>
          <p className="text-lg text-muted-foreground">
            TaskFlow Studio combines powerful features to help you organize work, track progress, and achieve your goals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
