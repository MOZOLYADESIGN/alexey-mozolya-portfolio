import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { Footer } from "@/components/sections/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ProductCallout } from "@/components/sections/ProductCallout";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ProofSection } from "@/components/sections/ProofSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { TeachingContextSection } from "@/components/sections/TeachingContextSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ThoughtsSection } from "@/components/sections/ThoughtsSection";

export default function HomePage() {
  return (
    <>
      <main id="main-content">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <ProductCallout productId="consultation" sectionId="products" eyebrow="Первый шаг" />
        <ProofSection />
        <ServicesSection />
        <ThoughtsSection />
        <ProductCallout productId="ai-course" eyebrow="Обучение" />
        <ProcessSection />
        <TeachingContextSection />
        <ProductCallout productId="figma-mentoring" eyebrow="Наставничество" />
        <TestimonialsSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

