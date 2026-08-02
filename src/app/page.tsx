import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ProductCallout } from "@/components/sections/ProductCallout";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ProofSection } from "@/components/sections/ProofSection";
import { SituationsSection } from "@/components/sections/SituationsSection";
import { TeachingContextSection } from "@/components/sections/TeachingContextSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ThoughtsSection } from "@/components/sections/ThoughtsSection";
import { UndecidedSection } from "@/components/sections/UndecidedSection";

export default function HomePage() {
  return (
    <main id="main-content">
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <SituationsSection />
      <ProductCallout productId="consultation" sectionId="products" />
      <ProofSection />
      <ThoughtsSection />
      <ProductCallout productId="ai-course" />
      <ProcessSection />
      <TeachingContextSection />
      <ProductCallout productId="figma-mentoring" />
      <TestimonialsSection />
      <UndecidedSection />
      <FaqSection />
      <ContactSection />
    </main>
  );
}

