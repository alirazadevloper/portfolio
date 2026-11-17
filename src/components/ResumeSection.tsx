import React, { useState } from 'react';
import { FileText, Printer, X, ChevronDown, ChevronUp, ArrowUpRight } from 'lucide-react';
import { SkillItem } from '../types';
import { SkillIcon } from './SkillIcon';
import { getDefaultSkillIcon } from '../utils/portfolio-logic';

interface ResumeSectionProps {
  onOpenInquiry: () => void;
  skills?: SkillItem[];
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({ onOpenInquiry, skills }) => {
  const [showCVModal, setShowCVModal] = useState(false);
  const [expandedSkillIds, setExpandedSkillIds] = useState<Record<string, boolean>>({});
  const [skillCategoryFilter, setSkillCategoryFilter] = useState<'all' | 'design' | 'video' | 'office' | 'it'>('all');

  const defaultSkills: SkillItem[] = [
    {
      id: 'default-1',
      name: 'Canva Pro',
      category: 'design',
      focus: 'Social Media & Banners',
      proficiency: 95,
      icon: 'palette',
      details:
        'Creates cohesive brand kits, Instagram carousels, retail sale posters, business stationery, and web hero banners with balanced typography.',
    },
    {
      id: 'default-2',
      name: 'Adobe Photoshop',
      category: 'design',
      focus: 'Photo Composites & Flyers',
      proficiency: 85,
      icon: 'layers',
      details:
        'Skilled in background removal, realistic shadow blending, commercial food/fashion poster retouching, and print-ready flyers.',
    },
    {
      id: 'default-3',
      name: 'Adobe Premiere Pro',
      category: 'video',
      focus: 'Reels Pacing & Beat Sync',
      proficiency: 90,
      icon: 'film',
      details:
        'Edits vertical 9:16 real estate drone reels, corporate progress films, multi-split screen layouts, and smooth audio mixing.',
    },
    {
      id: 'default-4',
      name: 'CapCut Studio',
      category: 'video',
      focus: 'Viral Hooks & Urdu Captions',
      proficiency: 92,
      icon: 'scissors',
      details:
        'Specializes in high-retention short-form pacing, bilingual Urdu/English animated subtitles, and rhythmic sound FX.',
    },
    {
      id: 'default-5',
      name: 'MS Word',
      category: 'office',
      focus: 'Contracts & Documentation',
      proficiency: 95,
      icon: 'file-text',
      details:
        'Prepares formal business letters, structured academic reports, formatted office contracts, and proofread documentation.',
    },
    {
      id: 'default-6',
      name: 'MS Excel',
      category: 'office',
      focus: 'Data Entry, Formulas & Tracking',
      proficiency: 90,
      icon: 'table',
      details:
        'Manages accurate data entry spreadsheets, inventory logs, attendance trackers, automated formulas, and summary charts.',
    },
    {
      id: 'default-7',
      name: 'MS PowerPoint',
      category: 'office',
      focus: 'Pitch Decks & Presentations',
      proficiency: 92,
      icon: 'presentation',
      details:
        'Designs clean corporate slide decks, academic visual briefings, and executive reports tailored for meetings.',
    },
    {
      id: 'default-8',
      name: 'Windows OS & Hardware',
      category: 'it',
      focus: 'Setup, Troubleshooting & Drivers',
      proficiency: 90,
      icon: 'monitor',
      details:
        'Handles clean Windows installation, essential driver setup, hardware troubleshooting, and AI productivity workflows.',
    },
  ];

  const resolvedSkills: SkillItem[] = skills && skills.length > 0 ? skills : defaultSkills;

  const filteredSkills = resolvedSkills.filter((s) =>
    skillCategoryFilter === 'all' ? true : s.category === skillCategoryFilter
  );

  const toggleSkillDetails = (id: string | number) => {
    const key = String(id);
    setExpandedSkillIds((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const categoryLabels: Record<string, string> = {
    design: 'Graphic Design',
    video: 'Video Editing',
    office: 'MS Office',
    it: 'IT Support',
  };

  const skillPillars = [
    {
      number: '01',
      title: 'Graphic Design & Branding',
      items: [
        'Instagram & TikTok campaign visuals',
        'Luxury business cards & stationery',
        'Promotional flyers & retail posters',
        'Vector logos & monogram crests',
      ],
    },
    {
      number: '02',
      title: 'Short-Form Video Editing',
      items: [
        'Vertical 9:16 high-retention reels',
        'Beat-synced cuts & drone montages',
        'Urdu & English animated captions',
        'Voiceover sync & sound mixing',
      ],
    },
    {
      number: '03',
      title: 'MS Office & Operations',
      items: [
        'MS Word executive formatting',
        'MS Excel formulas & tracking sheets',
        'MS PowerPoint corporate decks',
        'Google Workspace & Zoom coordination',
      ],
    },
    {
      number: '04',
      title: 'IT Support & Systems',
      items: [
        'Clean Windows OS installation',
        'Driver setups & troubleshooting',
        'Digital research & archiving',
        'AI productivity workflows',
      ],
    },
  ];

  const handlePrintCV = () => {
    window.print();
  };

  return (
    <section
      id="resume"
      className="py-20 lg:py-24 border-t border-[rgba(215,208,198,0.5)] bg-[#FAF8F5]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[rgba(215,208,198,0.6)]">
          <div className="max-w-2xl">
            <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-[#A88659]">
              03 · Qualifications &amp; Craft
            </span>
            <h2 className="mt-2.5 font-serif text-3xl sm:text-5xl font-medium tracking-[-0.02em] text-[#181716] leading-[1.08]">
              Skills, Experience &amp; <em className="italic font-normal text-[#C47D68]">Curriculum</em> Vitae
            </h2>
            <p className="mt-3 text-sm sm:text-[15px] text-[#575049] leading-[1.7] tracking-[0.02em]">
              Certified 6-Month IT &amp; Creative curriculum paired with an active BS in English—prepared for full-time studio, agency, or corporate office placement.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCVModal(true)}
            className="inline-flex items-center gap-2.5 rounded-full bg-[#181716] px-6 py-3 text-xs font-medium tracking-[0.04em] text-[#FAF8F5] hover:bg-[#C47D68] transition-colors shadow-sm whitespace-nowrap shrink-0 self-start md:self-auto"
          >
            <FileText className="h-3.5 w-3.5 text-[#C5A880]" />
            <span>View &amp; Print Official CV</span>
          </button>
        </div>

        {/* 4 Typographic Discipline Pillars (No Nested Boxes — Pure Editorial Hairlines) */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-[rgba(215,208,198,0.65)] pb-12 border-b border-[rgba(215,208,198,0.55)]">
          {skillPillars.map((pillar, index) => (
            <div
              key={pillar.number}
              className={`${index === 0 ? 'lg:pr-7' : index === 3 ? 'lg:pl-7' : 'lg:px-7'}`}
            >
              <span className="font-serif italic text-lg text-[#C47D68]">{pillar.number}.</span>
              <h3 className="mt-1 font-serif text-xl font-medium text-[#181716]">
                {pillar.title}
              </h3>
              <ul className="mt-4 space-y-2.5 text-xs text-[#575049] leading-relaxed">
                {pillar.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span aria-hidden="true" className="text-[#C5A880] mt-0.5">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Dynamic Software Stack & Skill Details (Single-Elevation Editorial Cards) */}
        <div className="mt-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#181716]">
                Production Stack &amp; <em className="italic font-normal text-[#A88659]">Software</em> Mastery
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-[#6E655D]">
                Interactive toolkit synced live from Firestore — inspect workflow details for any discipline.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(['all', 'design', 'video', 'office', 'it'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSkillCategoryFilter(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-[11px] font-medium transition-colors whitespace-nowrap ${
                    skillCategoryFilter === cat
                      ? 'bg-[#181716] text-[#FAF8F5]'
                      : 'bg-white text-[#575049] border border-[rgba(215,208,198,0.75)] hover:border-[#181716]'
                  }`}
                >
                  {cat === 'all' ? `All (${resolvedSkills.length})` : categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredSkills.map((tech) => {
              const idKey = String(tech.id);
              const isExpanded = Boolean(expandedSkillIds[idKey]);
              const iconKey = tech.icon || getDefaultSkillIcon(tech.category);
              const detailsText =
                tech.details ||
                tech.focus ||
                'Applied in client deliverables, academic projects, and daily studio production workflows.';
              const isLongDetails = detailsText.length > 65;

              return (
                <div
                  key={idKey}
                  data-skill-card={tech.name}
                  className="rounded-2xl border border-[rgba(215,208,198,0.7)] bg-white p-5 flex flex-col justify-between transition-all duration-200 hover:border-[#C5A880] hover:shadow-[0_14px_30px_-14px_rgba(24,23,22,0.12)]"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FAF8F5] text-[#C47D68] border border-[rgba(215,208,198,0.7)]">
                          <SkillIcon icon={iconKey} category={tech.category} className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-serif text-base font-semibold text-[#181716] truncate">
                            {tech.name}
                          </h4>
                          <span className="text-[11px] text-[#7A7067] block truncate">
                            {categoryLabels[tech.category] || tech.category}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-[#A88659] tabular-nums shrink-0">
                        {tech.proficiency}%
                      </span>
                    </div>

                    <div className="mt-3 text-xs font-medium text-[#181716] truncate">
                      {tech.focus || 'Core Qualification'}
                    </div>

                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[#EFEAE2]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#181716] via-[#A88659] to-[#C5A880]"
                        style={{ width: `${tech.proficiency}%` }}
                      />
                    </div>

                    <p
                      className={`mt-3 text-xs text-[#575049] leading-relaxed ${
                        isExpanded ? '' : 'line-clamp-2'
                      }`}
                    >
                      {detailsText}
                    </p>
                  </div>

                  {isLongDetails && (
                    <button
                      type="button"
                      onClick={() => toggleSkillDetails(idKey)}
                      className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-[#A88659] hover:text-[#181716] transition-colors self-start"
                    >
                      <span>{isExpanded ? 'Hide Details' : 'Read Skill Details'}</span>
                      {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Education & Target Roles Spread (Clean Hairlines, No Nested Card Stack) */}
        <div className="mt-14 pt-12 border-t border-[rgba(215,208,198,0.55)] grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Academic Education */}
          <div className="lg:col-span-7">
            <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-[#A88659]">
              Education &amp; Certification
            </span>
            <h3 className="mt-1.5 font-serif text-2xl font-medium text-[#181716]">
              Academic Foundation
            </h3>

            <div className="mt-6 divide-y divide-[rgba(215,208,198,0.6)] border-t border-b border-[rgba(215,208,198,0.6)]">
              <div className="py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="font-serif text-lg font-medium text-[#181716]">
                    Bachelor of Science in English (3rd Semester)
                  </h4>
                  <span className="text-xs text-[#A88659] font-medium">2024 – Present</span>
                </div>
                <p className="text-xs text-[#7A7067] mt-0.5">
                  Khan Muhammad Khan Post Graduate College, Pallandri
                </p>
                <p className="text-xs text-[#575049] mt-2 leading-relaxed">
                  Specializing in English linguistics, discourse analysis, corporate communication, and editorial writing.
                </p>
              </div>

              <div className="py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="font-serif text-lg font-medium text-[#181716]">
                    Certified 6-Month IT, Design &amp; Office Program
                  </h4>
                  <span className="text-xs text-[#7A7067]">Completed</span>
                </div>
                <p className="text-xs text-[#7A7067] mt-0.5">
                  Technical Training &amp; Computer Education Institute
                </p>
                <p className="text-xs text-[#575049] mt-2 leading-relaxed">
                  Full MS Office suite, digital graphic design, short-form video editing, Windows installation, and AI productivity tools.
                </p>
              </div>

              <div className="py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="font-serif text-lg font-medium text-[#181716]">
                    Intermediate (F.Sc. Pre-Science)
                  </h4>
                  <span className="text-xs text-[#7A7067]">Higher Secondary</span>
                </div>
                <p className="text-xs text-[#7A7067] mt-0.5">Read Foundation College, Pallandri</p>
              </div>
            </div>
          </div>

          {/* Target Positions & Placement Availability */}
          <div className="lg:col-span-5 rounded-2xl border border-[rgba(215,208,198,0.75)] bg-white p-6 sm:p-7">
            <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-[#A88659]">
              Placement Availability
            </span>
            <h3 className="mt-1.5 font-serif text-2xl font-medium text-[#181716]">
              Target Roles
            </h3>

            <ul className="mt-5 divide-y divide-[rgba(215,208,198,0.45)]">
              {[
                { role: 'Junior Graphic Designer', desc: 'Brand kits, posters, social campaigns & logos' },
                { role: 'Video Editor & Reel Creator', desc: 'Vertical montages, beat sync & bilingual captions' },
                { role: 'MS Office & Computer Operator', desc: 'Excel tracking, Word contracts & pitch decks' },
                { role: 'Office & IT Support Assistant', desc: 'System setup, archiving & digital correspondence' },
                { role: 'Digital Studio Assistant', desc: 'Research, online meetings & AI workflow support' },
              ].map((pos) => (
                <li key={pos.role} className="py-3 first:pt-0 last:pb-0">
                  <h4 className="text-xs font-semibold text-[#181716]">{pos.role}</h4>
                  <p className="text-[11px] text-[#6E655D] mt-0.5">{pos.desc}</p>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-5 border-t border-[rgba(215,208,198,0.55)]">
              <div className="flex items-center justify-between text-xs mb-4">
                <span className="text-[#6E655D]">Languages: Urdu · English</span>
                <span className="font-medium text-[#181716]">Full-Time · Immediate</span>
              </div>
              <button
                type="button"
                onClick={onOpenInquiry}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#181716] hover:bg-[#C47D68] text-[#FAF8F5] py-3 text-xs font-medium tracking-[0.04em] transition-colors"
              >
                <span>Send Employment Offer</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-[#C5A880]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Official Printable CV Sheet Modal */}
      {showCVModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#181716]/75 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl border border-[rgba(215,208,198,0.8)] bg-[#FAF8F5] text-[#181716] shadow-2xl p-6 sm:p-10 my-auto max-h-[92vh] overflow-y-auto print:p-0 print:border-none print:shadow-none">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(215,208,198,0.7)] print:hidden">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#A88659]">
                Official Curriculum Vitae
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintCV}
                  className="flex items-center gap-1.5 rounded-full bg-[#181716] px-4 py-1.5 text-xs font-medium text-[#FAF8F5] hover:bg-[#C47D68] transition-colors"
                >
                  <Printer className="h-3.5 w-3.5" /> Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={() => setShowCVModal(false)}
                  aria-label="Close CV modal"
                  className="rounded-full p-1.5 text-[#6E655D] hover:bg-[#181716]/5 hover:text-[#181716]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="border-b-2 border-[#181716] pb-4">
                <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#181716]">
                  Munazza Irfan
                </h2>
                <p className="text-xs font-medium text-[#C47D68] tracking-[0.14em] mt-1 uppercase">
                  IT &amp; Office Skills · Graphic Designer · Video Editor
                </p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#575049]">
                  <span><strong>Phone:</strong> 03129547572</span>
                  <span>·</span>
                  <span><strong>Email:</strong> munazza.00077@gmail.com</span>
                  <span>·</span>
                  <span><strong>Location:</strong> Rawalpindi, Pakistan</span>
                  <span>·</span>
                  <span><strong>Nationality:</strong> Pakistani</span>
                </div>
              </div>

              <div className="mt-5">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#181716] border-b border-[rgba(215,208,198,0.7)] pb-1">
                  Professional Summary
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#575049]">
                  Motivated and detail-oriented individual who has completed a comprehensive 6-month IT course covering MS Office, graphic design, video editing and AI fundamentals. Seeking a full-time office, design, or IT support position. Able to prepare documents and presentations, create digital content, handle basic computer troubleshooting, and learn new tools quickly.
                </p>
              </div>

              <div className="mt-5">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#181716] border-b border-[rgba(215,208,198,0.7)] pb-1">
                  Education &amp; Training
                </h3>
                <div className="mt-2.5 space-y-2.5 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold text-[#181716]">
                      <span>BS in English – 3rd Semester</span>
                      <span className="text-[#7A7067] font-normal">2024 – Present</span>
                    </div>
                    <p className="text-[#575049]">Khan Muhammad Khan Post Graduate College Pallandri</p>
                  </div>
                  <div>
                    <div className="flex justify-between font-semibold text-[#181716]">
                      <span>Certified 6-Month Intensive IT Course</span>
                      <span className="text-[#7A7067] font-normal">Completed</span>
                    </div>
                    <p className="text-[#575049]">Full MS Office · Graphic Designing · Video Editing · Windows Installation · AI Fundamentals</p>
                  </div>
                  <div>
                    <div className="flex justify-between font-semibold text-[#181716]">
                      <span>Intermediate (F.Sc.)</span>
                      <span className="text-[#7A7067] font-normal">Read Foundation College, Pallandri</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#181716] border-b border-[rgba(215,208,198,0.7)] pb-1">
                  Core Skills &amp; Capabilities
                </h3>
                <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#575049]">
                  <div>
                    <p className="font-semibold text-[#181716]">MS Office &amp; Documentation</p>
                    <p>Word document preparation, Excel data formulas and tables, PowerPoint presentations.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#181716]">Graphic Design</p>
                    <p>Social media posts, luxury business cards, food/fashion posters, logos &amp; flyers in Canva and Photoshop.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#181716]">Video Editing</p>
                    <p>Short-form video reels, drone footage pacing, Urdu/English typography subtitles, audio synchronization.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#181716]">IT Basics &amp; Troubleshooting</p>
                    <p>Windows installation, software troubleshooting, online collaboration platforms, AI tools.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[rgba(215,208,198,0.7)] flex justify-between text-xs text-[#575049]">
                <div>
                  <span className="font-semibold text-[#181716]">Languages:</span> Urdu (Native), English (Fluent)
                </div>
                <div>
                  <span className="font-semibold text-[#181716]">Availability:</span> Full-Time · Immediate
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
