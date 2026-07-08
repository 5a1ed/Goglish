import HeroSection from "./components/HeroSection";
import WhyGoglishSection from "./components/WhyGoglishSection";
import HowItWorksSection from "./components/HowItWorksSection";
import CredibilitySection from "./components/CredibilitySection";
import FaqSection from "./components/FaqSection";
import FinalCtaSection from "./components/FinalCtaSection";
import FooterSection from "./components/FooterSection";
import EarlyAccessSection from "./components/EarlyAccessSection";

export default function Home() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-950">
      <HeroSection />
      <WhyGoglishSection />
      <HowItWorksSection />
      <CredibilitySection />
      <EarlyAccessSection />
      <FaqSection />
      <FinalCtaSection />
      <FooterSection />
    </main>
  );
}
