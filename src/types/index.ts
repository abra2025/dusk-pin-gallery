
export interface Image {
  id: string;
  src: string;
  title: string;
  description?: string;
  categories: string[];
  saved?: boolean;
  height?: number;
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
