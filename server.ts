import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize SQLite database
const db = new Database(path.join(dataDir, 'portfolio.db'));

// Pragmas for performance
db.pragma('journal_mode = WAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service TEXT NOT NULL,
    budget TEXT,
    timeline TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    media_type TEXT NOT NULL,
    media_url TEXT NOT NULL,
    client_or_brand TEXT,
    description TEXT,
    tags TEXT,
    aspect_ratio TEXT DEFAULT '1:1',
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    featured INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS project_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    author_name TEXT NOT NULL,
    comment TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT NOT NULL,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    quote TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed default initial projects if table is empty
const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number };

if (projectCount.count === 0) {
  const insertProject = db.prepare(`
    INSERT INTO projects (
      slug, title, category, media_type, media_url, client_or_brand,
      description, tags, aspect_ratio, likes_count, views_count, featured, sort_order
    ) VALUES (
      @slug, @title, @category, @media_type, @media_url, @client_or_brand,
      @description, @tags, @aspect_ratio, @likes_count, @views_count, @featured, @sort_order
    )
  `);

  const initialProjects = [
    // Video Reels (6)
    {
      slug: 'capital-smart-city-1-kanal-villas',
      title: 'Capital Smart City 1-Kanal Luxury Villas Reel',
      category: 'video',
      media_type: 'video',
      media_url: '/assets/aistudio/1_Kanal_Residential_Plot___Housing_Development_bea26688.mp4',
      client_or_brand: 'Capital Smart City Islamabad',
      description: 'High-energy vertical drone reel featuring Sector B Overseas East villas with kinetic typography, modern audio sync, and architectural cinematography.',
      tags: JSON.stringify(['Drone Reel', 'Real Estate', 'Kinetic Typography', 'Premiere Pro', '4K Drone']),
      aspect_ratio: '9:16',
      likes_count: 52,
      views_count: 740,
      featured: 1,
      sort_order: 1,
    },
    {
      slug: 'eastern-housing-structural-construction',
      title: 'Structural Foundation & Machinery Action Reel',
      category: 'video',
      media_type: 'video',
      media_url: '/assets/aistudio/Building_Foundation___Structural_Construction_a1ca3da9.mp4',
      client_or_brand: 'Eastern Housing Lahore',
      description: 'Industrial pacing montage highlighting steel cutting, crane lifts, and worker dedication with punchy percussion audio and cinematic color grading.',
      tags: JSON.stringify(['Industrial', 'Action Cuts', 'Sound Design', 'Commercial Reel']),
      aspect_ratio: '9:16',
      likes_count: 44,
      views_count: 610,
      featured: 1,
      sort_order: 2,
    },
    {
      slug: 'educational-engineering-mathematics',
      title: 'The Philosophy of Mathematics & Thinking Reel',
      category: 'video',
      media_type: 'video',
      media_url: '/assets/aistudio/Educational-Engineering_6a9cf9c0.mp4',
      client_or_brand: 'Educational Engineering',
      description: 'Thought-provoking educational short reel combining Urdu subtitles, Einstein quotes, neural network animations, and b-roll transitions.',
      tags: JSON.stringify(['Educational', 'Urdu Typography', 'Subtitles', 'Motion Graphics']),
      aspect_ratio: '9:16',
      likes_count: 78,
      views_count: 980,
      featured: 1,
      sort_order: 3,
    },
    {
      slug: 'study-trick-brain-alert-mode',
      title: 'Study Trick Ep-42: Brain Focus & Memory Hack',
      category: 'video',
      media_type: 'video',
      media_url: '/assets/aistudio/Learning_tricks_d3944f13.mp4',
      client_or_brand: 'The Aspirex',
      description: 'Viral high-retention educational reel using dark anime aesthetics, countdown graphics, step-by-step Urdu voiceover, and pacing.',
      tags: JSON.stringify(['Viral Short', 'Voiceover Timing', 'Anime Graphics', 'Study Hack']),
      aspect_ratio: '9:16',
      likes_count: 112,
      views_count: 1420,
      featured: 1,
      sort_order: 4,
    },
    {
      slug: 'eastern-housing-corporate-construction',
      title: 'Eastern Housing Corporate Progress & Quality Reel',
      category: 'video',
      media_type: 'video',
      media_url: '/assets/aistudio/On-Site_Building_Construction_Progress_9f6d1756.mp4',
      client_or_brand: 'Eastern Housing Lahore',
      description: 'Full narrative commercial reel highlighting QA engineering team inspection, resident testimonials, and brand identity animations.',
      tags: JSON.stringify(['Corporate Film', 'Urdu Voiceover', 'Resident Testimonial', 'Drone']),
      aspect_ratio: '9:16',
      likes_count: 63,
      views_count: 890,
      featured: 0,
      sort_order: 5,
    },
    {
      slug: 'capital-smart-city-split-screen',
      title: 'Capital Smart City 3-Split Architectural Reel',
      category: 'video',
      media_type: 'video',
      media_url: '/assets/aistudio/Real_Estate_Showcase_1dc50f40.mp4',
      client_or_brand: 'Capital Smart City',
      description: 'Multi-layer 3-way split screen visual showcasing Lake View Heights, Linear Park, and Sports Complex in synchronized harmony.',
      tags: JSON.stringify(['Split Screen', 'Creative Layout', 'Real Estate', 'Branding']),
      aspect_ratio: '9:16',
      likes_count: 85,
      views_count: 1100,
      featured: 1,
      sort_order: 6,
    },

    // Graphic Design Assets (15)
    {
      slug: 'burger-lab-instagram-post',
      title: 'Burger Lab 30% Off Social Media Campaign',
      category: 'social',
      media_type: 'image',
      media_url: '/assets/aistudio/Burger_Food_Instagram_Post_f75f9144.png',
      client_or_brand: 'Burger Lab',
      description: 'Mouthwatering commercial social media post with dynamic curved framing, floating tomatoes, layered typography, and high-conversion call to action.',
      tags: JSON.stringify(['Social Media', 'Food Design', 'Canva', 'Photoshop', 'Instagram']),
      aspect_ratio: '1:1',
      likes_count: 69,
      views_count: 810,
      featured: 1,
      sort_order: 7,
    },
    {
      slug: 'munazza-irfan-luxury-business-card',
      title: 'Executive Head Manager Black Silk Card',
      category: 'branding',
      media_type: 'image',
      media_url: '/assets/aistudio/Business_Card__2__40af2b3d.png',
      client_or_brand: 'Munazza Irfan Portfolio',
      description: 'Luxury corporate business card concept designed for executive positioning with metallic gold typography on pure black folded silk texture.',
      tags: JSON.stringify(['Business Card', 'Luxury Gold', 'Silk Texture', 'Corporate Identity']),
      aspect_ratio: '16:9',
      likes_count: 95,
      views_count: 1180,
      featured: 1,
      sort_order: 8,
    },
    {
      slug: 'juniper-street-cafe-business-card',
      title: 'Juniper Street Café Botanical Stationery',
      category: 'branding',
      media_type: 'image',
      media_url: '/assets/aistudio/Business_Card_a1f870ac.jpg',
      client_or_brand: 'Juniper Street Café',
      description: 'Organic cafe identity stationery card mockup pairing terracotta warmth with deep eucalyptus green botanical illustrations.',
      tags: JSON.stringify(['Cafe Branding', 'Botanical', 'Stationery Mockup', 'Earth Tones']),
      aspect_ratio: '1:1',
      likes_count: 51,
      views_count: 640,
      featured: 0,
      sort_order: 9,
    },
    {
      slug: 'helping-businesses-work-smarter-card',
      title: 'Helping Businesses Work Smarter Brand Identity',
      category: 'branding',
      media_type: 'image',
      media_url: '/assets/aistudio/Business_card_b53b857b.png',
      client_or_brand: 'Munazza Irfan',
      description: 'Sophisticated brand card featuring custom gold geometric mandala mark and client-focused brand motto on dark satin.',
      tags: JSON.stringify(['Brand Identity', 'Gold Emblem', 'Luxury Fabric', 'Minimalist']),
      aspect_ratio: '16:9',
      likes_count: 73,
      views_count: 890,
      featured: 1,
      sort_order: 10,
    },
    {
      slug: 'digital-marketing-agency-flyer',
      title: 'Digital Marketing Agency Tri-Fold Flyer',
      category: 'flyer',
      media_type: 'image',
      media_url: '/assets/aistudio/Flyer_b12b5985.jpg',
      client_or_brand: 'Digital Marketing Agency',
      description: 'Clean modern corporate marketing flyer featuring canary yellow swooshes, structured business concept sections, and vector iconography.',
      tags: JSON.stringify(['Flyer', 'Corporate Marketing', 'Print Design', 'Infographic']),
      aspect_ratio: '3:4',
      likes_count: 58,
      views_count: 720,
      featured: 0,
      sort_order: 11,
    },
    {
      slug: 'pizza-house-grand-opening-flyer',
      title: 'Pizza House Pallandri Grand Opening Flyer',
      category: 'flyer',
      media_type: 'image',
      media_url: '/assets/aistudio/Flyer_9744df9f.png',
      client_or_brand: 'Pizza House Pallandri',
      description: 'Vibrant local community announcement flyer highlighting menu specials, 30% discount promotion, and location details in Pallandri.',
      tags: JSON.stringify(['Local Business', 'Restaurant Flyer', 'Grand Opening', 'Discount Promo']),
      aspect_ratio: '1:1',
      likes_count: 42,
      views_count: 530,
      featured: 0,
      sort_order: 12,
    },
    {
      slug: 'boutique-vintage-crest-logo',
      title: 'A Boutique Vintage Fashion Filigree Crest',
      category: 'branding',
      media_type: 'image',
      media_url: '/assets/aistudio/Logo__2__63103627.jpg',
      client_or_brand: 'A Boutique Vintage',
      description: 'Victorian baroque-inspired emblem monogram with ornamental scrollwork for luxury vintage apparel and fashion accessories.',
      tags: JSON.stringify(['Logo Design', 'Vintage Monogram', 'Luxury Brand', 'Ornate Crest']),
      aspect_ratio: '1:1',
      likes_count: 76,
      views_count: 940,
      featured: 1,
      sort_order: 13,
    },
    {
      slug: 'anna-fashion-store-logo',
      title: 'Anna Fashion Store Botanical Circle Logo',
      category: 'branding',
      media_type: 'image',
      media_url: '/assets/aistudio/Logo_12077448.jpg',
      client_or_brand: 'Anna Fashion Store',
      description: 'Earthy minimalist fashion boutique mark using serif typography and subtle hand-drawn olive branch flourishes.',
      tags: JSON.stringify(['Logo Design', 'Fashion Brand', 'Botanical Line Art', 'Earth Tones']),
      aspect_ratio: '1:1',
      likes_count: 64,
      views_count: 780,
      featured: 0,
      sort_order: 14,
    },
    {
      slug: 'building-construction-architectural-logo',
      title: 'Building Construction Modern Skyline Logo',
      category: 'branding',
      media_type: 'image',
      media_url: '/assets/aistudio/Logo_5a797adc.png',
      client_or_brand: 'Building Construction Co.',
      description: 'Geometric corporate identity mark featuring bold cobalt and steel grey skyscraper towers and drafted angle lines.',
      tags: JSON.stringify(['Logo Design', 'Construction', 'Architecture', 'Corporate']),
      aspect_ratio: '1:1',
      likes_count: 50,
      views_count: 610,
      featured: 0,
      sort_order: 15,
    },
    {
      slug: 'pizza-shop-slice-emblem-logo',
      title: 'Pizza Shop Bold Mascot Emblem',
      category: 'branding',
      media_type: 'image',
      media_url: '/assets/aistudio/Pizza_Logo_4039f311.png',
      client_or_brand: 'Pizza Shop',
      description: 'High-contrast red and golden yellow graphic pizza slice logo with bold serif title badge for casual dining.',
      tags: JSON.stringify(['Logo Design', 'Vector Illustration', 'Food Brand', 'Color Blocking']),
      aspect_ratio: '1:1',
      likes_count: 40,
      views_count: 480,
      featured: 0,
      sort_order: 16,
    },
    {
      slug: 'mega-fashion-sale-poster',
      title: 'Mega Fashion Sale Upto 50% Off Poster',
      category: 'poster',
      media_type: 'image',
      media_url: '/assets/aistudio/Poster_867920d9.png',
      client_or_brand: 'Mega Fashion Store',
      description: 'High-fashion editorial retail campaign poster featuring model photography framed by vibrant gradient sunburst bars on dark canvas.',
      tags: JSON.stringify(['Fashion Poster', 'Retail Promo', 'Commercial', 'Canva Pro']),
      aspect_ratio: '1:1',
      likes_count: 81,
      views_count: 1040,
      featured: 1,
      sort_order: 17,
    },
    {
      slug: 'globex-solutions-corporate-banner',
      title: 'Globex Solutions Future Tech Web Banner',
      category: 'banner',
      media_type: 'image',
      media_url: '/assets/aistudio/Website_Banner_53c790d7.png',
      client_or_brand: 'Globex Solutions',
      description: 'Full-width digital web banner highlighting holographic smart city interfaces, corporate strategy badges, and vibrant cobalt waves.',
      tags: JSON.stringify(['Website Banner', 'Holographic', 'Corporate Tech', 'Digital Marketing']),
      aspect_ratio: '16:9',
      likes_count: 67,
      views_count: 860,
      featured: 1,
      sort_order: 18,
    },
    {
      slug: 'al-jannat-summer-lawn-promo',
      title: 'Al-Jannat Summer Lawn 30% Off Social Post',
      category: 'social',
      media_type: 'image',
      media_url: '/assets/aistudio/Social_Media_Post_67ffe2bd.png',
      client_or_brand: 'Al-Jannat Collection',
      description: 'Refined Pakistani summer lawn fashion collection post featuring pastel floral photography, bold price badge, and boutique styling.',
      tags: JSON.stringify(['Social Media', 'Pakistani Fashion', 'Summer Lawn', 'Instagram Banner']),
      aspect_ratio: '1:1',
      likes_count: 62,
      views_count: 770,
      featured: 0,
      sort_order: 19,
    },
    {
      slug: 'super-delicious-food-burger-poster',
      title: 'Super Delicious Food Menu Burger Poster',
      category: 'poster',
      media_type: 'image',
      media_url: '/assets/aistudio/Burger_Poster_268dceeb.png',
      client_or_brand: 'Burger Junction',
      description: 'Eye-catching split-backdrop food poster with realistic wood grain picnic table and speech bubble discount badges.',
      tags: JSON.stringify(['Food Poster', 'Photoshop Composite', 'Retail', 'Fast Food']),
      aspect_ratio: '1:1',
      likes_count: 55,
      views_count: 680,
      featured: 0,
      sort_order: 20,
    },
    {
      slug: 'codemind-university-admission-poster',
      title: 'CodeMind University Open Admission Poster',
      category: 'poster',
      media_type: 'image',
      media_url: '/assets/aistudio/Admissions_University_Poster_a1db8ec5.png',
      client_or_brand: 'CodeMind University',
      description: 'Professional academic admissions campaign poster featuring student photography, rounded violet glass card, and clean contact credentials.',
      tags: JSON.stringify(['University Poster', 'Admissions', 'Academic Branding', 'Print Ready']),
      aspect_ratio: '3:4',
      likes_count: 91,
      views_count: 1190,
      featured: 1,
      sort_order: 21,
    },
  ];

  const seedTransaction = db.transaction((projects) => {
    for (const project of projects) {
      insertProject.run(project);
    }
  });

  seedTransaction(initialProjects);

  // Seed some initial testimonials
  const insertTestimonial = db.prepare(`
    INSERT INTO testimonials (author, role, company, quote, rating)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertTestimonial.run(
    'Khurram Shahzad',
    'Marketing Lead',
    'Eastern Housing Lahore',
    'Munazza has a strong eye for video pacing and construction footage. Her reels captured our site development with impressive rhythm and clarity.',
    5
  );
  insertTestimonial.run(
    'Taimoor Ahmed',
    'Operations Director',
    'Globex Solutions',
    'Outstanding work on our corporate banners and MS Office presentations. Extremely punctual, detail-oriented, and receptive to feedback.',
    5
  );
  insertTestimonial.run(
    'Zainab Malik',
    'Brand Owner',
    'Al-Jannat Collection',
    'Her social media posts and summer lawn graphics helped elevate our online engagement. Highly recommended for creative design.',
    5
  );
}

// REST API Endpoints

// GET /api/stats
app.get('/api/stats', (_req: Request, res: Response) => {
  try {
    const totalProjects = db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number };
    const videoReels = db.prepare("SELECT COUNT(*) as count FROM projects WHERE media_type = 'video'").get() as { count: number };
    const graphicDesigns = db.prepare("SELECT COUNT(*) as count FROM projects WHERE media_type = 'image'").get() as { count: number };
    const likesAndViews = db.prepare('SELECT SUM(likes_count) as total_likes, SUM(views_count) as total_views FROM projects').get() as { total_likes: number; total_views: number };
    const totalInquiries = db.prepare('SELECT COUNT(*) as count FROM inquiries').get() as { count: number };

    res.json({
      totalProjects: totalProjects.count,
      videoReels: videoReels.count,
      graphicDesigns: graphicDesigns.count,
      totalLikes: likesAndViews.total_likes || 0,
      totalViews: likesAndViews.total_views || 0,
      totalInquiries: totalInquiries.count,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/projects
app.get('/api/projects', (req: Request, res: Response) => {
  try {
    const { category, type, search } = req.query;
    let query = 'SELECT * FROM projects WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (type && type !== 'all') {
      query += ' AND media_type = ?';
      params.push(type);
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      query += ' AND (title LIKE ? OR description LIKE ? OR client_or_brand LIKE ? OR tags LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    query += ' ORDER BY featured DESC, sort_order ASC, id ASC';

    const rows = db.prepare(query).all(...params) as any[];
    const parsed = rows.map((r) => ({
      ...r,
      featured: Boolean(r.featured),
      tags: r.tags ? JSON.parse(r.tags) : [],
    }));

    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/projects/:id
app.get('/api/projects/:id', (req: Request, res: Response) => {
  try {
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id) as any;
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const comments = db.prepare('SELECT * FROM project_comments WHERE project_id = ? ORDER BY created_at DESC').all(req.params.id);

    res.json({
      ...project,
      featured: Boolean(project.featured),
      tags: project.tags ? JSON.parse(project.tags) : [],
      comments,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/projects/:id/like
app.post('/api/projects/:id/like', (req: Request, res: Response) => {
  try {
    const stmt = db.prepare('UPDATE projects SET likes_count = likes_count + 1 WHERE id = ?');
    stmt.run(req.params.id);

    const updated = db.prepare('SELECT likes_count FROM projects WHERE id = ?').get(req.params.id) as { likes_count: number };
    res.json({ success: true, likes_count: updated.likes_count });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/projects/:id/views
app.post('/api/projects/:id/views', (req: Request, res: Response) => {
  try {
    const stmt = db.prepare('UPDATE projects SET views_count = views_count + 1 WHERE id = ?');
    stmt.run(req.params.id);

    const updated = db.prepare('SELECT views_count FROM projects WHERE id = ?').get(req.params.id) as { views_count: number };
    res.json({ success: true, views_count: updated.views_count });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/projects/:id/comments
app.post('/api/projects/:id/comments', (req: Request, res: Response) => {
  try {
    const { author_name, comment, rating } = req.body;
    if (!author_name || !comment) {
      return res.status(400).json({ error: 'Author name and comment are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO project_comments (project_id, author_name, comment, rating)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(req.params.id, author_name.trim(), comment.trim(), Number(rating) || 5);

    const created = db.prepare('SELECT * FROM project_comments WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/testimonials
app.get('/api/testimonials', (_req: Request, res: Response) => {
  try {
    const rows = db.prepare('SELECT * FROM testimonials ORDER BY created_at DESC').all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/testimonials
app.post('/api/testimonials', (req: Request, res: Response) => {
  try {
    const { author, role, company, quote, rating } = req.body;
    if (!author || !quote) {
      return res.status(400).json({ error: 'Author and quote are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO testimonials (author, role, company, quote, rating)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      author.trim(),
      (role || 'Client').trim(),
      (company || 'Company').trim(),
      quote.trim(),
      Number(rating) || 5
    );

    const created = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/inquiries
app.get('/api/inquiries', (_req: Request, res: Response) => {
  try {
    const rows = db.prepare('SELECT * FROM inquiries ORDER BY created_at DESC').all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/inquiries
app.post('/api/inquiries', (req: Request, res: Response) => {
  try {
    const { name, email, phone, service, budget, timeline, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO inquiries (name, email, phone, service, budget, timeline, message)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      name.trim(),
      email.trim(),
      (phone || '').trim(),
      (service || 'General Inquiry').trim(),
      (budget || '').trim(),
      (timeline || '').trim(),
      message.trim()
    );

    const created = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ success: true, inquiry: created });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// PATCH /api/inquiries/:id
app.patch('/api/inquiries/:id', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, req.params.id);
    const updated = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// DELETE /api/inquiries/:id
app.delete('/api/inquiries/:id', (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM inquiries WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/projects (Create new project from Admin)
app.post('/api/projects', (req: Request, res: Response) => {
  try {
    const { title, category, media_type, media_url, client_or_brand, description, tags, aspect_ratio } = req.body;
    if (!title || !media_url) {
      return res.status(400).json({ error: 'Title and media_url are required' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    const stmt = db.prepare(`
      INSERT INTO projects (slug, title, category, media_type, media_url, client_or_brand, description, tags, aspect_ratio, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      slug,
      title.trim(),
      category || 'branding',
      media_type || 'image',
      media_url.trim(),
      (client_or_brand || '').trim(),
      (description || '').trim(),
      JSON.stringify(Array.isArray(tags) ? tags : []),
      aspect_ratio || '1:1',
      0
    );

    const created = db.prepare('SELECT * FROM projects WHERE id = ?').get(info.lastInsertRowid) as any;
    res.status(201).json({
      ...created,
      featured: Boolean(created.featured),
      tags: created.tags ? JSON.parse(created.tags) : [],
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Serve static assets from public
app.use(express.static(path.join(__dirname, 'public')));

// Mount Vite or static build
async function setupServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

setupServer();
