import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateEmail,
  updatePassword,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Project, Inquiry, Testimonial } from '../types';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId if configured
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Error handling types matching Firebase Skill specification
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initial Connection Test per Skill Requirement
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or network is warming up.');
    }
    return false;
  }
}

// Initial Seed Dataset for Munazza Irfan Portfolio
export const SEED_PROJECTS: Omit<Project, 'id'>[] = [
  // 6 Video Reels
  {
    slug: 'capital-smart-city-1-kanal-villas',
    title: 'Capital Smart City 1-Kanal Luxury Villas Reel',
    category: 'video',
    media_type: 'video',
    media_url: '/assets/aistudio/1_Kanal_Residential_Plot___Housing_Development_bea26688.mp4',
    client_or_brand: 'Capital Smart City Islamabad',
    description:
      'High-energy vertical drone reel featuring Sector B Overseas East villas with kinetic typography, modern audio sync, and architectural cinematography.',
    tags: ['Drone Reel', 'Real Estate', 'Kinetic Typography', 'Premiere Pro', '4K Drone'],
    aspect_ratio: '9:16',
    likes_count: 52,
    views_count: 740,
    featured: true,
    sort_order: 1,
  },
  {
    slug: 'eastern-housing-structural-construction',
    title: 'Structural Foundation & Machinery Action Reel',
    category: 'video',
    media_type: 'video',
    media_url: '/assets/aistudio/Building_Foundation___Structural_Construction_a1ca3da9.mp4',
    client_or_brand: 'Eastern Housing Lahore',
    description:
      'Industrial pacing montage highlighting steel cutting, crane lifts, and worker dedication with punchy percussion audio and cinematic color grading.',
    tags: ['Industrial', 'Action Cuts', 'Sound Design', 'Commercial Reel'],
    aspect_ratio: '9:16',
    likes_count: 44,
    views_count: 610,
    featured: true,
    sort_order: 2,
  },
  {
    slug: 'educational-engineering-mathematics',
    title: 'The Philosophy of Mathematics & Thinking Reel',
    category: 'video',
    media_type: 'video',
    media_url: '/assets/aistudio/Educational-Engineering_6a9cf9c0.mp4',
    client_or_brand: 'Educational Engineering',
    description:
      'Thought-provoking educational short reel combining Urdu subtitles, Einstein quotes, neural network animations, and b-roll transitions.',
    tags: ['Educational', 'Urdu Typography', 'Subtitles', 'Motion Graphics'],
    aspect_ratio: '9:16',
    likes_count: 78,
    views_count: 980,
    featured: true,
    sort_order: 3,
  },
  {
    slug: 'study-trick-brain-alert-mode',
    title: 'Study Trick Ep-42: Brain Focus & Memory Hack',
    category: 'video',
    media_type: 'video',
    media_url: '/assets/aistudio/Learning_tricks_d3944f13.mp4',
    client_or_brand: 'The Aspirex',
    description:
      'Viral high-retention educational reel using dark anime aesthetics, countdown graphics, step-by-step Urdu voiceover, and pacing.',
    tags: ['Viral Short', 'Voiceover Timing', 'Anime Graphics', 'Study Hack'],
    aspect_ratio: '9:16',
    likes_count: 112,
    views_count: 1420,
    featured: true,
    sort_order: 4,
  },
  {
    slug: 'eastern-housing-corporate-construction',
    title: 'Eastern Housing Corporate Progress & Quality Reel',
    category: 'video',
    media_type: 'video',
    media_url: '/assets/aistudio/On-Site_Building_Construction_Progress_9f6d1756.mp4',
    client_or_brand: 'Eastern Housing Lahore',
    description:
      'Full narrative commercial reel highlighting QA engineering team inspection, resident testimonials, and brand identity animations.',
    tags: ['Corporate Film', 'Urdu Voiceover', 'Resident Testimonial', 'Drone'],
    aspect_ratio: '9:16',
    likes_count: 63,
    views_count: 890,
    featured: false,
    sort_order: 5,
  },
  {
    slug: 'capital-smart-city-split-screen',
    title: 'Capital Smart City 3-Split Architectural Reel',
    category: 'video',
    media_type: 'video',
    media_url: '/assets/aistudio/Real_Estate_Showcase_1dc50f40.mp4',
    client_or_brand: 'Capital Smart City',
    description:
      'Multi-layer 3-way split screen visual showcasing Lake View Heights, Linear Park, and Sports Complex in synchronized harmony.',
    tags: ['Split Screen', 'Creative Layout', 'Real Estate', 'Branding'],
    aspect_ratio: '9:16',
    likes_count: 85,
    views_count: 1100,
    featured: true,
    sort_order: 6,
  },

  // 15 Graphic Design Works
  {
    slug: 'burger-lab-instagram-post',
    title: 'Burger Lab 30% Off Social Media Campaign',
    category: 'social',
    media_type: 'image',
    media_url: '/assets/aistudio/Burger_Food_Instagram_Post_f75f9144.png',
    client_or_brand: 'Burger Lab',
    description:
      'Mouthwatering commercial social media post with dynamic curved framing, floating tomatoes, layered typography, and high-conversion call to action.',
    tags: ['Social Media', 'Food Design', 'Canva', 'Photoshop', 'Instagram'],
    aspect_ratio: '1:1',
    likes_count: 69,
    views_count: 810,
    featured: true,
    sort_order: 7,
  },
  {
    slug: 'munazza-irfan-luxury-business-card',
    title: 'Executive Head Manager Black Silk Card',
    category: 'branding',
    media_type: 'image',
    media_url: '/assets/aistudio/Business_Card__2__40af2b3d.png',
    client_or_brand: 'Munazza Irfan Portfolio',
    description:
      'Luxury corporate business card concept designed for executive positioning with metallic gold typography on pure black folded silk texture.',
    tags: ['Business Card', 'Luxury Gold', 'Silk Texture', 'Corporate Identity'],
    aspect_ratio: '16:9',
    likes_count: 95,
    views_count: 1180,
    featured: true,
    sort_order: 8,
  },
  {
    slug: 'juniper-street-cafe-business-card',
    title: 'Juniper Street Café Botanical Stationery',
    category: 'branding',
    media_type: 'image',
    media_url: '/assets/aistudio/Business_Card_a1f870ac.jpg',
    client_or_brand: 'Juniper Street Café',
    description:
      'Organic cafe identity stationery card mockup pairing terracotta warmth with deep eucalyptus green botanical illustrations.',
    tags: ['Cafe Branding', 'Botanical', 'Stationery Mockup', 'Earth Tones'],
    aspect_ratio: '1:1',
    likes_count: 51,
    views_count: 640,
    featured: false,
    sort_order: 9,
  },
  {
    slug: 'helping-businesses-work-smarter-card',
    title: 'Helping Businesses Work Smarter Brand Identity',
    category: 'branding',
    media_type: 'image',
    media_url: '/assets/aistudio/Business_card_b53b857b.png',
    client_or_brand: 'Munazza Irfan',
    description:
      'Sophisticated brand card featuring custom gold geometric mandala mark and client-focused brand motto on dark satin.',
    tags: ['Brand Identity', 'Gold Emblem', 'Luxury Fabric', 'Minimalist'],
    aspect_ratio: '16:9',
    likes_count: 73,
    views_count: 890,
    featured: true,
    sort_order: 10,
  },
  {
    slug: 'digital-marketing-agency-flyer',
    title: 'Digital Marketing Agency Tri-Fold Flyer',
    category: 'flyer',
    media_type: 'image',
    media_url: '/assets/aistudio/Flyer_b12b5985.jpg',
    client_or_brand: 'Digital Marketing Agency',
    description:
      'Clean modern corporate marketing flyer featuring canary yellow swooshes, structured business concept sections, and vector iconography.',
    tags: ['Flyer', 'Corporate Marketing', 'Print Design', 'Infographic'],
    aspect_ratio: '3:4',
    likes_count: 58,
    views_count: 720,
    featured: false,
    sort_order: 11,
  },
  {
    slug: 'pizza-house-grand-opening-flyer',
    title: 'Pizza House Pallandri Grand Opening Flyer',
    category: 'flyer',
    media_type: 'image',
    media_url: '/assets/aistudio/Flyer_9744df9f.png',
    client_or_brand: 'Pizza House Pallandri',
    description:
      'Vibrant local community announcement flyer highlighting menu specials, 30% discount promotion, and location details in Pallandri.',
    tags: ['Local Business', 'Restaurant Flyer', 'Grand Opening', 'Discount Promo'],
    aspect_ratio: '1:1',
    likes_count: 42,
    views_count: 530,
    featured: false,
    sort_order: 12,
  },
  {
    slug: 'boutique-vintage-crest-logo',
    title: 'A Boutique Vintage Fashion Filigree Crest',
    category: 'branding',
    media_type: 'image',
    media_url: '/assets/aistudio/Logo__2__63103627.jpg',
    client_or_brand: 'A Boutique Vintage',
    description:
      'Victorian baroque-inspired emblem monogram with ornamental scrollwork for luxury vintage apparel and fashion accessories.',
    tags: ['Logo Design', 'Vintage Monogram', 'Luxury Brand', 'Ornate Crest'],
    aspect_ratio: '1:1',
    likes_count: 76,
    views_count: 940,
    featured: true,
    sort_order: 13,
  },
  {
    slug: 'anna-fashion-store-logo',
    title: 'Anna Fashion Store Botanical Circle Logo',
    category: 'branding',
    media_type: 'image',
    media_url: '/assets/aistudio/Logo_12077448.jpg',
    client_or_brand: 'Anna Fashion Store',
    description:
      'Earthy minimalist fashion boutique mark using serif typography and subtle hand-drawn olive branch flourishes.',
    tags: ['Logo Design', 'Fashion Brand', 'Botanical Line Art', 'Earth Tones'],
    aspect_ratio: '1:1',
    likes_count: 64,
    views_count: 780,
    featured: false,
    sort_order: 14,
  },
  {
    slug: 'building-construction-architectural-logo',
    title: 'Building Construction Modern Skyline Logo',
    category: 'branding',
    media_type: 'image',
    media_url: '/assets/aistudio/Logo_5a797adc.png',
    client_or_brand: 'Building Construction Co.',
    description:
      'Geometric corporate identity mark featuring bold cobalt and steel grey skyscraper towers and drafted angle lines.',
    tags: ['Logo Design', 'Construction', 'Architecture', 'Corporate'],
    aspect_ratio: '1:1',
    likes_count: 50,
    views_count: 610,
    featured: false,
    sort_order: 15,
  },
  {
    slug: 'pizza-shop-slice-emblem-logo',
    title: 'Pizza Shop Bold Mascot Emblem',
    category: 'branding',
    media_type: 'image',
    media_url: '/assets/aistudio/Pizza_Logo_4039f311.png',
    client_or_brand: 'Pizza Shop',
    description:
      'High-contrast red and golden yellow graphic pizza slice logo with bold serif title badge for casual dining.',
    tags: ['Logo Design', 'Vector Illustration', 'Food Brand', 'Color Blocking'],
    aspect_ratio: '1:1',
    likes_count: 40,
    views_count: 480,
    featured: false,
    sort_order: 16,
  },
  {
    slug: 'mega-fashion-sale-poster',
    title: 'Mega Fashion Sale Upto 50% Off Poster',
    category: 'poster',
    media_type: 'image',
    media_url: '/assets/aistudio/Poster_867920d9.png',
    client_or_brand: 'Mega Fashion Store',
    description:
      'High-fashion editorial retail campaign poster featuring model photography framed by vibrant gradient sunburst bars on dark canvas.',
    tags: ['Fashion Poster', 'Retail Promo', 'Commercial', 'Canva Pro'],
    aspect_ratio: '1:1',
    likes_count: 81,
    views_count: 1040,
    featured: true,
    sort_order: 17,
  },
  {
    slug: 'globex-solutions-corporate-banner',
    title: 'Globex Solutions Future Tech Web Banner',
    category: 'banner',
    media_type: 'image',
    media_url: '/assets/aistudio/Website_Banner_53c790d7.png',
    client_or_brand: 'Globex Solutions',
    description:
      'Full-width digital web banner highlighting holographic smart city interfaces, corporate strategy badges, and vibrant cobalt waves.',
    tags: ['Website Banner', 'Holographic', 'Corporate Tech', 'Digital Marketing'],
    aspect_ratio: '16:9',
    likes_count: 67,
    views_count: 860,
    featured: true,
    sort_order: 18,
  },
  {
    slug: 'al-jannat-summer-lawn-promo',
    title: 'Al-Jannat Summer Lawn 30% Off Social Post',
    category: 'social',
    media_type: 'image',
    media_url: '/assets/aistudio/Social_Media_Post_67ffe2bd.png',
    client_or_brand: 'Al-Jannat Collection',
    description:
      'Refined Pakistani summer lawn fashion collection post featuring pastel floral photography, bold price badge, and boutique styling.',
    tags: ['Social Media', 'Pakistani Fashion', 'Summer Lawn', 'Instagram Banner'],
    aspect_ratio: '1:1',
    likes_count: 62,
    views_count: 770,
    featured: false,
    sort_order: 19,
  },
  {
    slug: 'super-delicious-food-burger-poster',
    title: 'Super Delicious Food Menu Burger Poster',
    category: 'poster',
    media_type: 'image',
    media_url: '/assets/aistudio/Burger_Poster_268dceeb.png',
    client_or_brand: 'Burger Junction',
    description:
      'Eye-catching split-backdrop food poster with realistic wood grain picnic table and speech bubble discount badges.',
    tags: ['Food Poster', 'Photoshop Composite', 'Retail', 'Fast Food'],
    aspect_ratio: '1:1',
    likes_count: 55,
    views_count: 680,
    featured: false,
    sort_order: 20,
  },
  {
    slug: 'codemind-university-admission-poster',
    title: 'CodeMind University Open Admission Poster',
    category: 'poster',
    media_type: 'image',
    media_url: '/assets/aistudio/Admissions_University_Poster_a1db8ec5.png',
    client_or_brand: 'CodeMind University',
    description:
      'Professional academic admissions campaign poster featuring student photography, rounded violet glass card, and clean contact credentials.',
    tags: ['University Poster', 'Admissions', 'Academic Branding', 'Print Ready'],
    aspect_ratio: '3:4',
    likes_count: 91,
    views_count: 1190,
    featured: true,
    sort_order: 21,
  },
];

export const SEED_TESTIMONIALS: Omit<Testimonial, 'id'>[] = [
  {
    author: 'Khurram Shahzad',
    role: 'Marketing Lead',
    company: 'Eastern Housing Lahore',
    quote:
      'Munazza has a strong eye for video pacing and construction footage. Her reels captured our site development with impressive rhythm and clarity.',
    rating: 5,
  },
  {
    author: 'Taimoor Ahmed',
    role: 'Operations Director',
    company: 'Globex Solutions',
    quote:
      'Outstanding work on our corporate banners and MS Office presentations. Extremely punctual, detail-oriented, and receptive to feedback.',
    rating: 5,
  },
  {
    author: 'Zainab Malik',
    role: 'Brand Owner',
    company: 'Al-Jannat Collection',
    quote:
      'Her social media posts and summer lawn graphics helped elevate our online engagement. Highly recommended for creative design.',
    rating: 5,
  },
];

export const SEED_SKILLS = [
  {
    name: 'Canva Pro',
    category: 'design' as const,
    proficiency: 95,
    focus: 'Social Media & Banners',
    icon: 'palette',
    details:
      'Creates cohesive brand kits, Instagram carousels, retail sale posters, business stationery, and web hero banners with balanced typography and feminine/luxury aesthetics.',
    sort_order: 1,
  },
  {
    name: 'Adobe Photoshop',
    category: 'design' as const,
    proficiency: 85,
    focus: 'Photo Composites & Flyers',
    icon: 'layers',
    details:
      'Skilled in background removal, realistic shadow blending, commercial food/fashion poster retouching, tri-fold print flyers, and color-graded product mockups.',
    sort_order: 2,
  },
  {
    name: 'Adobe Premiere Pro',
    category: 'video' as const,
    proficiency: 90,
    focus: 'Reels Pacing & Beat Sync',
    icon: 'film',
    details:
      'Edits vertical 9:16 real estate drone reels, corporate progress films, multi-split screen layouts, smooth speed-ramping, and clean audio mixing.',
    sort_order: 3,
  },
  {
    name: 'CapCut Studio',
    category: 'video' as const,
    proficiency: 92,
    focus: 'Viral Hooks & Urdu Captions',
    icon: 'scissors',
    details:
      'Specializes in high-retention short-form pacing, bilingual Urdu/English animated subtitles, rhythmic sound FX, and engaging visual hooks for TikTok & Reels.',
    sort_order: 4,
  },
  {
    name: 'MS Word',
    category: 'office' as const,
    proficiency: 95,
    focus: 'Contracts & Documentation',
    icon: 'file-text',
    details:
      'Prepares formal business letters, structured academic reports, formatted office contracts, CV layouts, and proofread administrative documentation.',
    sort_order: 5,
  },
  {
    name: 'MS Excel',
    category: 'office' as const,
    proficiency: 90,
    focus: 'Data Entry, Formulas & Tracking',
    icon: 'table',
    details:
      'Manages accurate data entry spreadsheets, inventory logs, attendance trackers, automated formulas, conditional formatting, and summary charts.',
    sort_order: 6,
  },
  {
    name: 'MS PowerPoint',
    category: 'office' as const,
    proficiency: 92,
    focus: 'Pitch Decks & Presentations',
    icon: 'presentation',
    details:
      'Designs clean corporate slide decks, academic visual briefings, animated transitions, and executive reports tailored for meetings and client pitches.',
    sort_order: 7,
  },
  {
    name: 'Windows OS & Hardware',
    category: 'it' as const,
    proficiency: 90,
    focus: 'Setup, Troubleshooting & Drivers',
    icon: 'monitor',
    details:
      'Handles clean Windows installation, essential driver and software setup, printer/peripherals configuration, basic troubleshooting, and AI productivity workflows.',
    sort_order: 8,
  },
];

// Helper to verify if an authenticated user has the 'admin' role
export async function checkIsUserAdmin(user: User | null): Promise<boolean> {
  if (!user || !user.email) return false;
  const normalizedEmail = user.email.toLowerCase().trim();
  const designatedAdmins = ['aliraza1122alikhan@gmail.com', 'munazza.00077@gmail.com'];
  if (designatedAdmins.includes(normalizedEmail)) {
    return true;
  }
  try {
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    if (adminDoc.exists()) {
      const data = adminDoc.data();
      if (data && data.role === 'admin') return true;
    }
  } catch (e) {
    console.warn('Could not read admin doc:', e);
  }
  return false;
}

// Ensure an authorized admin is recorded in the admins collection
export async function ensureAdminRecord(uid: string, email: string): Promise<void> {
  try {
    await setDoc(
      doc(db, 'admins', uid),
      {
        email,
        role: 'admin',
        updated_at: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (e) {
    console.warn('Could not write admin record:', e);
  }
}

// Helper to push all seeded dataset to Firestore
export async function seedFirestoreDatabase(): Promise<{
  projectsCount: number;
  testimonialsCount: number;
  skillsCount: number;
}> {
  let projectsCount = 0;
  let testimonialsCount = 0;
  let skillsCount = 0;

  try {
    const projectsColl = collection(db, 'projects');
    const existingProjectsSnap = await getDocs(projectsColl);

    if (existingProjectsSnap.empty) {
      for (const p of SEED_PROJECTS) {
        const docRef = doc(projectsColl, p.slug);
        await setDoc(docRef, {
          ...p,
          created_at: new Date().toISOString(),
        });
        projectsCount++;
      }
    } else {
      projectsCount = existingProjectsSnap.size;
    }

    const testimonialsColl = collection(db, 'testimonials');
    const existingTestimonialsSnap = await getDocs(testimonialsColl);

    if (existingTestimonialsSnap.empty) {
      for (const t of SEED_TESTIMONIALS) {
        await addDoc(testimonialsColl, {
          ...t,
          created_at: new Date().toISOString(),
        });
        testimonialsCount++;
      }
    } else {
      testimonialsCount = existingTestimonialsSnap.size;
    }

    const skillsColl = collection(db, 'skills');
    const existingSkillsSnap = await getDocs(skillsColl);

    if (existingSkillsSnap.empty) {
      for (const s of SEED_SKILLS) {
        const docId = s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        await setDoc(doc(skillsColl, docId), {
          ...s,
          created_at: new Date().toISOString(),
        });
        skillsCount++;
      }
    } else {
      for (const existingDoc of existingSkillsSnap.docs) {
        const data = existingDoc.data();
        const seedMatch = SEED_SKILLS.find(
          (s) => s.name.toLowerCase() === String(data.name || '').toLowerCase()
        );
        if (seedMatch && (!data.icon || !data.details)) {
          await setDoc(
            doc(skillsColl, existingDoc.id),
            {
              icon: data.icon || seedMatch.icon,
              details: data.details || seedMatch.details,
            },
            { merge: true }
          );
        }
      }
      skillsCount = existingSkillsSnap.size;
    }

    return { projectsCount, testimonialsCount, skillsCount };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'projects/seed');
  }
}

// Authentication Helpers
export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateEmail,
  updatePassword,
};
export type { User };
