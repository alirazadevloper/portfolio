import React from 'react';
import {
  Palette,
  Sparkles,
  PenTool,
  Layers,
  Wand2,
  Video,
  Film,
  Scissors,
  Camera,
  FileText,
  Table,
  Presentation,
  Monitor,
  Cpu,
  Globe,
  Award,
} from 'lucide-react';
import { SkillCategory, SkillIconKey, getDefaultSkillIcon } from '../utils/portfolio-logic';

export interface SkillIconOption {
  key: SkillIconKey;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}

export const SKILL_ICON_OPTIONS: SkillIconOption[] = [
  { key: 'palette', label: 'Palette', Icon: Palette },
  { key: 'sparkles', label: 'Sparkles', Icon: Sparkles },
  { key: 'pen-tool', label: 'Pen Tool', Icon: PenTool },
  { key: 'layers', label: 'Layers', Icon: Layers },
  { key: 'wand', label: 'Magic Wand', Icon: Wand2 },
  { key: 'video', label: 'Video Cam', Icon: Video },
  { key: 'film', label: 'Film Reel', Icon: Film },
  { key: 'scissors', label: 'Cut & Edit', Icon: Scissors },
  { key: 'camera', label: 'Camera', Icon: Camera },
  { key: 'file-text', label: 'Document', Icon: FileText },
  { key: 'table', label: 'Spreadsheet', Icon: Table },
  { key: 'presentation', label: 'Slide Deck', Icon: Presentation },
  { key: 'monitor', label: 'Desktop OS', Icon: Monitor },
  { key: 'cpu', label: 'IT Systems', Icon: Cpu },
  { key: 'globe', label: 'Web & AI', Icon: Globe },
  { key: 'award', label: 'Certified', Icon: Award },
];

export const SkillIcon: React.FC<{
  icon?: string;
  category?: SkillCategory;
  className?: string;
}> = ({ icon, category = 'design', className = 'h-4 w-4' }) => {
  const resolvedKey = icon || getDefaultSkillIcon(category);
  const found = SKILL_ICON_OPTIONS.find((item) => item.key === resolvedKey) || SKILL_ICON_OPTIONS[0];
  const IconComponent = found.Icon;
  return <IconComponent className={className} />;
};
