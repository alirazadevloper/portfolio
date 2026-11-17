import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { validateInquiryForm } from '../utils/portfolio-logic';

interface ContactSectionProps {
  onSubmitInquiry: (data: any) => Promise<boolean>;
  onOpenAdmin: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onSubmitInquiry, onOpenAdmin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Full-Time Hiring (Graphic Designer / Video Editor)',
    budget: 'Standard Market Rate',
    timeline: 'Immediate / Full-Time',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateInquiryForm(formData);
    if (!validation.valid) {
      setErrorMessage(validation.errors[0].message);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const ok = await onSubmitInquiry(formData);
      if (ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: 'Full-Time Hiring (Graphic Designer / Video Editor)',
          budget: 'Standard Market Rate',
          timeline: 'Immediate / Full-Time',
          message: '',
        });
      } else {
        setErrorMessage('Failed to submit message to database. Please try again.');
      }
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-20 lg:py-24 border-t border-[rgba(215,208,198,0.5)] bg-[#FAF8F5]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Contact Credentials */}
          <div className="lg:col-span-5">
            <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-[#A88659]">
              05 · Consultation &amp; Hiring
            </span>
            <h2 className="mt-2.5 font-serif text-3xl sm:text-5xl font-medium tracking-[-0.02em] text-[#181716] leading-[1.08]">
              Ready to <em className="italic font-normal text-[#C47D68]">Collaborate</em> or Hire?
            </h2>
            <p className="mt-4 text-sm sm:text-[15px] text-[#575049] leading-[1.7] tracking-[0.02em]">
              Available for full-time studio or corporate placement as well as bespoke freelance brand identity and reel commissions.
            </p>

            {/* Clean Hairline Contact Rows */}
            <div className="mt-8 divide-y divide-[rgba(215,208,198,0.6)] border-t border-b border-[rgba(215,208,198,0.6)]">
              <div className="py-4 flex items-start gap-3.5">
                <Phone className="h-4 w-4 text-[#C47D68] shrink-0 mt-1" />
                <div>
                  <div className="text-[11px] uppercase tracking-[0.12em] text-[#7A7067]">Call / WhatsApp</div>
                  <a
                    href="tel:03129547572"
                    className="mt-0.5 block text-sm font-medium text-[#181716] hover:text-[#C47D68] transition-colors tabular-nums"
                  >
                    03129547572
                  </a>
                  <span className="text-xs text-[#6E655D]">Alternative: +92-3126292672</span>
                </div>
              </div>

              <div className="py-4 flex items-start gap-3.5">
                <Mail className="h-4 w-4 text-[#C47D68] shrink-0 mt-1" />
                <div>
                  <div className="text-[11px] uppercase tracking-[0.12em] text-[#7A7067]">Direct Email</div>
                  <a
                    href="mailto:munazza.00077@gmail.com"
                    className="mt-0.5 block text-sm font-medium text-[#181716] hover:text-[#C47D68] transition-colors"
                  >
                    munazza.00077@gmail.com
                  </a>
                </div>
              </div>

              <div className="py-4 flex items-start gap-3.5">
                <MapPin className="h-4 w-4 text-[#C47D68] shrink-0 mt-1" />
                <div>
                  <div className="text-[11px] uppercase tracking-[0.12em] text-[#7A7067]">Studio Location</div>
                  <span className="mt-0.5 block text-sm font-medium text-[#181716]">
                    Rawalpindi, Punjab, Pakistan
                  </span>
                  <span className="text-xs text-[#6E655D]">Open to On-site Office &amp; Remote Roles</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/923129547572?text=Hello%20Munazza,%20I%20reviewed%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20job%20opportunity."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#181716] px-6 py-3 text-xs font-medium tracking-[0.03em] text-[#FAF8F5] hover:bg-[#C47D68] transition-colors shadow-sm"
              >
                <MessageCircle className="h-3.5 w-3.5 text-[#C5A880]" />
                <span>Chat on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-2 rounded-full border border-[#181716]/25 bg-white px-5 py-3 text-xs font-medium text-[#181716] hover:border-[#181716] transition-colors"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-[#A88659]" />
                <span>Admin &amp; Inquiries Portal</span>
              </button>
            </div>
          </div>

          {/* Right Column: Editorial Inquiry Sheet */}
          <div className="lg:col-span-7 rounded-2xl border border-[rgba(215,208,198,0.75)] bg-white p-7 sm:p-9 shadow-[0_24px_56px_-24px_rgba(24,23,22,0.12)]">
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#181716]">
              Send an Inquiry or Job Proposal
            </h3>
            <p className="mt-1.5 text-xs text-[#6E655D] mb-6 leading-relaxed">
              Every submission is logged directly into the studio’s Cloud Firestore inbox.
            </p>

            {submitted ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-8 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-700 mb-3" />
                <h4 className="font-serif text-xl font-medium text-[#181716]">
                  Inquiry Logged Successfully
                </h4>
                <p className="mt-2 text-xs text-[#575049] max-w-md mx-auto leading-relaxed">
                  Thank you! Your proposal has been saved to Cloud Firestore and Munazza will respond shortly.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="rounded-full border border-[rgba(215,208,198,0.85)] bg-white px-5 py-2.5 text-xs font-medium text-[#181716] hover:border-[#181716] transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="rounded-full bg-[#181716] px-5 py-2.5 text-xs font-medium text-[#FAF8F5] hover:bg-[#C47D68] transition-colors"
                  >
                    Open Admin Portal
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="rounded-xl border border-[#C47D68]/50 bg-[#C47D68]/10 p-3 text-xs text-[#8A4634] font-medium">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#181716] mb-1.5">
                      Your Full Name <span className="text-[#C47D68]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Asad Qureshi"
                      className="w-full rounded-xl border border-[rgba(215,208,198,0.85)] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#181716] placeholder-[#8E847A] focus:border-[#181716] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#181716] mb-1.5">
                      Email Address <span className="text-[#C47D68]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      className="w-full rounded-xl border border-[rgba(215,208,198,0.85)] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#181716] placeholder-[#8E847A] focus:border-[#181716] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#181716] mb-1.5">
                      Phone / WhatsApp (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+92 300 1234567"
                      className="w-full rounded-xl border border-[rgba(215,208,198,0.85)] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#181716] placeholder-[#8E847A] focus:border-[#181716] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#181716] mb-1.5">
                      Service / Role Needed <span className="text-[#C47D68]">*</span>
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[rgba(215,208,198,0.85)] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#181716] focus:border-[#181716] focus:outline-none"
                    >
                      <option value="Full-Time Hiring (Graphic Designer / Video Editor)">Full-Time Employment (Graphic Designer / Video Editor)</option>
                      <option value="Graphic Design (Social Media, Flyers, Logos)">Graphic Design (Social Media, Flyers, Logos)</option>
                      <option value="Video Editing (Reels, Montages, Subtitles)">Video Editing (Reels, Montages, Subtitles)</option>
                      <option value="Computer Operator / MS Office Specialist">Computer Operator / MS Office Specialist</option>
                      <option value="Office Assistant / IT Support">Office Assistant / IT Support</option>
                      <option value="Custom Freelance Project">Custom Freelance Project</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#181716] mb-1.5">
                      Timeline / Availability
                    </label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[rgba(215,208,198,0.85)] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#181716] focus:border-[#181716] focus:outline-none"
                    >
                      <option value="Immediate / Full-Time">Immediate / Full-Time</option>
                      <option value="Within 1–2 Weeks">Within 1–2 Weeks</option>
                      <option value="Flexible / Ongoing">Flexible / Ongoing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#181716] mb-1.5">
                      Expected Budget / Salary Offer
                    </label>
                    <input
                      type="text"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="e.g. Monthly Salary or Project Budget"
                      className="w-full rounded-xl border border-[rgba(215,208,198,0.85)] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#181716] placeholder-[#8E847A] focus:border-[#181716] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#181716] mb-1.5">
                    Position or Project Description <span className="text-[#C47D68]">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your requirements (e.g. daily video reels, brand identity, office document preparation, or full-time office details)..."
                    className="w-full rounded-xl border border-[rgba(215,208,198,0.85)] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#181716] placeholder-[#8E847A] focus:border-[#181716] focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#7A7067]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#A88659]" />
                    <span>Persisted securely in Cloud Firestore</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-full bg-[#181716] px-7 py-3 text-xs font-medium tracking-[0.04em] text-[#FAF8F5] hover:bg-[#C47D68] disabled:opacity-50 transition-colors shadow-sm"
                  >
                    <Send className="h-3.5 w-3.5 text-[#C5A880]" />
                    <span>{loading ? 'Submitting...' : 'Send Inquiry'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
