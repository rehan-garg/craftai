import { Quote } from 'lucide-react';
import useInView from '../../hooks/useInView';
import { cn } from '../../utils/cn';
import { Card, Container, SectionTitle } from '../ui';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Terracotta Potter',
    location: 'Jaipur, Rajasthan',
    quote:
      'Before CraftAI, I struggled to write listings in English. Now I upload a photo and get professional descriptions that helped me sell to customers in Mumbai and abroad.',
    initials: 'PS',
  },
  {
    name: 'Ravi Kumar',
    role: 'Banarasi Silk Weaver',
    location: 'Varanasi, Uttar Pradesh',
    quote:
      'The smart pricing tool gave me confidence to charge what my work is worth. My saree listings look as premium online as they feel in person.',
    initials: 'RK',
  },
  {
    name: 'Meera Patel',
    role: 'Kundan Jewelry Artisan',
    location: 'Ahmedabad, Gujarat',
    quote:
      'Social media captions used to take me hours. CraftAI creates them in minutes, and my Instagram engagement has doubled since I started using it.',
    initials: 'MP',
  },
];

function TestimonialsSection() {
  const [ref, isInView] = useInView();

  return (
    <section className="py-16 sm:py-24">
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
            title="Trusted by artisans across India"
            subtitle="Real makers sharing how CraftAI helped them grow their craft businesses."
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.name}
              className={cn(
                'relative transition-all duration-500',
                isInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
              )}
              style={{ transitionDelay: isInView ? `${index * 120}ms` : '0ms' }}
            >
              <Quote className="mb-4 h-8 w-8 text-amber-300" />
              <p className="mb-6 text-sm leading-relaxed text-slate-600">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-orange-600">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-slate-600">
                    {testimonial.role} · {testimonial.location}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default TestimonialsSection;
