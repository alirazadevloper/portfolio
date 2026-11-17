import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VideoReelsSection } from './components/VideoReelsSection';
import { PortfolioGrid } from './components/PortfolioGrid';
import { ResumeSection } from './components/ResumeSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectLightbox } from './components/ProjectLightbox';
import { AdminPortal } from './components/AdminPortal';
import { Project, Inquiry, Testimonial, SkillItem, PortfolioStats } from './types';
import {
  db,
  auth,
  testConnection,
  seedFirestoreDatabase,
  handleFirestoreError,
  OperationType,
  onAuthStateChanged,
  User,
  SEED_PROJECTS,
  SEED_SKILLS,
  SEED_TESTIMONIALS,
} from './lib/firebase';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  increment,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import {
  calculatePortfolioStats,
  getDefaultSkillIcon,
  normalizeSkillInput,
} from './utils/portfolio-logic';

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() =>
    SEED_PROJECTS.map((p) => ({ id: p.slug, ...p } as Project))
  );
  const [skills, setSkills] = useState<SkillItem[]>(() =>
    SEED_SKILLS.map((s, index) => ({ id: `seed-${index}`, ...s } as SkillItem))
  );
  const [stats, setStats] = useState<PortfolioStats | null>(() => {
    const computed = calculatePortfolioStats(SEED_PROJECTS as any);
    return {
      totalProjects: computed.total,
      videoReels: computed.videos,
      graphicDesigns: computed.graphics,
      totalLikes: computed.totalLikes,
      totalViews: computed.totalViews,
      totalInquiries: 0,
    };
  });
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() =>
    SEED_TESTIMONIALS.map((t, index) => ({ id: `seed-test-${index}`, ...t } as Testimonial))
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);

  const [likedIds, setLikedIds] = useState<Set<string | number>>(() => {
    try {
      const saved = localStorage.getItem('munazza_portfolio_likes');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Track Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  const fetchAllData = async () => {
    // 1. Connection check
    testConnection().catch(console.warn);

    // 2. Fetch Projects from Firestore (fallback gracefully without unauthenticated writes)
    try {
      const projectsCol = collection(db, 'projects');
      const snap = await getDocs(projectsCol);

      if (!snap.empty) {
        const firestoreProjects = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Project[];
        firestoreProjects.sort(
          (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (a.sort_order || 99) - (b.sort_order || 99)
        );
        setProjects(firestoreProjects);
      } else {
        if (auth.currentUser) {
          await seedFirestoreDatabase().catch(() => {});
          const seededSnap = await getDocs(projectsCol);
          if (!seededSnap.empty) {
            setProjects(
              seededSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Project[]
            );
            return;
          }
        }
        const res = await fetch('/api/projects');
        if (res.ok) {
          const apiProjects = await res.json();
          if (Array.isArray(apiProjects) && apiProjects.length > 0) setProjects(apiProjects);
        }
      }
    } catch (err) {
      console.warn('Falling back to local projects API:', err);
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const apiProjects = await res.json();
          if (Array.isArray(apiProjects) && apiProjects.length > 0) setProjects(apiProjects);
        }
      } catch (e) {
        console.error(e);
      }
    }

    // 3. Fetch Skills from Firestore
    try {
      const skillsCol = collection(db, 'skills');
      const skillsSnap = await getDocs(skillsCol);
      if (!skillsSnap.empty) {
        const sList = skillsSnap.docs.map((d) => {
          const raw = d.data() as Omit<SkillItem, 'id'>;
          const seedMatch = SEED_SKILLS.find(
            (seed) => seed.name.toLowerCase() === String(raw.name || '').toLowerCase()
          );
          return {
            id: d.id,
            ...raw,
            icon: raw.icon || seedMatch?.icon || getDefaultSkillIcon(raw.category || 'design'),
            details: raw.details ?? seedMatch?.details ?? '',
          } as SkillItem;
        });
        sList.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        setSkills(sList);
      } else {
        // Fallback to default skills
        const fallbackSkills: SkillItem[] = SEED_SKILLS.map((s, index) => ({
          id: `seed-${index}`,
          ...s,
        } as SkillItem));
        setSkills(fallbackSkills);
      }
    } catch (err) {
      const fallbackSkills: SkillItem[] = SEED_SKILLS.map((s, index) => ({
        id: `seed-${index}`,
        ...s,
      } as SkillItem));
      setSkills(fallbackSkills);
    }

    // 4. Fetch Testimonials from Firestore
    try {
      const testCol = collection(db, 'testimonials');
      const testSnap = await getDocs(testCol);
      if (!testSnap.empty) {
        const tList = testSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Testimonial[];
        setTestimonials(tList);
      } else {
        const res = await fetch('/api/testimonials');
        if (res.ok) setTestimonials(await res.json());
      }
    } catch (err) {
      fetch('/api/testimonials')
        .then((r) => r.json())
        .then((data) => setTestimonials(data))
        .catch(console.error);
    }

    // 5. Fetch Inquiries from Firestore (or local API)
    try {
      const inqCol = collection(db, 'inquiries');
      const inqSnap = await getDocs(inqCol);
      if (!inqSnap.empty) {
        const inqList = inqSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Inquiry[];
        inqList.sort(
          (a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        );
        setInquiries(inqList);
      } else {
        const res = await fetch('/api/inquiries');
        if (res.ok) setInquiries(await res.json());
      }
    } catch (err) {
      fetch('/api/inquiries')
        .then((r) => r.json())
        .then((data) => setInquiries(data))
        .catch(console.error);
    }

    // 6. Fetch / Calculate Stats
    try {
      const statsRes = await fetch('/api/stats');
      if (statsRes.ok) {
        setStats(await statsRes.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Update aggregated stats dynamically
  useEffect(() => {
    if (projects.length > 0) {
      const computed = calculatePortfolioStats(projects as any);
      setStats({
        totalProjects: computed.total,
        videoReels: computed.videos,
        graphicDesigns: computed.graphics,
        totalLikes: computed.totalLikes,
        totalViews: computed.totalViews,
        totalInquiries: inquiries.length,
      });
    }
  }, [projects, inquiries.length]);

  // Visitor Like Action
  const handleLike = async (id: string | number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Optimistic UI update
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes_count: (p.likes_count || 0) + 1 } : p))
    );
    if (selectedProject && selectedProject.id === id) {
      setSelectedProject((prev) => (prev ? { ...prev, likes_count: (prev.likes_count || 0) + 1 } : null));
    }

    const nextLiked = new Set(likedIds);
    nextLiked.add(id);
    setLikedIds(nextLiked);
    try {
      localStorage.setItem('munazza_portfolio_likes', JSON.stringify(Array.from(nextLiked)));
    } catch {}

    // Persist to Firestore
    try {
      const docRef = doc(db, 'projects', String(id));
      await updateDoc(docRef, { likes_count: increment(1) });
    } catch (err) {
      fetch(`/api/projects/${id}/like`, { method: 'POST' }).catch(console.error);
    }
  };

  // Visitor Comment Action
  const handleAddComment = async (
    projectId: string | number,
    authorName: string,
    comment: string,
    rating: number
  ) => {
    try {
      const commentsCol = collection(db, 'projects', String(projectId), 'comments');
      await addDoc(commentsCol, {
        authorName,
        comment,
        rating,
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore comment error:', err);
    }

    fetch(`/api/projects/${projectId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author_name: authorName, comment, rating }),
    }).catch(console.error);
  };

  // Visitor Contact Inquiry Submission
  const handleSubmitInquiry = async (data: any): Promise<boolean> => {
    let success = false;
    const inquiryPayload = {
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      service: data.service,
      budget: data.budget || '',
      timeline: data.timeline || '',
      message: data.message,
      status: 'new',
      created_at: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, 'inquiries'), inquiryPayload);
      setInquiries((prev) => [{ id: docRef.id, ...inquiryPayload } as Inquiry, ...prev]);
      success = true;
    } catch (err) {
      console.warn('Firestore inquiry creation error:', err);
    }

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result = await res.json();
        if (result.inquiry) {
          setInquiries((prev) => {
            if (prev.some((i) => i.email === data.email && i.message === data.message)) return prev;
            return [result.inquiry, ...prev];
          });
        }
        success = true;
      }
    } catch (e) {
      console.error(e);
    }

    return success;
  };

  // ADMIN ACTIONS: Inquiries
  const handleUpdateInquiryStatus = async (id: string | number, status: string) => {
    try {
      await updateDoc(doc(db, 'inquiries', String(id)), { status });
    } catch (err) {
      console.warn(err);
    }
    fetch(`/api/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(console.error);

    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status: status as any } : inq))
    );
  };

  const handleDeleteInquiry = async (id: string | number) => {
    try {
      await deleteDoc(doc(db, 'inquiries', String(id)));
    } catch (err) {
      console.warn(err);
    }
    fetch(`/api/inquiries/${id}`, { method: 'DELETE' }).catch(console.error);
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));
  };

  // ADMIN ACTIONS: Projects
  const handleAddProject = async (projectData: any) => {
    const slug = (projectData.title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    const newProj = {
      ...projectData,
      slug,
      likes_count: 0,
      views_count: 0,
      featured: Boolean(projectData.featured),
      sort_order: Number(projectData.sort_order) || 99,
      created_at: new Date().toISOString(),
    };

    try {
      const docRef = doc(collection(db, 'projects'), slug);
      await setDoc(docRef, newProj);
      setProjects((prev) => [{ id: slug, ...newProj }, ...prev]);
    } catch (err) {
      console.warn('Firestore add project error:', err);
    }

    fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    }).catch(console.error);
  };

  const handleUpdateProject = async (id: string | number, updatedData: any) => {
    try {
      await updateDoc(doc(db, 'projects', String(id)), updatedData);
    } catch (err) {
      console.warn('Firestore update project error:', err);
    }

    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
    );
  };

  const handleDeleteProject = async (id: string | number) => {
    try {
      await deleteDoc(doc(db, 'projects', String(id)));
    } catch (err) {
      console.warn('Firestore delete project error:', err);
    }
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // ADMIN ACTIONS: Skills
  const handleAddSkill = async (skillData: Omit<SkillItem, 'id'>) => {
    const normalized = normalizeSkillInput(skillData);
    if (!normalized.valid) {
      throw new Error(normalized.errors[0]?.message || 'Invalid skill data');
    }
    const docId = normalized.data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    const newSkill = {
      ...normalized.data,
      sort_order: skills.length + 1,
      created_at: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'skills', docId), newSkill);
      setSkills((prev) => [...prev, { id: docId, ...newSkill }]);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `skills/${docId}`);
    }
  };

  const handleUpdateSkill = async (id: string | number, updatedSkill: Partial<SkillItem>) => {
    const existing = skills.find((s) => s.id === id);
    const merged = normalizeSkillInput({
      name: updatedSkill.name ?? existing?.name ?? '',
      category: updatedSkill.category ?? existing?.category ?? 'design',
      proficiency: updatedSkill.proficiency ?? existing?.proficiency ?? 85,
      focus: updatedSkill.focus ?? existing?.focus ?? '',
      icon: updatedSkill.icon ?? existing?.icon,
      details: updatedSkill.details ?? existing?.details ?? '',
    });
    if (!merged.valid) {
      throw new Error(merged.errors[0]?.message || 'Invalid skill data');
    }

    try {
      await updateDoc(doc(db, 'skills', String(id)), merged.data);
      setSkills((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...merged.data } : s))
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `skills/${String(id)}`);
    }
  };

  const handleDeleteSkill = async (id: string | number) => {
    try {
      await deleteDoc(doc(db, 'skills', String(id)));
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `skills/${String(id)}`);
    }
  };

  // ADMIN ACTIONS: Testimonials
  const handleAddTestimonial = async (tData: Omit<Testimonial, 'id'>) => {
    const newTestimonial = {
      ...tData,
      created_at: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, 'testimonials'), newTestimonial);
      setTestimonials((prev) => [{ id: docRef.id, ...newTestimonial }, ...prev]);
    } catch (err) {
      console.warn('Firestore testimonial error:', err);
    }

    fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tData),
    }).catch(console.error);
  };

  const handleDeleteTestimonial = async (id: string | number) => {
    try {
      await deleteDoc(doc(db, 'testimonials', String(id)));
    } catch (err) {
      console.warn('Firestore delete testimonial error:', err);
    }
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  const videoReels = projects.filter((p) => p.media_type === 'video');

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToResume = () => {
    const el = document.getElementById('resume');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181716] flex flex-col">
      {/* Top Bar */}
      <Navbar
        onOpenAdmin={() => setIsAdminPortalOpen(true)}
        inquiryCount={inquiries.filter((i) => i.status === 'new').length}
      />

      <main className="flex-1">
        {/* Split Designer Hero Section */}
        <Hero
          stats={stats}
          projects={projects}
          onSelectProject={(project) => setSelectedProject(project)}
          onViewCV={scrollToResume}
        />

        {/* Design & Branding Portfolio Grid */}
        <PortfolioGrid
          projects={projects}
          onSelectProject={(project) => setSelectedProject(project)}
          onLikeProject={handleLike}
          likedIds={likedIds}
        />

        {/* Video Reels Section */}
        {videoReels.length > 0 && (
          <VideoReelsSection
            reels={videoReels}
            onLike={handleLike}
            likedIds={likedIds}
          />
        )}

        {/* Resume, Skills & Education (Powered by dynamic skills from Firestore) */}
        <ResumeSection onOpenInquiry={scrollToContact} skills={skills} />

        {/* Client Endorsements & Recommendations */}
        <TestimonialsSection
          testimonials={testimonials}
          onAddTestimonial={async (author, role, company, quote, rating) => {
            await handleAddTestimonial({ author, role, company, quote, rating });
          }}
        />

        {/* Contact & Database Inquiry Form */}
        <ContactSection
          onSubmitInquiry={handleSubmitInquiry}
          onOpenAdmin={() => setIsAdminPortalOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminPortalOpen(true)} />

      {/* Lightbox / Project Details Modal */}
      <ProjectLightbox
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onLike={handleLike}
        isLiked={selectedProject ? likedIds.has(selectedProject.id) : false}
        onAddComment={handleAddComment}
      />

      {/* Strict Role-Based Admin Portal with 6 Dedicated Screens */}
      <AdminPortal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
        projects={projects}
        inquiries={inquiries}
        testimonials={testimonials}
        skills={skills}
        stats={stats}
        onRefreshData={fetchAllData}
        onAddProject={handleAddProject}
        onUpdateProject={handleUpdateProject}
        onDeleteProject={handleDeleteProject}
        onUpdateInquiryStatus={handleUpdateInquiryStatus}
        onDeleteInquiry={handleDeleteInquiry}
        onAddSkill={handleAddSkill}
        onUpdateSkill={handleUpdateSkill}
        onDeleteSkill={handleDeleteSkill}
        onAddTestimonial={handleAddTestimonial}
        onDeleteTestimonial={handleDeleteTestimonial}
      />
    </div>
  );
}
