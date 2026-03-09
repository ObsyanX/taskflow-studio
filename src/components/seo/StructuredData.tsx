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
          "name": "BloomScheduler",
          "applicationCategory": "ProductivityApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "description": "BloomScheduler is a modern scheduling and productivity platform designed to simplify meeting coordination, automate booking workflows, and help individuals and teams manage their time efficiently.",
          "screenshot": "https://bloomscheduler.vercel.app/og-image.png",
          "featureList": [
            "Meeting Scheduling",
            "Booking Automation",
            "Availability Management",
            "Calendar Integration",
            "Team Collaboration",
            "Habit Tracking",
            "Goal Setting",
            "Task Management"
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
          "name": "BloomScheduler",
          "url": "https://bloomscheduler.vercel.app",
          "logo": "https://bloomscheduler.vercel.app/logo.png",
          "description": "Modern scheduling and productivity platform",
          "sameAs": [
            "https://twitter.com/bloomscheduler",
            "https://linkedin.com/company/bloomscheduler"
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
