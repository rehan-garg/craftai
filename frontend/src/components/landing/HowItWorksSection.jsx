import { CheckCircle, Globe, Sparkles, Upload } from 'lucide-react';
import useInView from '../../hooks/useInView';
import { cn } from '../../utils/cn';
import { Container, SectionTitle } from '../ui';

const steps = [
  {
    icon: Upload,
    title: 'Upload',
    description: 'Add photos and basic details about your handmade product.',
  },
  {
    icon: Sparkles,
    title: 'AI Analysis',
    description: 'CraftAI generates descriptions, pricing, and SEO in seconds.',
  },
  {
    icon: CheckCircle,
    title: 'Review',
    description: 'Fine-tune the output to match your voice and brand.',
  },
  {
    icon: Globe,
    title: 'Publish',
    description: 'List on the CraftAI marketplace and reach buyers worldwide.',
  },
];

function HowItWorksSection() {
  const [ref, isInView] = useInView();

  return (
    <section className="bg-white py-16 sm:py-24">
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
            title="How it works"
            subtitle="From workshop to worldwide marketplace in four simple steps."
          />
        </div>

        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute top-16 hidden h-0.5 w-full bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 lg:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className={cn(
                  'relative flex flex-col items-center text-center transition-all duration-500',
                  isInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
                )}
                style={{ transitionDelay: isInView ? `${index * 150}ms` : '0ms' }}
              >
                <div className="relative z-10 mb-4 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-orange-500 text-white shadow-lg">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange-600">
                  Step {index + 1}
                </span>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="max-w-xs text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default HowItWorksSection;
