import React, { useState, useEffect } from 'react';
import { X, Heart, Eye, MessageSquare, Send, Star, Film, Image as ImageIcon, Check } from 'lucide-react';
import { collection, doc, getDocs, increment, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Project, ProjectComment } from '../types';

interface ProjectLightboxProps {
  project: Project | null;
  onClose: () => void;
  onLike: (id: string | number) => void;
  isLiked: boolean;
  onAddComment: (projectId: string | number, author: string, comment: string, rating: number) => Promise<void>;
}

export const ProjectLightbox: React.FC<ProjectLightboxProps> = ({
  project,
  onClose,
  onLike,
  isLiked,
  onAddComment,
}) => {
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [commentSuccess, setCommentSuccess] = useState(false);

  const loadComments = async (projectId: string | number) => {
    try {
      const snap = await getDocs(collection(db, 'projects', String(projectId), 'comments'));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ProjectComment[];
      list.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
      setComments(list);
      return;
    } catch (e) {
      console.warn('Firestore comments read fallback:', e);
    }

    if (typeof projectId === 'number' || /^\d+$/.test(String(projectId))) {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.comments) setComments(data.comments);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    if (project) {
      setComments(project.comments || []);
      loadComments(project.id);

      updateDoc(doc(db, 'projects', String(project.id)), { views_count: increment(1) }).catch(() => {
        if (typeof project.id === 'number' || /^\d+$/.test(String(project.id))) {
          fetch(`/api/projects/${project.id}/views`, { method: 'POST' }).catch(console.error);
        }
      });
    }
  }, [project]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !commentText.trim()) return;

    setSubmitting(true);
    try {
      await onAddComment(project.id, authorName.trim(), commentText.trim(), rating);
      setCommentSuccess(true);
      await loadComments(project.id);
      setCommentText('');
      setAuthorName('');
      setTimeout(() => setCommentSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const isVideo = project.media_type === 'video';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#181716]/80 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-[rgba(215,208,198,0.8)] bg-[#FAF8F5] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[rgba(215,208,198,0.6)] px-6 py-4 bg-white">
          <div className="flex items-center gap-2.5 text-xs text-[#6E655D]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FAF8F5] border border-[rgba(215,208,198,0.8)] text-[#C47D68]">
              {isVideo ? <Film className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />}
            </span>
            <span className="font-semibold text-[#181716] text-sm">{project.client_or_brand}</span>
            <span aria-hidden="true" className="text-[#C5A880]">/</span>
            <span className="capitalize">{project.category}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onLike(project.id)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                isLiked
                  ? 'bg-[#C47D68] text-white'
                  : 'bg-[#FAF8F5] border border-[rgba(215,208,198,0.8)] text-[#181716] hover:border-[#181716]'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-white' : 'text-[#C47D68]'}`} />
              <span className="tabular-nums">{project.likes_count}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="rounded-full p-2 text-[#6E655D] hover:bg-[#181716]/5 hover:text-[#181716] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Media Presentation Pane */}
            <div className="lg:col-span-7 bg-[#181716] flex items-center justify-center p-6 min-h-[340px] max-h-[620px] overflow-hidden border-b lg:border-b-0 lg:border-r border-[rgba(215,208,198,0.5)]">
              {isVideo ? (
                <video
                  src={project.media_url}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[560px] w-auto max-w-full rounded-xl object-contain shadow-2xl"
                />
              ) : (
                <img
                  src={project.media_url}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[560px] w-auto max-w-full rounded-xl object-contain shadow-2xl"
                />
              )}
            </div>

            {/* Project Details Column */}
            <div className="lg:col-span-5 p-6 flex flex-col justify-between bg-[#FAF8F5]">
              <div>
                <h3 className="font-serif text-2xl font-medium text-[#181716] leading-snug">
                  {project.title}
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-[#575049] leading-relaxed">
                  {project.description}
                </p>

                <div className="mt-5 pt-4 border-t border-[rgba(215,208,198,0.6)]">
                  <span className="text-[10px] font-medium text-[#7A7067] uppercase tracking-[0.14em] block mb-2">
                    Tools &amp; Scope
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#A88659] font-medium">
                    {project.tags.map((tag, idx) => (
                      <React.Fragment key={tag}>
                        {idx > 0 && <span aria-hidden="true" className="text-[#C5A880]">·</span>}
                        <span>{tag}</span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-4 text-xs border-t border-[rgba(215,208,198,0.6)] pt-3">
                  <span className="flex items-center gap-1 tabular-nums text-[#C47D68] font-medium">
                    <Heart className="h-3.5 w-3.5 fill-[#C47D68]" /> {project.likes_count} Likes
                  </span>
                  <span className="flex items-center gap-1 tabular-nums text-[#6E655D]">
                    <Eye className="h-3.5 w-3.5 text-[#A88659]" /> {project.views_count} Views
                  </span>
                  <span className="flex items-center gap-1 tabular-nums text-[#181716] font-medium">
                    <MessageSquare className="h-3.5 w-3.5 text-[#A88659]" /> {comments.length} Notes
                  </span>
                </div>
              </div>

              {/* Comments & Interactive Feedback */}
              <div className="mt-6 pt-5 border-t border-[rgba(215,208,198,0.6)]">
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#181716] mb-3">
                  Client &amp; Peer Feedback
                </h4>

                <div className="max-h-40 overflow-y-auto space-y-2 pr-1 mb-4">
                  {comments.length === 0 ? (
                    <p className="text-xs text-[#7A7067] italic py-2">
                      No notes posted yet. Leave the first endorsement below.
                    </p>
                  ) : (
                    comments.map((c) => (
                      <div key={c.id} className="rounded-xl bg-white p-3 border border-[rgba(215,208,198,0.65)] text-xs">
                        <div className="flex items-center justify-between text-[#6E655D] mb-1">
                          <span className="font-semibold text-[#181716]">{c.authorName || c.author_name || 'Visitor'}</span>
                          <div className="flex items-center text-[#C5A880]">
                            {Array.from({ length: c.rating }).map((_, i) => (
                              <Star key={i} className="h-2.5 w-2.5 fill-[#C5A880]" />
                            ))}
                          </div>
                        </div>
                        <p className="text-[#575049]">{c.comment}</p>
                      </div>
                    ))
                  )}
                </div>

                {commentSuccess ? (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-center text-xs text-emerald-800 font-medium flex items-center justify-center gap-1.5">
                    <Check className="h-3.5 w-3.5" /> Feedback saved to Cloud Firestore!
                  </div>
                ) : (
                  <form onSubmit={handleSubmitComment} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Your Name / Client"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        required
                        className="flex-1 rounded-xl border border-[rgba(215,208,198,0.85)] bg-white px-3 py-2 text-xs text-[#181716] placeholder-[#8E847A] focus:border-[#181716] focus:outline-none"
                      />
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        aria-label="Rating"
                        className="rounded-xl border border-[rgba(215,208,198,0.85)] bg-white px-2.5 py-2 text-xs text-[#181716] font-medium focus:outline-none"
                      >
                        <option value="5">5 ★</option>
                        <option value="4">4 ★</option>
                        <option value="3">3 ★</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Share quick thoughts on this design..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        required
                        className="flex-1 rounded-xl border border-[rgba(215,208,198,0.85)] bg-white px-3 py-2 text-xs text-[#181716] placeholder-[#8E847A] focus:border-[#181716] focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-full bg-[#181716] px-4 py-2 text-xs font-medium text-[#FAF8F5] hover:bg-[#C47D68] disabled:opacity-50 transition-colors flex items-center gap-1"
                      >
                        <Send className="h-3 w-3" />
                        <span>Post</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
