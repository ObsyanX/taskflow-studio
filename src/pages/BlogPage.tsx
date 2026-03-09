import { SEOHead } from "@/components/seo/SEOHead";
import { Footer } from "@/components/landing/Footer";
import { BlogCard } from "@/components/blog/BlogCard";
import { blogPosts } from "@/data/blogPosts";
import { CheckCircle2 } from "lucide-react";

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <>
      <SEOHead
        title="Blog – TaskFlow Studio Productivity Insights"
        description="Discover productivity tips, task management strategies, and workflow optimization guides from the TaskFlow Studio team. Learn how to work smarter and achieve more."
        keywords="productivity blog, task management tips, workflow optimization, time management, productivity strategies"
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="pt-20 pb-12 sm:pt-28 sm:pb-16 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <CheckCircle2 className="h-4 w-4" />
                Productivity Insights
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
                The{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  TaskFlow Studio
                </span>{" "}
                Blog
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Tips, strategies, and insights to help you master task management, boost productivity, and achieve your goals.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="py-12 sm:py-16 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-foreground mb-8">Featured Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-8">All Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
