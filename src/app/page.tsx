import AboutSection from "../components/about-section";
import BetterForYouSection from "../components/better-for-you-section";
import CaseStudiesSection from "../components/case-studies-section";
import ClientsSection from "../components/client-section";
import ContactSection from "../components/contact-section";
import Footer from "../components/footer";
import Header from "../components/header";
import HeroSection from "../components/hero-section";
import MarqueeSection from "../components/marquee-section";
import ProcessSection from "../components/process-section";
import ServicesSection from "../components/services-section";
import TestimonialsSection from "../components/testimonials-section";
import WhyChooseUsSection from "../components/why-choose-us-section";


export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <BetterForYouSection />
      <CaseStudiesSection />
      <WhyChooseUsSection />
      <MarqueeSection />
      <ProcessSection />
      <ContactSection />
      <TestimonialsSection />
      <ClientsSection />
      <MarqueeSection />
      <Footer />
    </main>
  )
}
