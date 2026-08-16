import { Link } from 'react-router-dom';
import { Globe, Mail, MessageCircle, Share2, Sparkles } from 'lucide-react';
import { Container } from '../ui';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Pricing', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Privacy', href: '#' },
  ],
};

const socialLinks = [
  { icon: Share2, label: 'Share', href: '#' },
  { icon: Globe, label: 'Website', href: '#' },
  { icon: MessageCircle, label: 'Messages', href: '#' },
  { icon: Mail, label: 'Email', href: '#' },
];

function LandingFooter() {
  return (
    <footer className="border-t border-amber-200 bg-white py-12 sm:py-16">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="mb-4 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white shadow-md">
                <Sparkles className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold text-slate-900">CraftAI</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-slate-600">
              AI-powered tools helping local artisans create professional listings
              and reach buyers around the world.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-amber-200 text-slate-600 transition-all hover:border-amber-300 hover:bg-amber-100 hover:text-orange-600"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-4 text-sm font-semibold text-slate-900">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('#') || link.href === '#' ? (
                      <a
                        href={link.href}
                        className="text-sm text-slate-600 transition-colors hover:text-orange-600"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-slate-600 transition-colors hover:text-orange-600"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-amber-200 pt-8 text-center text-sm text-slate-600">
          &copy; {new Date().getFullYear()} CraftAI. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}

export default LandingFooter;
