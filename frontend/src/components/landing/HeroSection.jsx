import { ArrowRight, Bot, Palette, Sparkles } from 'lucide-react';
import { Badge, Container } from '../ui';
import ButtonLink from './ButtonLink';

function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-28">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl landing-animate-pulse-glow" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl landing-animate-pulse-glow" />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="landing-animate-fade-in-up space-y-8">
            <Badge variant="amber">AI-Powered for Artisans</Badge>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Empowering Local Artisans with{' '}
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  AI
                </span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl">
                Generate product descriptions, estimate prices, create SEO-friendly
                listings, and market handmade products globally using AI.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink to="/signup" className="px-6 py-3 text-base">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="#features" variant="secondary" className="px-6 py-3 text-base">
                Learn More
              </ButtonLink>
            </div>
          </div>

          <div className="landing-animate-fade-in-up landing-delay-200 relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="landing-animate-float relative aspect-square rounded-2xl border border-amber-200 bg-gradient-to-br from-white via-amber-50 to-amber-100 p-8 shadow-xl">
              <div className="absolute inset-4 rounded-xl border border-dashed border-amber-200" />

              <div className="relative flex h-full flex-col items-center justify-center gap-6">
                <div className="flex items-center gap-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-amber-100 text-orange-600 shadow-md">
                    <Palette className="h-10 w-10" />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Sparkles className="h-6 w-6 text-orange-500" />
                    <div className="h-0.5 w-12 bg-gradient-to-r from-amber-400 to-orange-400" />
                    <Sparkles className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-orange-50 text-orange-600 shadow-md">
                    <Bot className="h-10 w-10" />
                  </div>
                </div>

                <div className="w-full space-y-3 rounded-lg bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                  <div className="h-2 w-3/4 rounded-full bg-amber-200" />
                  <div className="h-2 w-full rounded-full bg-amber-100" />
                  <div className="h-2 w-5/6 rounded-full bg-amber-100" />
                  <div className="mt-4 flex gap-2">
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-orange-600">
                      Description
                    </span>
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                      Pricing
                    </span>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-slate-900">
                      SEO
                    </span>
                  </div>
                </div>

                <p className="text-center text-sm font-medium text-slate-600">
                  Artisan meets intelligent listing tools
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default HeroSection;
