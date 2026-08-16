import {
  DollarSign,
  FileText,
  Image,
  Search,
  Share2,
  Store,
} from 'lucide-react';
import useInView from '../../hooks/useInView';
import { cn } from '../../utils/cn';
import { Card, Container, SectionTitle } from '../ui';

const features = [
  {
    icon: FileText,
    title: 'AI Product Description',
    description:
      'Turn a few details about your craft into polished, story-driven product copy that sells.',
  },
  {
    icon: DollarSign,
    title: 'Smart Pricing',
    description:
      'Get fair price suggestions based on materials, labor, and market trends for handmade goods.',
  },
  {
    icon: Search,
    title: 'SEO Optimization',
    description:
      'Auto-generate keywords and meta content so buyers discover your products online.',
  },
  {
    icon: Share2,
    title: 'Social Media Captions',
    description:
      'Create scroll-stopping captions tailored for Instagram, Facebook, and WhatsApp.',
  },
  {
    icon: Image,
    title: 'Image Quality Analysis',
    description:
      'Receive tips to improve product photos — lighting, framing, and background guidance.',
  },
  {
    icon: Store,
    title: 'Marketplace Ready Listings',
    description:
      'Export listing-ready content formatted for global marketplaces in one click.',
  },
];

function FeaturesSection() {
  const [ref, isInView] = useInView();

  return (
    <section id="features" className="py-16 sm:py-24">
      <Container>
        <div
          ref={ref}
          className={cn(
            'mb-12 transition-all duration-700 sm:mb-16',
            isInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
          )}
        >
          <SectionTitle
            align="center"
            title="Everything you need to sell smarter"
            subtitle="CraftAI handles the digital heavy lifting so you can focus on what you do best — creating."
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className={cn(
                  'group transition-all duration-500 hover:-translate-y-1',
                  isInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
                )}
                style={{ transitionDelay: isInView ? `${index * 100}ms` : '0ms' }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-orange-600 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default FeaturesSection;
