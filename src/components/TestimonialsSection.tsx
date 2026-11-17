import React, { useState } from 'react';
import { Star, Plus, Check } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  onAddTestimonial: (author: string, role: string, company: string, quote: string, rating: number) => Promise<void>;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
  onAddTestimonial,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !quote) return;

    setLoading(true);
    try {
      await onAddTestimonial(author, role, company, quote, rating);
      setSubmitted(true);
      setTimeout(() => {
        setShowAddModal(false);
        setSubmitted(false);
        setAuthor('');
        setRole('');
        setCompany('');
        setQuote('');
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="testimonials"
      className="py-20 lg:py-24 border-t border-[rgba(215,208,198,0.5)] bg-[#F4EFE8]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[rgba(215,208,198,0.65)]">
          <div>
            <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-[#A88659]">
              04 · Client Endorsements
            </span>
            <h2 className="mt-2.5 font-serif text-3xl sm:text-5xl font-medium tracking-[-0.02em] text-[#181716] leading-[1.08]">
              Words From <em className="italic font-normal text-[#C47D68]">Collaborators</em>
            </h2>
            <p className="mt-3 text-sm sm:text-[15px] text-[#575049] max-w-xl leading-[1.7] tracking-[0.02em]">
              Authentic feedback from real estate directors, corporate marketing leads, and fashion founders.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-full border border-[#181716]/25 bg-[#FAF8F5] px-5 py-2.5 text-xs font-medium tracking-[0.03em] text-[#181716] hover:border-[#181716] hover:bg-[#181716] hover:text-[#FAF8F5] transition-colors whitespace-nowrap shrink-0 self-start md:self-auto"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Recommendation</span>
          </button>
        </div>

        {/* 3-Column Editorial Testimonials Spread */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <blockquote
              key={t.id}
              className="flex flex-col justify-between rounded-2xl border border-[rgba(215,208,198,0.75)] bg-[#FAF8F5] p-7 transition-all duration-200 hover:border-[#C5A880]"
            >
              <div>
                <div className="flex items-center gap-1 text-[#C5A880] mb-5">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[#C5A880]" />
                  ))}
                </div>

                <p className="font-serif text-lg sm:text-[19px] leading-relaxed text-[#181716] italic">
                  “{t.quote}”
                </p>
              </div>

              <div className="mt-7 pt-5 border-t border-[rgba(215,208,198,0.5)] flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#181716] font-serif text-sm font-medium italic text-[#FAF8F5]">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#181716]">{t.author}</h4>
                  <p className="text-[11px] text-[#6E655D] mt-0.5">
                    {t.role} · <span className="text-[#A88659] font-medium">{t.company}</span>
                  </p>
                </div>
              </div>
            </blockquote>
          ))}
        </div>
      </div>

      {/* Add Endorsement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181716]/75 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-[rgba(215,208,198,0.8)] bg-[#FAF8F5] p-7 shadow-2xl">
            <h3 className="font-serif text-2xl font-medium text-[#181716]">Add a Recommendation</h3>
            <p className="mt-1.5 text-xs text-[#6E655D]">
              Your endorsement will be saved directly to the portfolio’s Cloud Firestore database.
            </p>

            {submitted ? (
              <div className="my-8 text-center py-6">
                <Check className="mx-auto h-10 w-10 text-emerald-700 mb-2" />
                <p className="text-sm font-medium text-[#181716]">Thank you for endorsing Munazza!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-[#181716] mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Asim Raza"
                    className="w-full rounded-xl border border-[rgba(215,208,198,0.85)] bg-white px-3.5 py-2.5 text-xs text-[#181716] placeholder-[#8E847A] focus:border-[#181716] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#181716] mb-1">Your Role</label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Creative Lead"
                      className="w-full rounded-xl border border-[rgba(215,208,198,0.85)] bg-white px-3.5 py-2.5 text-xs text-[#181716] placeholder-[#8E847A] focus:border-[#181716] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#181716] mb-1">Company</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Eastern Housing"
                      className="w-full rounded-xl border border-[rgba(215,208,198,0.85)] bg-white px-3.5 py-2.5 text-xs text-[#181716] placeholder-[#8E847A] focus:border-[#181716] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#181716] mb-1">Star Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full rounded-xl border border-[rgba(215,208,198,0.85)] bg-white px-3.5 py-2.5 text-xs text-[#181716] font-medium focus:border-[#181716] focus:outline-none"
                  >
                    <option value="5">5 Stars — Excellent Experience</option>
                    <option value="4">4 Stars — Very Good</option>
                    <option value="3">3 Stars — Satisfactory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#181716] mb-1">Endorsement Quote</label>
                  <textarea
                    rows={3}
                    required
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="Describe Munazza's work, creativity, timeliness or communication..."
                    className="w-full rounded-xl border border-[rgba(215,208,198,0.85)] bg-white px-3.5 py-2.5 text-xs text-[#181716] placeholder-[#8E847A] focus:border-[#181716] focus:outline-none"
                  />
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[rgba(215,208,198,0.5)]">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-full px-4 py-2 text-xs font-medium text-[#6E655D] hover:text-[#181716]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-full bg-[#181716] px-5 py-2.5 text-xs font-medium text-[#FAF8F5] hover:bg-[#C47D68] disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Submitting...' : 'Save Endorsement'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
