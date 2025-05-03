
export interface Image {
  id: string;
  src: string;
  title: string;
  description?: string;
  categories: string[];
  saved?: boolean;
  liked?: boolean;
  height?: number;
  userId?: string;
  username?: string;
  userAvatar?: string;
}

export type Category = 
  | 'brutalismo'
  | 'sustentable'
  | 'interiores'
  | 'paisajismo'
  | 'renders 3D'
  | 'croquis'
  | 'minimalismo'
  | 'industrial';

