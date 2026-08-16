import CtaSection from '../../components/landing/CtaSection';
import FeaturesSection from '../../components/landing/FeaturesSection';
import HeroSection from '../../components/landing/HeroSection';
import HowItWorksSection from '../../components/landing/HowItWorksSection';
import LandingFooter from '../../components/landing/LandingFooter';
import LandingNavbar from '../../components/landing/LandingNavbar';
import TestimonialsSection from '../../components/landing/TestimonialsSection';
import './landing.css';

function Landing() {
  return (
    <div className="min-h-screen bg-amber-50">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}

export default Landing;
