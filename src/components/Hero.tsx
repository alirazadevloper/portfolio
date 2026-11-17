import React, { useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { PortfolioStats, Project } from '../types';

interface HeroProps {
  stats: PortfolioStats | null;
  projects?: Project[];
  onSelectProject?: (project: Project) => void;
  onViewCV: () => void;
}

const DEFAULT_REELS = [
  {
    title: 'Capital Smart City Editorial',
    subtitle: 'Architectural Motion · 9:16',
    url: '/assets/aistudio/1_Kanal_Residential_Plot___Housing_Development_bea26688.mp4',
  },
  {
    title: '3-Split Villa Showcase',
    subtitle: 'Editorial Pacing · 9:16',
    url: '/assets/aistudio/Real_Estate_Showcase_1dc50f40.mp4',
  },
  {
    title: 'Eastern Housing Brand Film',
    subtitle: 'Corporate Story · 9:16',
    url: '/assets/aistudio/On-Site_Building_Construction_Progress_9f6d1756.mp4',
  },
];

const CLIENT_WORDMARKS = [
  'EASTERN HOUSING',
  'CAPITAL SMART CITY',
  'BURGER LAB',
  'GLOBEX SOLUTIONS',
  'AL-JANNAT ATELIER',
  'CODEMIND STUDIO',
];

export const Hero: React.FC<HeroProps> = ({
  projects = [],
  onSelectProject,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeReelIdx, setActiveReelIdx] = useState(0);

  const heroReels = useMemo(() => {
    const dbReels = projects.filter((p) => p.media_type === 'video');
    if (dbReels.length > 0) {
      return dbReels.slice(0, 3).map((r) => ({
        title: r.client_or_brand,
        subtitle: r.title,
        url: r.media_url,
      }));
    }
    return DEFAULT_REELS;
  }, [projects]);

  const silkCardProject = useMemo(
    () =>
      projects.find((p) => p.slug === 'munazza-irfan-luxury-business-card') ||
      projects.find((p) => p.media_type === 'image'),
    [projects]
  );

  const crestProject = useMemo(
    () =>
      projects.find((p) => p.slug === 'boutique-vintage-crest-logo') ||
      projects.filter((p) => p.media_type === 'image')[1],
    [projects]
  );

  const activeReel = heroReels[activeReelIdx] || DEFAULT_REELS[0];

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handlePlayShowreelCTA = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
    const reelsSection = document.getElementById('reels');
    if (reelsSection) {
      reelsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInspectProject = (project?: Project) => {
    if (project && onSelectProject) {
      onSelectProject(project);
    } else {
      const workEl = document.getElementById('work');
      if (workEl) workEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#FAF8F5] pt-8 pb-12 sm:pt-12 sm:pb-14 lg:pt-12 lg:pb-16"
    >
      {/* Subtle Ambient Champagne Gold & Velvet Terracotta Atmospheric Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-[8%] h-[460px] w-[460px] rounded-full bg-[#C5A880]/15 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 -left-24 h-[360px] w-[360px] rounded-full bg-[#C47D68]/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* 2-Column Editorial Hero Split */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Hero Left Column: Breathable Parisian Typography */}
          <div className="lg:col-span-6 xl:col-span-6">
            {/* Chic Editorial Badge */}
            <div className="inline-flex items-center rounded-full border border-[rgba(215,208,198,0.85)] bg-[#F5F0E8]/70 px-3 py-1.5 sm:px-4 text-[9px] sm:text-[11px] font-medium uppercase tracking-[0.11em] sm:tracking-[0.18em] text-[#5B524A] whitespace-nowrap">
              PORTFOLIO 2026 • BESPOKE BRAND IDENTITY &amp; MOTION
            </div>

            {/* Main High-Fashion Serif Headline */}
            <h1 className="mt-6 font-serif text-[42px] sm:text-5xl lg:text-[60px] xl:text-[66px] font-medium tracking-[-0.02em] text-[#181716] leading-[1.03] text-balance">
              Crafting{' '}
              <em className="italic font-normal text-[#C47D68]">Visual</em>{' '}
              Identities That{' '}
              <em className="italic font-normal text-[#A88659]">Command</em>{' '}
              Attention.
            </h1>

            {/* Refined 2-Sentence Bio */}
            <p className="mt-5 max-w-lg text-[15px] sm:text-base leading-[1.7] tracking-[0.02em] text-[#575049]">
              Munazza Irfan partners with luxury labels and growing ventures to craft bespoke brand stationery, signature emblems, and editorial visual systems. Every social campaign and short-form reel is art-directed for timeless poise and measurable audience conversion.
            </p>

            {/* Two Clean Pill Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#work"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#181716] px-7 py-3.5 text-xs sm:text-[13px] font-medium tracking-[0.04em] text-[#FAF8F5] shadow-[0_14px_30px_-10px_rgba(24,23,22,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2E2B28] whitespace-nowrap"
              >
                <span>View Selected Works</span>
                <ArrowUpRight className="h-4 w-4 text-[#C5A880]" />
              </a>

              <button
                type="button"
                onClick={handlePlayShowreelCTA}
                className="inline-flex items-center gap-2.5 rounded-full border border-[#181716]/25 bg-transparent px-7 py-3.5 text-xs sm:text-[13px] font-medium tracking-[0.04em] text-[#181716] transition-all duration-200 hover:border-[#181716] hover:bg-[#181716]/5 whitespace-nowrap"
              >
                <span>Play Showreel ▷</span>
              </button>
            </div>

            {/* Subtle Designer Discipline Index */}
            <div className="mt-8 pt-5 border-t border-[rgba(215,208,198,0.45)] flex flex-wrap items-center gap-x-4 gap-y-2 text-xs tracking-[0.04em] text-[#6E655D]">
              <span>Graphic Design</span>
              <span aria-hidden="true" className="text-[#C5A880]">
                /
              </span>
              <span>Brand Styling</span>
              <span aria-hidden="true" className="text-[#C5A880]">
                /
              </span>
              <span>Editorial Reels</span>
              <span aria-hidden="true" className="text-[#C5A880]">
                /
              </span>
              <span>Rawalpindi &amp; Global</span>
            </div>
          </div>

          {/* Hero Right Column: Floating 3D Glassmorphic Device + Layered Luxury Stationery */}
          <div className="lg:col-span-6 xl:col-span-6 relative flex items-center justify-center py-4 lg:py-2 min-h-[460px] sm:min-h-[520px]">
            {/* Layered Luxury Stationery Card (Top Left — non-occluding) */}
            <button
              type="button"
              onClick={() => handleInspectProject(silkCardProject)}
              aria-label="Inspect Executive Luxury Business Card"
              className="hidden sm:block group absolute left-0 xl:-left-2 top-8 w-44 lg:w-48 -rotate-6 rounded-2xl border border-[#C5A880]/45 bg-[#181716] p-1.5 shadow-[0_28px_56px_-14px_rgba(24,23,22,0.32)] transition-all duration-300 hover:-translate-y-1.5 hover:-rotate-3 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A880]"
            >
              <div className="overflow-hidden rounded-xl aspect-[16/10]">
                <img
                  src="/assets/aistudio/Business_Card__2__40af2b3d.png"
                  alt="Munazza Irfan Executive Black Silk Business Card"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="px-2 py-1.5 flex items-center justify-between text-[10px] tracking-[0.06em] uppercase text-[#FAF8F5]/85">
                <span>Silk Card</span>
                <span className="text-[#C5A880]">01</span>
              </div>
            </button>

            {/* Layered Luxury Crest Card (Top Right — cleanly offset so label stays 100% readable) */}
            <button
              type="button"
              onClick={() => handleInspectProject(crestProject)}
              aria-label="Inspect Boutique Vintage Crest Identity"
              className="hidden sm:block group absolute right-0 xl:-right-2 top-16 w-36 lg:w-40 rotate-6 rounded-2xl border border-[rgba(215,208,198,0.7)] bg-white/95 backdrop-blur-xl p-1.5 shadow-[0_26px_52px_-12px_rgba(24,23,22,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:rotate-3 z-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A880]"
            >
              <div className="overflow-hidden rounded-xl aspect-square bg-[#F5F0E8]">
                <img
                  src="/assets/aistudio/Logo__2__63103627.jpg"
                  alt="Boutique Vintage Fashion Filigree Crest"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="pt-1.5 px-1 flex items-center justify-between text-[10px] tracking-[0.05em] uppercase text-[#181716]/80">
                <span>Atelier Crest</span>
                <span className="text-[#C47D68]">02</span>
              </div>
            </button>

            {/* Centerpiece: Floating 3D Glassmorphic iPhone 16 Pro Mockup */}
            <div className="relative z-20 w-[256px] sm:w-[272px] rounded-[44px] border border-white/85 bg-gradient-to-b from-white/80 via-white/50 to-[#EAE3D8]/70 p-2 backdrop-blur-2xl shadow-[0_40px_80px_-18px_rgba(24,23,22,0.34),0_0_0_1px_rgba(197,168,128,0.35)]">
              {/* Metallic Champagne Inner Frame */}
              <div className="relative overflow-hidden rounded-[36px] bg-[#141312] ring-1 ring-black/15">
                {/* iPhone 16 Pro Dynamic Island */}
                <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 z-20 flex h-5 w-24 items-center justify-end rounded-full bg-black px-2.5 shadow-inner">
                  <span className="h-2 w-2 rounded-full bg-[#1E1C1A] ring-1 ring-white/10" />
                </div>

                {/* Editorial Video Screen */}
                <div className="relative aspect-[9/16] w-full overflow-hidden bg-[#181716]">
                  <video
                    ref={videoRef}
                    key={activeReel.url}
                    src={activeReel.url}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="h-full w-full object-cover"
                  />

                  {/* Specular Glass Sheen */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20"
                  />

                  {/* Subtle Contrast Scrim & Glass Controls */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#181716]/92 via-[#181716]/50 to-transparent p-3.5 pt-12">
                    <div className="rounded-2xl border border-white/15 bg-black/40 backdrop-blur-md p-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="block text-[9px] uppercase tracking-[0.14em] text-[#C5A880]">
                            Editorial Reel 0{activeReelIdx + 1}
                          </span>
                          <p className="mt-0.5 truncate font-serif text-xs sm:text-sm font-medium text-[#FAF8F5]">
                            {activeReel.title}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={handleTogglePlay}
                            aria-label={isPlaying ? 'Pause showreel' : 'Play showreel'}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white transition-colors hover:bg-[#C5A880] hover:text-[#181716]"
                          >
                            {isPlaying ? (
                              <Pause className="h-3 w-3" />
                            ) : (
                              <Play className="h-3 w-3" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={handleToggleMute}
                            aria-label={isMuted ? 'Unmute showreel' : 'Mute showreel'}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white transition-colors hover:bg-[#C5A880] hover:text-[#181716]"
                          >
                            {isMuted ? (
                              <VolumeX className="h-3 w-3" />
                            ) : (
                              <Volume2 className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Minimalist Reel Selector */}
                      <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2">
                        <div className="flex items-center gap-1.5">
                          {heroReels.map((r, idx) => (
                            <button
                              key={r.title + idx}
                              type="button"
                              onClick={() => setActiveReelIdx(idx)}
                              aria-label={`Select reel ${idx + 1}: ${r.title}`}
                              className={`h-1.5 rounded-full transition-all duration-200 ${
                                idx === activeReelIdx
                                  ? 'w-5 bg-[#C5A880]'
                                  : 'w-1.5 bg-white/35 hover:bg-white/65'
                              }`}
                            />
                          ))}
                        </div>
                        <a
                          href="#reels"
                          className="text-[10px] tracking-[0.06em] uppercase text-[#FAF8F5]/85 hover:text-[#C5A880] transition-colors"
                        >
                          Full Theater
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof: Clean, Monochrome, Low-Opacity Logo Strip */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-[rgba(215,208,198,0.4)]">
          <p className="text-center text-[11px] font-medium uppercase tracking-[0.2em] text-[#181716]/45">
            Trusted by Modern Brands &amp; Creators
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-5 lg:gap-x-6 gap-y-2.5">
            {CLIENT_WORDMARKS.map((brand, idx) => (
              <React.Fragment key={brand}>
                {idx > 0 && (
                  <span
                    aria-hidden="true"
                    className="hidden lg:inline text-[#181716]/20"
                  >
                    /
                  </span>
                )}
                <span className="font-serif text-[11px] sm:text-xs tracking-[0.1em] text-[#181716]/45 transition-colors duration-200 hover:text-[#181716]/85 cursor-default whitespace-nowrap">
                  {brand}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
