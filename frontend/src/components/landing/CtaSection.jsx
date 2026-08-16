import { ArrowRight } from 'lucide-react';
import useInView from '../../hooks/useInView';
import { cn } from '../../utils/cn';
import { Container } from '../ui';
import ButtonLink from './ButtonLink';

function CtaSection() {
  const [ref, isInView] = useInView();

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div
          ref={ref}
          className={cn(
            'relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600 px-6 py-16 text-center shadow-xl transition-all duration-700 sm:px-12 sm:py-20',
            isInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
          )}
        >
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-orange-400/20 blur-2xl" />

          <div className="relative mx-auto max-w-2xl space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to bring your craft to the world?
            </h2>
            <p className="text-lg text-amber-100">
              Join thousands of artisans using AI to create listings, reach new
              buyers, and grow their handmade businesses — starting for free.
            </p>
            <ButtonLink
              to="/signup"
              className="bg-white text-orange-600 hover:bg-amber-50 hover:text-orange-600"
            >
              Start Creating Today
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default CtaSection;
