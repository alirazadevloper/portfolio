import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterProjects,
  sortProjects,
  validateInquiryForm,
  calculatePortfolioStats,
  getDefaultSkillIcon,
  normalizeSkillInput,
  ProjectItem,
} from './portfolio-logic';

const sampleProjects: ProjectItem[] = [
  {
    id: 1,
    slug: 'capital-smart-city-reel',
    title: 'Capital Smart City Drone Reel',
    category: 'video',
    media_type: 'video',
    media_url: '/assets/aistudio/1_Kanal_Residential_Plot___Housing_Development_bea26688.mp4',
    client_or_brand: 'Capital Smart City',
    description: 'High quality real estate montage',
    tags: ['Drone', 'Real Estate', 'VFX'],
    aspect_ratio: '9:16',
    likes_count: 24,
    views_count: 350,
    featured: true,
    sort_order: 1,
  },
  {
    id: 2,
    slug: 'burger-lab-post',
    title: 'Burger Lab Promotional Graphic',
    category: 'social',
    media_type: 'image',
    media_url: '/assets/aistudio/Burger_Food_Instagram_Post_f75f9144.png',
    client_or_brand: 'Burger Lab',
    description: 'Social media Instagram post design',
    tags: ['Food', 'Social Media', 'Photoshop'],
    aspect_ratio: '1:1',
    likes_count: 42,
    views_count: 512,
    featured: false,
    sort_order: 2,
  },
  {
    id: 3,
    slug: 'eastern-housing-construction',
    title: 'Eastern Housing Construction Montage',
    category: 'video',
    media_type: 'video',
    media_url: '/assets/aistudio/Building_Foundation___Structural_Construction_a1ca3da9.mp4',
    client_or_brand: 'Eastern Housing Lahore',
    description: 'Construction progress reel with pacing and cuts',
    tags: ['Commercial', 'Montage', 'Audio Sync'],
    aspect_ratio: '9:16',
    likes_count: 18,
    views_count: 280,
    featured: false,
    sort_order: 3,
  },
];

test('filterProjects filters by category correctly', () => {
  const videosOnly = filterProjects(sampleProjects, 'video');
  assert.equal(videosOnly.length, 2);

  const graphicsOnly = filterProjects(sampleProjects, 'graphics');
  assert.equal(graphicsOnly.length, 1);
  assert.equal(graphicsOnly[0].slug, 'burger-lab-post');
});

test('filterProjects searches across title, brand and tags', () => {
  const searchBrand = filterProjects(sampleProjects, 'all', 'Smart City');
  assert.equal(searchBrand.length, 1);
  assert.equal(searchBrand[0].id, 1);

  const searchTag = filterProjects(sampleProjects, 'all', 'Photoshop');
  assert.equal(searchTag.length, 1);
  assert.equal(searchTag[0].id, 2);
});

test('sortProjects orders by likes and views correctly', () => {
  const sortedByLikes = sortProjects(sampleProjects, 'likes');
  assert.equal(sortedByLikes[0].id, 2); // 42 likes
  assert.equal(sortedByLikes[1].id, 1); // 24 likes
  assert.equal(sortedByLikes[2].id, 3); // 18 likes

  const sortedByViews = sortProjects(sampleProjects, 'views');
  assert.equal(sortedByViews[0].views_count, 512);
});

test('validateInquiryForm handles valid and invalid submissions', () => {
  const invalid = validateInquiryForm({
    name: 'A',
    email: 'bademail',
    service: '',
    message: 'short',
  });
  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.length, 4);

  const valid = validateInquiryForm({
    name: 'Sarah Khan',
    email: 'sarah@example.com',
    service: 'Video Editing',
    message: 'We are looking for a video editor for regular social reels.',
  });
  assert.equal(valid.valid, true);
  assert.equal(valid.errors.length, 0);
});

test('calculatePortfolioStats aggregates correct totals', () => {
  const stats = calculatePortfolioStats(sampleProjects);
  assert.equal(stats.total, 3);
  assert.equal(stats.videos, 2);
  assert.equal(stats.graphics, 1);
  assert.equal(stats.totalLikes, 84);
  assert.equal(stats.totalViews, 1142);
  assert.equal(stats.categoryBreakdown['video'], 2);
  assert.equal(stats.categoryBreakdown['social'], 1);
});

test('normalizeSkillInput validates names, resolves default icons, and clamps fields', () => {
  assert.equal(getDefaultSkillIcon('video'), 'film');
  assert.equal(getDefaultSkillIcon('office'), 'file-text');

  const valid = normalizeSkillInput({
    name: '  Adobe Illustrator  ',
    category: 'design',
    proficiency: 120,
    focus: '  Vector Marks & Brand Identity  ',
    icon: 'pen-tool',
    details: '  Crafts scalable vector monograms, stationery templates, and print-ready flyers.  ',
  });
  assert.equal(valid.valid, true);
  assert.equal(valid.data.name, 'Adobe Illustrator');
  assert.equal(valid.data.proficiency, 100);
  assert.equal(valid.data.icon, 'pen-tool');
  assert.match(valid.data.details, /Crafts scalable vector monograms/);

  const invalid = normalizeSkillInput({
    name: 'A',
    category: 'it',
    proficiency: 5,
    icon: 'non-existent-icon',
    details: '',
  });
  assert.equal(invalid.valid, false);
  assert.equal(invalid.data.icon, 'monitor');
  assert.equal(invalid.data.proficiency, 10);
});
