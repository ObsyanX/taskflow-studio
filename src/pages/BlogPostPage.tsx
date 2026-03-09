import { SEOHead } from "@/components/seo/SEOHead";
import { StructuredData } from "@/components/seo/StructuredData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams, Link, Navigate } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const currentIndex = blogPosts.findIndex(p => p.slug === slug);
  const previousPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "datePublished": post.publishedDate,
    "dateModified": post.modifiedDate || post.publishedDate,
    "publisher": {
      "@type": "Organization",
      "name": "TaskFlow Studio",
      "logo": {
        "@type": "ImageObject",
        "url": "https://taskflow-studio-sand.vercel.app/logo.png"
      }
    },
    "keywords": post.tags.join(", ")
  };

  return (
    <>
      <SEOHead
        title={`${post.title} – TaskFlow Studio Blog`}
        description={post.description}
        keywords={post.tags.join(", ")}
        ogType="article"
        article={{
          publishedTime: post.publishedDate,
          modifiedTime: post.modifiedDate,
          author: post.author,
          tags: post.tags
        }}
      />
      <StructuredData type="Article" data={articleStructuredData} />

      <div className="min-h-screen bg-background">
        <Navbar />
        {/* Header */}
        <header className="border-b border-border bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </header>

        {/* Article */}
        <article className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
                {post.title}
              </h1>

              {/* Description */}
              <p className="text-xl text-muted-foreground mb-8">
                {post.description}
              </p>

              {/* Author and Date */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-12 pb-8 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">By {post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.publishedDate}>
                    {new Date(post.publishedDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </time>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none dark:prose-invert
                prose-headings:font-bold prose-headings:text-foreground
                prose-h1:text-4xl prose-h1:mt-12 prose-h1:mb-6
                prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold
                prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
                prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
                prose-li:text-muted-foreground prose-li:mb-2
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic
                prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              ">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>

              {/* Navigation */}
              <div className="mt-16 pt-8 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-6">
                {previousPost && (
                  <Link 
                    to={`/blog/${previousPost.slug}`}
                    className="group p-6 rounded-lg border border-border hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <ArrowLeft className="w-4 h-4" />
                      Previous Article
                    </div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {previousPost.title}
                    </h3>
                  </Link>
                )}
                {nextPost && (
                  <Link 
                    to={`/blog/${nextPost.slug}`}
                    className="group p-6 rounded-lg border border-border hover:border-primary/50 transition-all md:text-right md:ml-auto"
                  >
                    <div className="flex items-center gap-2 justify-end text-sm text-muted-foreground mb-2">
                      Next Article
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {nextPost.title}
                    </h3>
                  </Link>
                )}
              </div>

              {/* CTA */}
              <div className="mt-12 p-8 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Ready to boost your productivity?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start managing your tasks more effectively with TaskFlow Studio.
                </p>
                <Button asChild size="lg">
                  <Link to="/auth">Get Started Free</Link>
                </Button>
              </div>
            </div>
          </div>
        </article>

        <Footer />
      </div>
    </>
  );
}
