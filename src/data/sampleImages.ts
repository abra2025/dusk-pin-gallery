
import { Image } from '../types';
import { v4 as uuid } from 'uuid';

// Funciones auxiliares para generar datos
const getRandomHeight = () => Math.floor(Math.random() * 3) + 1; // 1, 2 o 3 (multiplicador de altura)

export const sampleImages: Image[] = [
  {
    id: uuid(),
    src: "https://images.unsplash.com/photo-1527576539890-dfa815648363",
    title: "Edificio Brutalista",
    description: "Ejemplo clásico de arquitectura brutalista con fachada de hormigón.",
    categories: ['brutalismo'],
    height: 270 * getRandomHeight(),
  },
  {
    id: uuid(),
    src: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a",
    title: "Museo de Arte Contemporáneo",
    description: "Diseño minimalista para museo con grandes espacios abiertos.",
    categories: ['minimalismo', 'interiores'],
    height: 250 * getRandomHeight(),
  },
  {
    id: uuid(),
    src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742",
    title: "Torre Residencial",
    description: "Edificio residencial de alta densidad con balcones escalonados.",
    categories: ['sustentable', 'renders 3D'],
    height: 220 * getRandomHeight(),
  },
  {
    id: uuid(),
    src: "https://images.unsplash.com/photo-1496307653780-42ee777d4833",
    title: "Rascacielos de Cristal",
    description: "Edificio corporativo con fachada de vidrio reflectante.",
    categories: ['minimalismo'],
    height: 300 * getRandomHeight(),
  },
  {
    id: uuid(),
    src: "https://images.unsplash.com/photo-1431576901776-e539bd916ba2",
    title: "Complejo de Oficinas",
    description: "Diseño contemporáneo para centro empresarial.",
    categories: ['industrial'],
    height: 240 * getRandomHeight(),
  },
  {
    id: uuid(),
    src: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e",
    title: "Edificio Angular",
    description: "Estructura con geometría asimétrica y ángulos pronunciados.",
    categories: ['brutalismo', 'renders 3D'],
    height: 280 * getRandomHeight(),
    saved: true,
  },
  {
    id: uuid(),
    src: "https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace",
    title: "Centro Cultural",
    description: "Espacios amplios diseñados para exposiciones de arte.",
    categories: ['minimalismo', 'interiores'],
    height: 260 * getRandomHeight(),
  },
  {
    id: uuid(),
    src: "https://images.unsplash.com/photo-1460574283810-2aab119d8511",
    title: "Torre de Observación",
    description: "Estructura elevada con vistas panorámicas.",
    categories: ['industrial', 'paisajismo'],
    height: 320 * getRandomHeight(),
  },
  {
    id: uuid(),
    src: "https://images.unsplash.com/photo-1486718448742-163732cd1544",
    title: "Instalación Cultural",
    description: "Espacio contemporáneo para eventos artísticos.",
    categories: ['minimalismo'],
    height: 230 * getRandomHeight(),
    saved: true,
  },
  {
    id: uuid(),
    src: "https://images.unsplash.com/photo-1439337153520-7082a56a81f4",
    title: "Terminal de Transporte",
    description: "Diseño futurista para terminal de transporte público.",
    categories: ['industrial', 'renders 3D'],
    height: 250 * getRandomHeight(),
  },
  {
    id: uuid(),
    src: "https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a",
    title: "Edificio de Oficinas Moderno",
    description: "Espacio de trabajo con diseño contemporáneo.",
    categories: ['minimalismo', 'industrial'],
    height: 270 * getRandomHeight(),
  },
  {
    id: uuid(),
    src: "https://images.unsplash.com/photo-1473177104440-ffee2f376098",
    title: "Catedral Minimalista",
    description: "Espacios sagrados con diseño minimalista y luz natural.",
    categories: ['minimalismo', 'interiores'],
    height: 290 * getRandomHeight(),
  },
  {
    id: uuid(),
    src: "https://images.unsplash.com/photo-1494891848038-7bd202a2afeb",
    title: "Fachada Contemporánea",
    description: "Detalle de fachada con materiales mixtos.",
    categories: ['brutalismo'],
    height: 240 * getRandomHeight(),
  },
  {
    id: uuid(),
    src: "https://images.unsplash.com/photo-1551038247-3d9af20df552",
    title: "Complejo Residencial",
    description: "Viviendas sustentables con terrazas verdes.",
    categories: ['sustentable', 'paisajismo'],
    height: 260 * getRandomHeight(),
    saved: true,
  },
  {
    id: uuid(),
    src: "https://images.unsplash.com/photo-1524230572899-a752b3835840",
    title: "Pabellón de Exposiciones",
    description: "Estructura temporal para exhibiciones de arte.",
    categories: ['minimalismo'],
    height: 220 * getRandomHeight(),
  },
];
