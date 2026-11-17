import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin?: () => void;
  inquiryCount?: number;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[rgba(215,208,198,0.4)] bg-[#FAF8F5]/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 lg:gap-8 px-4 py-4 sm:px-6 lg:px-10">
        {/* Zone 1: Minimalist Monogram 'MI' + Editorial Name */}
        <a
          href="#home"
          className="group flex items-center gap-3 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C5A880]"
        >
          <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-[#181716]/20 bg-[#FAF8F5] font-serif text-sm sm:text-base font-semibold italic tracking-tight text-[#181716] transition-colors group-hover:border-[#C5A880] group-hover:bg-[#181716] group-hover:text-[#FAF8F5]">
            MI
          </span>
          <span className="font-serif text-lg sm:text-xl font-medium tracking-[0.04em] text-[#181716]">
            Munazza Irfan
          </span>
        </a>

        {/* Zone 2: Clean Editorial Text Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-[13px] font-medium tracking-[0.04em] text-[#181716]/70">
          <a
            href="#work"
            className="transition-colors duration-200 hover:text-[#181716] whitespace-nowrap shrink-0"
          >
            Selected Works
          </a>
          <a
            href="#reels"
            className="transition-colors duration-200 hover:text-[#181716] whitespace-nowrap shrink-0"
          >
            Editorial Reels
          </a>
          <a
            href="#resume"
            className="transition-colors duration-200 hover:text-[#181716] whitespace-nowrap shrink-0"
          >
            About & CV
          </a>
          <a
            href="#contact"
            className="transition-colors duration-200 hover:text-[#181716] whitespace-nowrap shrink-0"
          >
            Contact
          </a>
        </nav>

        {/* Zone 3: 1 Luxury Pill CTA Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full bg-[#181716] px-4 py-2 sm:px-6 sm:py-2.5 text-[11px] sm:text-xs font-medium tracking-[0.04em] text-[#FAF8F5] transition-all duration-200 hover:bg-[#C47D68] hover:text-white shadow-sm whitespace-nowrap shrink-0"
          >
            <span className="hidden sm:inline">Book a Consultation</span>
            <span className="sm:hidden">Consultation</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-full p-2 text-[#181716]/80 hover:bg-[#181716]/5 hover:text-[#181716] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Minimalist Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[rgba(215,208,198,0.4)] bg-[#FAF8F5] px-6 py-5 space-y-3.5">
          <a
            href="#work"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium tracking-[0.03em] text-[#181716]/80 hover:text-[#181716] py-1"
          >
            Selected Works
          </a>
          <a
            href="#reels"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium tracking-[0.03em] text-[#181716]/80 hover:text-[#181716] py-1"
          >
            Editorial Reels
          </a>
          <a
            href="#resume"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium tracking-[0.03em] text-[#181716]/80 hover:text-[#181716] py-1"
          >
            About & CV
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium tracking-[0.03em] text-[#181716]/80 hover:text-[#181716] py-1"
          >
            Contact
          </a>
        </div>
      )}
    </header>
  );
};
