import React from 'react';
import { ExternalLink, Video, Github, PlayCircle } from 'lucide-react';
import type { IconType } from '../../types/navigation';

interface NavLinkProps {
  href: string;
  text: string;
  iconType: IconType;
}

const iconComponents: Record<IconType, React.FC<{ className?: string }>> = {
  'video': Video,
  'external-link': ExternalLink,
  'github': Github,
  'play-circle': PlayCircle
};

export const NavLink: React.FC<NavLinkProps> = ({ href, text, iconType }) => {
  const IconComponent = iconComponents[iconType];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-white hover:text-purple-200 transition-colors duration-200"
    >
      <IconComponent className="w-4 h-4" />
      <span>{text}</span>
    </a>
  );
};