/**
 * GALLERY CONFIGURATION - Dekora Clean S.A.S
 * ==========================================
 * 
 * Para agregar nuevas imágenes de trabajos terminados:
 * 
 * 1. Sube tu imagen a un servicio de hosting (Cloudinary, Imgur, etc.)
 *    o colócala en la carpeta /public/gallery/
 * 
 * 2. Agrega un nuevo objeto al array galleryImages con:
 *    - id: número único
 *    - src: URL de la imagen
 *    - category: categoría del trabajo (usa las claves definidas abajo)
 *    - title: título en español
 *    - titleEn: título en inglés
 * 
 * Categorías disponibles:
 *    - curtains: Cortinas y Persianas
 *    - carpets: Alfombras
 *    - furniture: Muebles
 *    - flooring: Pisos
 *    - automotive: Tapicería Automotriz
 *    - other: Otros trabajos
 */

export const galleryImages = [
  // ============================================
  // EJEMPLOS - Reemplaza con tus propias imágenes
  // ============================================
  
  {
    id: 1,
    src: "https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "curtains",
    title: "Instalación de cortinas blackout",
    titleEn: "Blackout curtains installation"
  },
  {
    id: 2,
    src: "https://images.pexels.com/photos/6782567/pexels-photo-6782567.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "furniture",
    title: "Lavado de sofá seccional",
    titleEn: "Sectional sofa cleaning"
  },
  {
    id: 3,
    src: "https://images.pexels.com/photos/6492403/pexels-photo-6492403.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "carpets",
    title: "Limpieza profunda de alfombra",
    titleEn: "Deep carpet cleaning"
  },
  {
    id: 4,
    src: "https://images.pexels.com/photos/6195280/pexels-photo-6195280.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "curtains",
    title: "Persianas verticales oficina",
    titleEn: "Office vertical blinds"
  },
  {
    id: 5,
    src: "https://images.pexels.com/photos/6782351/pexels-photo-6782351.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "furniture",
    title: "Restauración de sillas de comedor",
    titleEn: "Dining chairs restoration"
  },
  {
    id: 6,
    src: "https://images.pexels.com/photos/4792489/pexels-photo-4792489.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "automotive",
    title: "Limpieza interior de vehículo",
    titleEn: "Vehicle interior cleaning"
  },
  
  // ============================================
  // AGREGA TUS IMÁGENES AQUÍ ABAJO
  // ============================================
  // 
  // Ejemplo:
  // {
  //   id: 7,
  //   src: "https://tu-url-de-imagen.com/imagen.jpg",
  //   category: "furniture",
  //   title: "Descripción en español",
  //   titleEn: "Description in English"
  // },
  
];

// Categorías para el filtro
export const galleryCategories = {
  all: { es: "Todos", en: "All" },
  curtains: { es: "Cortinas", en: "Curtains" },
  carpets: { es: "Alfombras", en: "Carpets" },
  furniture: { es: "Muebles", en: "Furniture" },
  flooring: { es: "Pisos", en: "Flooring" },
  automotive: { es: "Automotriz", en: "Automotive" },
  other: { es: "Otros", en: "Other" }
};

// Textos de la sección
export const galleryTexts = {
  es: {
    tagline: "NUESTRO TRABAJO",
    title: "Galería de",
    titleHighlight: "Proyectos",
    subtitle: "Mira algunos de nuestros trabajos terminados. Calidad y dedicación en cada proyecto."
  },
  en: {
    tagline: "OUR WORK",
    title: "Project",
    titleHighlight: "Gallery",
    subtitle: "See some of our finished work. Quality and dedication in every project."
  }
};
