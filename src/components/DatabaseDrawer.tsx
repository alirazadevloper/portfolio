import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  CheckCircle,
  Clock,
  Trash2,
  Mail,
  Phone,
  RefreshCw,
  Plus,
  Layers,
  ShieldCheck,
  Tag,
  Lock,
  LogIn,
  LogOut,
  UserCheck,
  AlertCircle,
  UploadCloud,
  CheckCircle2,
} from 'lucide-react';
import { Inquiry, PortfolioStats, Project } from '../types';
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  seedFirestoreDatabase,
} from '../lib/firebase';

interface DatabaseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  inquiries: Inquiry[];
  stats: PortfolioStats | null;
  onRefresh: () => void;
  onUpdateStatus: (id: string | number, status: string) => Promise<void>;
  onDeleteInquiry: (id: string | number) => Promise<void>;
  onAddProject: (projectData: any) => Promise<void>;
}

export const DatabaseDrawer: React.FC<DatabaseDrawerProps> = ({
  isOpen,
  onClose,
  inquiries,
  stats,
  onRefresh,
  onUpdateStatus,
  onDeleteInquiry,
  onAddProject,
}) => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'new-project' | 'auth'>('inbox');
  const [user, setUser] = useState<User | null>(auth.currentUser);

  // Auth Form State
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Seeding State
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  // New Project Form State
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newCategory, setNewCategory] = useState('social');
  const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('image');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAspectRatio, setNewAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '3:4'>('1:1');
  const [newTags, setNewTags] = useState('Design, Social Media');
  const [submittingProject, setSubmittingProject] = useState(false);
  const [projectSuccess, setProjectSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setAuthLoading(true);

    try {
      if (authMode === 'signin') {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        setAuthSuccess(`Signed in successfully as ${cred.user.email}`);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        setAuthSuccess(`Admin account created for ${cred.user.email}`);
      }
      setEmail('');
      setPassword('');
      setTimeout(() => setAuthSuccess(null), 4000);
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err.message || 'Authentication failed';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setAuthSuccess('Signed out of Firebase Admin.');
      setTimeout(() => setAuthSuccess(null), 3000);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to sign out');
    }
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    setSeedResult(null);
    try {
      const res = await seedFirestoreDatabase();
      setSeedResult(`Successfully synced ${res?.projectsCount || 21} projects & ${res?.testimonialsCount || 3} testimonials into Firestore!`);
      onRefresh();
    } catch (err: any) {
      setSeedResult(`Error pushing data: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMediaUrl.trim()) return;

    setSubmittingProject(true);
    try {
      await onAddProject({
        title: newTitle.trim(),
        client_or_brand: newBrand.trim(),
        category: newCategory,
        media_type: newMediaType,
        media_url: newMediaUrl.trim(),
        description: newDescription.trim(),
        tags: newTags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        aspect_ratio: newAspectRatio,
      });

      setProjectSuccess(true);
      setNewTitle('');
      setNewBrand('');
      setNewMediaUrl('');
      setNewDescription('');
      setTimeout(() => setProjectSuccess(false), 3000);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingProject(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="flex-1" onClick={onClose} />

      {/* Slide-out Drawer Panel */}
      <div className="w-full max-w-2xl bg-neutral-900 border-l border-neutral-800 h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-white">Firebase Admin Studio</h3>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Firestore Live
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Project: <code className="text-amber-300 font-mono">planning-with-ai-e65df</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close database studio"
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Auth Banner */}
        <div className="px-6 py-3 bg-neutral-950/60 border-b border-neutral-800/80 flex items-center justify-between text-xs">
          {user ? (
            <div className="flex items-center gap-2 text-neutral-300">
              <UserCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                Signed in as <strong className="text-white font-mono">{user.email}</strong>
              </span>
              <span className="rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-300 font-semibold">
                Admin
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-neutral-400">
              <Lock className="h-4 w-4 text-amber-400 shrink-0" />
              <span>Visitor Mode (Sign in with Email/Password for Admin controls)</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-neutral-400 hover:bg-neutral-800 hover:text-rose-400 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('auth')}
                className="flex items-center gap-1 rounded-lg bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 text-xs font-semibold text-amber-400 hover:bg-amber-400 hover:text-neutral-950 transition-colors"
              >
                <LogIn className="h-3.5 w-3.5" /> Admin Login
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/80 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'inbox'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>Inquiries Inbox</span>
            <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] tabular-nums text-neutral-300">
              {inquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('new-project')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'new-project'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Publish Project</span>
          </button>

          <button
            onClick={() => setActiveTab('auth')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'auth'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Auth & Cloud Sync</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: INBOX */}
          {activeTab === 'inbox' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Live Client Inquiries ({inquiries.length})
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Submissions from the portfolio contact form logged in real time.
                  </p>
                </div>
                <button
                  onClick={onRefresh}
                  className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors font-semibold"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Refresh
                </button>
              </div>

              {inquiries.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-neutral-800 rounded-2xl bg-neutral-950/40">
                  <Mail className="mx-auto h-8 w-8 text-neutral-600 mb-2" />
                  <p className="text-sm text-neutral-300 font-medium">No inquiries received yet</p>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                    When visitors submit the contact form, submissions appear here instantly.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-950/50 hover:border-neutral-700 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-display text-sm font-bold text-white">{inq.name}</h5>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                                inq.status === 'hired'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : inq.status === 'contacted'
                                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                  : inq.status === 'archived'
                                  ? 'bg-neutral-800 text-neutral-400'
                                  : 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                              }`}
                            >
                              {inq.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-neutral-400">
                            <a
                              href={`mailto:${inq.email}`}
                              className="flex items-center gap-1 hover:text-amber-400 transition-colors"
                            >
                              <Mail className="h-3 w-3" /> {inq.email}
                            </a>
                            {inq.phone && (
                              <a
                                href={`tel:${inq.phone}`}
                                className="flex items-center gap-1 hover:text-amber-400 transition-colors"
                              >
                                <Phone className="h-3 w-3" /> {inq.phone}
                              </a>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => onDeleteInquiry(inq.id)}
                          aria-label="Delete inquiry"
                          className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-800 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="rounded-lg bg-neutral-900/80 p-3 text-xs text-neutral-300 leading-relaxed border border-neutral-800/50">
                        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-neutral-800 text-[11px] text-neutral-400">
                          <span className="font-semibold text-amber-300">{inq.service}</span>
                          {inq.budget && (
                            <span className="text-neutral-400">
                              Budget: <strong className="text-white">{inq.budget}</strong>
                            </span>
                          )}
                        </div>
                        <p>{inq.message}</p>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-500">
                        <span>
                          {inq.created_at ? new Date(inq.created_at).toLocaleDateString() : 'Just now'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-neutral-400">Status:</span>
                          <select
                            value={inq.status}
                            onChange={(e) => onUpdateStatus(inq.id, e.target.value)}
                            className="rounded-lg border border-neutral-800 bg-neutral-900 px-2 py-1 text-xs text-neutral-300 focus:border-amber-400 focus:outline-none"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="hired">Hired</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PUBLISH NEW PROJECT */}
          {activeTab === 'new-project' && (
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white">Publish New Creative Asset</h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Insert projects directly into the live database. They will render immediately in the exhibition gallery.
                </p>
              </div>

              {projectSuccess && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span>Project published successfully to database!</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Modern Silk Business Card"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Client / Brand
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Al-Jannat Collection"
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                    >
                      <option value="social">Social Media</option>
                      <option value="branding">Logos & Branding</option>
                      <option value="flyer">Flyer</option>
                      <option value="poster">Poster</option>
                      <option value="banner">Website Banner</option>
                      <option value="video">Video Reel</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Media Type
                    </label>
                    <select
                      value={newMediaType}
                      onChange={(e) => setNewMediaType(e.target.value as any)}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                    >
                      <option value="image">Image (PNG / JPG)</option>
                      <option value="video">Video (MP4 / Reel)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Aspect Ratio
                    </label>
                    <select
                      value={newAspectRatio}
                      onChange={(e) => setNewAspectRatio(e.target.value as any)}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                    >
                      <option value="1:1">1:1 Square</option>
                      <option value="16:9">16:9 Landscape</option>
                      <option value="9:16">9:16 Vertical Reel</option>
                      <option value="3:4">3:4 Portrait Poster</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Media URL / Asset Path *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="/assets/aistudio/... or https://..."
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Branding, Luxury, Canva, 4K"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Description & Scope
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Detailed creative brief, typography choices, and client outcomes..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingProject}
                className="w-full rounded-xl bg-amber-400 py-3 text-xs font-bold text-neutral-950 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20 disabled:opacity-50"
              >
                {submittingProject ? 'Publishing to Database...' : 'Save & Publish to Portfolio'}
              </button>
            </form>
          )}

          {/* TAB 3: AUTH & CLOUD SEEDING */}
          {activeTab === 'auth' && (
            <div className="space-y-6">
              {/* Cloud Firestore Push Tool */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold text-white flex items-center gap-2">
                      <UploadCloud className="h-4 w-4 text-amber-400" />
                      Firestore Data Sync & Seed
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      Push all 21 creative works (6 video reels + 15 design graphics) and testimonials directly into Firebase Cloud Firestore.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 space-y-1 font-mono">
                  <div>Project ID: <span className="text-amber-300">planning-with-ai-e65df</span></div>
                  <div>Database ID: <span className="text-amber-300">ai-studio-munazzairfanport-11e7cd67-bba5-4278-9191-897f0c61797a</span></div>
                </div>

                {seedResult && (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{seedResult}</span>
                  </div>
                )}

                <button
                  onClick={handleSeedDatabase}
                  disabled={seeding}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-neutral-800 border border-neutral-700 py-2.5 text-xs font-semibold text-white hover:bg-neutral-700 transition-colors disabled:opacity-50"
                >
                  <UploadCloud className="h-4 w-4 text-amber-400" />
                  {seeding ? 'Syncing with Firestore...' : 'Push / Sync All Data to Firestore'}
                </button>
              </div>

              {/* Email / Password Auth System */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold text-white flex items-center gap-2">
                      <Lock className="h-4 w-4 text-amber-400" />
                      Firebase Email & Password Authentication
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      {user
                        ? 'You are currently authenticated as an administrator.'
                        : 'Sign in or register an admin account to manage leads and content securely.'}
                    </p>
                  </div>
                </div>

                {authSuccess && (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{authSuccess}</span>
                  </div>
                )}

                {authError && (
                  <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                    <span>{authError}</span>
                  </div>
                )}

                {user ? (
                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-400">Current User:</span>
                      <strong className="text-white font-mono">{user.email}</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-400">UID:</span>
                      <code className="text-neutral-500 text-[10px]">{user.uid}</code>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full mt-2 rounded-xl border border-neutral-700 bg-neutral-800 py-2 text-xs font-semibold text-rose-400 hover:bg-neutral-700 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleAuthSubmit} className="space-y-3">
                    <div className="flex rounded-xl bg-neutral-900 p-1 border border-neutral-800 text-xs">
                      <button
                        type="button"
                        onClick={() => setAuthMode('signin')}
                        className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
                          authMode === 'signin'
                            ? 'bg-amber-400 text-neutral-950'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthMode('signup')}
                        className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
                          authMode === 'signup'
                            ? 'bg-amber-400 text-neutral-950'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Create Admin Account
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Admin Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="munazza.00077@gmail.com or admin@..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Password (min 6 characters) *
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-neutral-950 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20 disabled:opacity-50"
                    >
                      {authLoading
                        ? 'Authenticating...'
                        : authMode === 'signin'
                        ? 'Sign In with Email & Password'
                        : 'Create Admin Account'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
