import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  type?: 'SoftwareApplication' | 'Organization' | 'Article' | 'FAQPage';
  data?: Record<string, any>;
}

export function StructuredData({ type = 'SoftwareApplication', data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'SoftwareApplication':
        return {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "TaskFlow Studio",
          "applicationCategory": "ProductivityApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "description": "TaskFlow Studio is a modern productivity and task management platform designed to help individuals and teams organize tasks, manage workflows, track progress, and improve productivity.",
          "screenshot": "https://taskflow-studio-sand.vercel.app/og-image.png",
          "featureList": [
            "Task Management",
            "Workflow Tracking",
            "Team Collaboration",
            "Productivity Insights",
            "Real-Time Updates",
            "Habit Tracking",
            "Goal Setting",
            "Diary Journaling"
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "127"
          }
        };

      case 'Organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "TaskFlow Studio",
          "url": "https://taskflow-studio-sand.vercel.app",
          "logo": "https://taskflow-studio-sand.vercel.app/logo.png",
          "description": "Modern productivity and task management platform",
          "sameAs": [
            "https://twitter.com/taskflowstudio",
            "https://linkedin.com/company/taskflowstudio"
          ]
        };

      case 'Article':
        return data || {};

      case 'FAQPage':
        return data || {};

      default:
        return {};
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(getStructuredData())}
      </script>
    </Helmet>
  );
}
