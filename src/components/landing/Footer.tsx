import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-foreground">BloomScheduler</span>
            </div>
            <p className="text-muted-foreground max-w-md">
              A modern scheduling and productivity platform designed to simplify meeting coordination, automate booking workflows, and help individuals and teams manage their time efficiently.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/features" className="text-muted-foreground hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/task-management-guide" className="text-muted-foreground hover:text-primary transition-colors">
                  Task Management Guide
                </Link>
              </li>
              <li>
                <Link to="/productivity-tools" className="text-muted-foreground hover:text-primary transition-colors">
                  Productivity Tools
                </Link>
              </li>
              <li>
                <Link to="/workflow-management" className="text-muted-foreground hover:text-primary transition-colors">
                  Workflow Management
                </Link>
              </li>
              <li>
                <Link to="/task-planning-guide" className="text-muted-foreground hover:text-primary transition-colors">
                  Task Planning Guide
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} BloomScheduler. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
