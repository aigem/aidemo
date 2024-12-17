export type IconType = 'video' | 'external-link' | 'github' | 'play-circle';

export interface NavLink {
  href: string;
  text: string;
  iconType: IconType;
}