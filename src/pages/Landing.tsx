import { SEOHead } from "@/components/seo/SEOHead";
import { StructuredData } from "@/components/seo/StructuredData";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Footer } from "@/components/landing/Footer";

export default function Landing() {
  return (
    <>
      <SEOHead />
      <StructuredData type="SoftwareApplication" />
      
      <div className="min-h-screen bg-background">
        <Hero />
        <Features />
        <HowItWorks />
        <Footer />
      </div>
    </>
  );
}
