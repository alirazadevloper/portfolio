import React from 'react';
import { Mail, Phone, MapPin, ArrowUp, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[rgba(215,208,198,0.4)] bg-[#FAF8F5] py-14 text-xs text-[#6E655D]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[rgba(215,208,198,0.4)]">
          {/* Brand & Summary */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#181716]/20 bg-[#FAF8F5] font-serif text-sm font-semibold italic text-[#181716]">
                MI
              </span>
              <span className="font-serif text-xl font-medium tracking-[0.04em] text-[#181716]">
                Munazza Irfan
              </span>
            </div>
            <p className="mt-3.5 text-xs sm:text-sm text-[#575049] max-w-sm leading-relaxed">
              Graphic Designer, Brand Stylist &amp; Editorial Reel Editor. Certified in bespoke brand identities, high-conversion social media visuals, and executive documentation.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#181716] block mb-4">
              Portfolio Index
            </span>
            <ul className="space-y-2.5 font-medium">
              <li>
                <a href="#work" className="hover:text-[#181716] transition-colors">Selected Works</a>
              </li>
              <li>
                <a href="#reels" className="hover:text-[#181716] transition-colors">Editorial Reels</a>
              </li>
              <li>
                <a href="#resume" className="hover:text-[#181716] transition-colors">About &amp; CV</a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-[#181716] transition-colors">Endorsements</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#181716] transition-colors">Book a Consultation</a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#181716] block mb-4">
              Studio Contact
            </span>
            <div className="space-y-3 font-medium">
              <div className="flex items-center gap-2.5 text-[#181716]/85">
                <Phone className="h-4 w-4 text-[#C47D68] shrink-0" />
                <span>03129547572 / +92 312 6292672</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#181716]/85">
                <Mail className="h-4 w-4 text-[#C47D68] shrink-0" />
                <a href="mailto:munazza.00077@gmail.com" className="hover:text-[#C47D68] transition-colors">
                  munazza.00077@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-[#181716]/85">
                <MapPin className="h-4 w-4 text-[#C47D68] shrink-0" />
                <span>Rawalpindi, Punjab, Pakistan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#6E655D]">
            © {new Date().getFullYear()} Munazza Irfan. All works reserved. Powered by Cloud Firestore.
          </p>

          <div className="flex items-center gap-6">
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 font-medium text-[#575049] hover:text-[#181716] transition-colors"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-[#A88659]" />
                <span>Studio Admin</span>
              </button>
            )}

            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1.5 font-medium text-[#181716] hover:text-[#C47D68] transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
