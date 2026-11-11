import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { DashboardTour } from "@/features/landing/sections/DashboardTour";
import { FeatureBento } from "@/features/landing/sections/FeatureBento";
import { FinalCta } from "@/features/landing/sections/FinalCta";
import { Hero } from "@/features/landing/sections/Hero";
import { SegmentStrip } from "@/features/landing/sections/SegmentStrip";
import { StatsStrip } from "@/features/landing/sections/StatsStrip";
import { VideoSegments } from "@/features/landing/sections/VideoSegments";
import { Workflow } from "@/features/landing/sections/Workflow";

/*
 * Landing composition. Each section lives in src/features/landing/sections/
 * and pulls its copy from content.tsx and its media from media.ts.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <Hero />
        <StatsStrip />
        <SegmentStrip />
        <DashboardTour />
        <VideoSegments />
        <Workflow />
        <FeatureBento />
        <FinalCta />
      </main>

      <Footer />
    </div>
  );
}
