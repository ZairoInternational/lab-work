import AboutSection from "../components/about-section";
import BetterForYouSection from "../components/better-for-you-section";
import CaseStudiesSection from "../components/case-studies-section";
import SimpleClientsSection from "../components/client-section";
import HeroSection from "../components/hero-section";
import HomePartnersSection from "../components/home-partners-section";
import HomeVoicesFromTheBenchSection from "../components/home-voices-from-the-bench-section";
import MarqueeSection from "../components/marquee-section";
import ProcessSection from "../components/process-section";
import ServicesSection from "../components/services-section";
import TestimonialsSection from "../components/testimonials-section";
import WhyChooseUsSection from "../components/why-choose-us-section";

const sampleClients = [
  {
    id: 1,
    name: "Google",
    logo: "/labs certificate criteria/ce.png",
  },
  {
    id: 2,
    name: "Microsoft",
    logo: "/labs certificate criteria/gem.png",
  },
  {
    id: 3,
    name: "Apple",
    logo: "/labs certificate criteria/iso.png",
  },
  {
    id: 4,
    name: "Amazon",
    logo: "/labs certificate criteria/gmp.jpeg",
  },
  {
    id: 5,
    name: "Amazon",
    logo: "/labs certificate criteria/iec.png",
  },
  {
    id: 6,
    name: "Amazon",
    logo: "/labs certificate criteria/SEFA.jpg",
  }
]

export default function Home() {
  return (
    <main className="min-h-screen">
      
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <HomePartnersSection />
      <ServicesSection />
      {/* <BetterForYouSection /> */}
      <CaseStudiesSection />
      <WhyChooseUsSection />
      <HomeVoicesFromTheBenchSection />
      <MarqueeSection />
      <ProcessSection />
      {/* <TestimonialsSection /> */}
      <SimpleClientsSection
        clients={sampleClients.slice(0, 6)}
        title="Company certified below to criteria"
        subtitle="Building lasting relationships through exceptional work"
        backgroundColor="bg-white"
        columns={3}
      />
      <MarqueeSection />
      
    </main>
  )
}
