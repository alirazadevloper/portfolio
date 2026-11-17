import React, { useState } from 'react';
import { Heart, Eye, Search, Play, ArrowUpRight, ArrowDown } from 'lucide-react';
import { Project } from '../types';
import { filterProjects, sortProjects } from '../utils/portfolio-logic';

interface PortfolioGridProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onLikeProject: (id: string | number, e: React.MouseEvent) => void;
  likedIds: Set<string | number>;
}

const DARK_MEDIA_SLUGS = new Set([
  'munazza-irfan-luxury-business-card',
  'helping-businesses-work-smarter-card',
  'burger-lab-instagram-post',
  'mega-fashion-sale-poster',
]);

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({
  projects,
  onSelectProject,
  onLikeProject,
  likedIds,
}) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'likes' | 'views' | 'order'>('featured');
  const [showAll, setShowAll] = useState(false);

  const filtered = filterProjects(projects as any, activeFilter, searchQuery);
  const sorted = sortProjects(filtered, sortBy) as Project[];

  // In default 'featured' + 'all' mode with no search, highlight Graphic Design & Branding alongside featured reels cleanly
  const orderedProjects = React.useMemo(() => {
    if (activeFilter === 'all' && sortBy === 'featured' && !searchQuery.trim()) {
      const graphics = sorted.filter((p) => p.media_type === 'image');
      const videos = sorted.filter((p) => p.media_type === 'video');
      return [...graphics, ...videos];
    }
    return sorted;
  }, [sorted, activeFilter, sortBy, searchQuery]);

  const isDefaultAllView = activeFilter === 'all' && !searchQuery.trim();
  const visibleProjects =
    isDefaultAllView && !showAll ? orderedProjects.slice(0, 9) : orderedProjects;

  const filterTabs = [
    { id: 'all', label: `All Works (${projects.length})` },
    { id: 'graphics', label: `Graphic Design (${projects.filter((p) => p.media_type === 'image').length})` },
    { id: 'video', label: `Video Reels (${projects.filter((p) => p.media_type === 'video').length})` },
    { id: 'branding', label: 'Logos & Branding' },
    { id: 'print', label: 'Posters & Flyers' },
    { id: 'social', label: 'Social & Banners' },
  ];

  return (
    <section
      id="work"
      className="py-20 lg:py-24 border-t border-[rgba(215,208,198,0.5)] bg-[#F4EFE8]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Editorial Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[rgba(215,208,198,0.65)]">
          <div className="max-w-2xl">
            <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-[#A88659]">
              01 · Selected Exhibition
            </span>
            <h2 className="mt-2.5 font-serif text-3xl sm:text-5xl font-medium tracking-[-0.02em] text-[#181716] leading-[1.08]">
              Visual Design &amp; <em className="italic font-normal text-[#C47D68]">Branding</em> Archive
            </h2>
            <p className="mt-3 text-sm sm:text-[15px] text-[#575049] leading-[1.7] tracking-[0.02em]">
              Corporate stationery, signature crests, retail campaign posters, and digital social systems crafted for clarity and commercial presence.
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="relative min-w-[220px] sm:w-64">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#7A7067]" />
              <input
                type="text"
                placeholder="Search title, brand, tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search portfolio works"
                className="w-full rounded-full border border-[rgba(215,208,198,0.85)] bg-[#FAF8F5] py-2.5 pl-9 pr-4 text-xs text-[#181716] placeholder-[#8E847A] focus:border-[#181716] focus:outline-none transition-colors"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort portfolio works"
              className="rounded-full border border-[rgba(215,208,198,0.85)] bg-[#FAF8F5] py-2.5 px-4 text-xs font-medium text-[#181716] focus:border-[#181716] focus:outline-none transition-colors cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="likes">Most Liked</option>
              <option value="views">Most Viewed</option>
              <option value="order">Catalog Order</option>
            </select>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="mt-7 flex flex-wrap items-center gap-2">
          {filterTabs.map((tab) => {
            const active = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveFilter(tab.id);
                  setShowAll(false);
                }}
                className={`rounded-full px-4 py-2 text-xs font-medium tracking-[0.02em] transition-all duration-200 whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#181716] text-[#FAF8F5] shadow-sm'
                    : 'bg-[#FAF8F5] text-[#575049] border border-[rgba(215,208,198,0.75)] hover:border-[#181716]/40 hover:text-[#181716]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        {visibleProjects.length === 0 ? (
          <div className="mt-14 text-center py-16 rounded-2xl border border-dashed border-[rgba(215,208,198,0.9)] bg-[#FAF8F5]">
            <p className="font-serif text-xl text-[#181716]">No projects found matching your filter</p>
            <p className="mt-1.5 text-xs text-[#6E655D]">Try clearing your search query or viewing all disciplines.</p>
            <button
              type="button"
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="mt-5 rounded-full bg-[#181716] px-5 py-2 text-xs font-medium text-[#FAF8F5] hover:bg-[#C47D68] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-10">
              {visibleProjects.map((project) => {
                const isLiked = likedIds.has(project.id);
                const isVideo = project.media_type === 'video';
                const isDarkMat = isVideo || DARK_MEDIA_SLUGS.has(project.slug);

                return (
                  <article
                    key={project.id}
                    data-project-id={project.id}
                    onClick={() => onSelectProject(project)}
                    className="group cursor-pointer flex flex-col"
                  >
                    {/* Uniform 4:3 Editorial Exhibition Frame */}
                    <div
                      className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[rgba(215,208,198,0.75)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_24px_48px_-16px_rgba(24,23,22,0.16)] ${
                        isDarkMat ? 'bg-[#181716]' : 'bg-[#EAE3D8]'
                      }`}
                    >
                      {isVideo ? (
                        <video
                          src={`${project.media_url}#t=1`}
                          preload="metadata"
                          muted
                          playsInline
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <img
                          src={project.media_url}
                          alt={project.title}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      )}

                      {/* Discreet Corner Like Action */}
                      <button
                        type="button"
                        onClick={(e) => onLikeProject(project.id, e)}
                        aria-label={`Like project ${project.title}`}
                        className={`absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur-md transition-colors ${
                          isLiked
                            ? 'bg-[#C47D68] text-white'
                            : 'bg-[#FAF8F5]/90 text-[#181716] border border-[rgba(215,208,198,0.7)] hover:bg-[#181716] hover:text-[#FAF8F5]'
                        }`}
                      >
                        <Heart className={`h-3 w-3 ${isLiked ? 'fill-white text-white' : ''}`} />
                        <span className="tabular-nums">{project.likes_count}</span>
                      </button>

                      {/* Video Play Indicator */}
                      {isVideo && (
                        <div className="pointer-events-none absolute top-3 left-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 backdrop-blur-md text-[#FAF8F5] border border-white/15">
                          <Play className="h-3 w-3 ml-0.5 fill-current" />
                        </div>
                      )}

                      {/* Hover Quick-View Scrim */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#181716]/85 via-[#181716]/35 to-transparent p-4 pt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-between text-xs text-[#FAF8F5]">
                        <span className="inline-flex items-center gap-1 font-medium tracking-[0.03em]">
                          Inspect Work <ArrowUpRight className="h-3.5 w-3.5 text-[#C5A880]" />
                        </span>
                        <span className="tabular-nums inline-flex items-center gap-1 text-[#FAF8F5]/80">
                          <Eye className="h-3 w-3 text-[#C5A880]" /> {project.views_count}
                        </span>
                      </div>
                    </div>

                    {/* Clean Unboxed Exhibition Typography Below Image */}
                    <div className="mt-4 px-0.5">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[#7A7067]">
                        <span className="font-semibold text-[#A88659] truncate">
                          {project.client_or_brand}
                        </span>
                        <span aria-hidden="true" className="text-[#C5A880]">/</span>
                        <span className="capitalize shrink-0">{project.category}</span>
                      </div>

                      <h3 className="mt-1.5 font-serif text-xl font-medium text-[#181716] group-hover:text-[#C47D68] transition-colors line-clamp-1">
                        {project.title}
                      </h3>

                      <p className="mt-1 text-xs text-[#575049] line-clamp-2 leading-relaxed tracking-[0.01em]">
                        {project.description}
                      </p>

                      <div className="mt-2.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-[#7A7067]">
                        {project.tags.slice(0, 3).map((tag, i) => (
                          <React.Fragment key={tag}>
                            {i > 0 && <span aria-hidden="true" className="text-[#C5A880]">·</span>}
                            <span>{tag}</span>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {isDefaultAllView && orderedProjects.length > 9 && (
              <div className="mt-12 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAll(!showAll)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#181716]/25 bg-[#FAF8F5] px-7 py-3 text-xs font-medium tracking-[0.04em] text-[#181716] hover:border-[#181716] hover:bg-[#181716] hover:text-[#FAF8F5] transition-all duration-200"
                >
                  <span>
                    {showAll
                      ? 'Show Curated Highlights (9)'
                      : `Explore Complete Archive (${orderedProjects.length} Works)`}
                  </span>
                  <ArrowDown
                    className={`h-3.5 w-3.5 transition-transform ${showAll ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
