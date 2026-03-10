import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { PublicLayout } from "./components/layout/PublicLayout";
import { AppLayout } from "./components/layout/AppLayout";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import FeaturesPage from "./pages/FeaturesPage";
import PricingPage from "./pages/PricingPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import TaskManagementGuide from "./pages/TaskManagementGuide";
import ProductivityTools from "./pages/ProductivityTools";
import WorkflowManagement from "./pages/WorkflowManagement";
import TaskPlanningGuide from "./pages/TaskPlanningGuide";
import AboutPage from "./pages/AboutPage";
import Auth from "./pages/Auth";
import Habits from "./pages/Habits";
import Goals from "./pages/Goals";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            {/* Public Marketing Pages with shared Navbar + Footer */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/task-management-guide" element={<TaskManagementGuide />} />
              <Route path="/productivity-tools" element={<ProductivityTools />} />
              <Route path="/workflow-management" element={<WorkflowManagement />} />
              <Route path="/task-planning-guide" element={<TaskPlanningGuide />} />
              <Route path="/about" element={<AboutPage />} />
            </Route>

            {/* Auth page (no layout) */}
            <Route path="/auth" element={<Auth />} />

            {/* Protected Application Pages with shared AppLayout */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/app" element={<Index />} />
              <Route path="/habits" element={<Habits />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/analytics" element={<Analytics />} />
            </Route>

            {/* 404 Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
