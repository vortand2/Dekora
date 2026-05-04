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
  // TRABAJOS REALES DE DEKORA CLEAN
  // ============================================
  
  {
    id: 1,
    src: "https://customer-assets.emergentagent.com/job_dekoraclean-preview/artifacts/33ohb906_Curtain%20installation.png",
    category: "curtains",
    title: "Instalación de cortinas blackout",
    titleEn: "Blackout curtains installation"
  },
  {
    id: 2,
    src: "https://customer-assets.emergentagent.com/job_dekoraclean-preview/artifacts/ezcltcvu_Window%20bling%20cleaning%202.png",
    category: "curtains",
    title: "Limpieza de persianas verticales",
    titleEn: "Vertical blinds cleaning"
  },
  {
    id: 3,
    src: "https://customer-assets.emergentagent.com/job_dekoraclean-preview/artifacts/nxlo7bxv_carpet%20cleaning.png",
    category: "carpets",
    title: "Lavado profesional de alfombra",
    titleEn: "Professional carpet cleaning"
  },
  {
    id: 4,
    src: "https://customer-assets.emergentagent.com/job_dekoraclean-preview/artifacts/h4ee0sry_Sofa%20cleaning.png",
    category: "furniture",
    title: "Lavado de sofá seccional",
    titleEn: "Sectional sofa cleaning"
  },
  {
    id: 5,
    src: "https://customer-assets.emergentagent.com/job_dekoraclean-preview/artifacts/x0uib2kh_Car%20Cleaning%202.png",
    category: "automotive",
    title: "Limpieza interior de vehículo",
    titleEn: "Vehicle interior cleaning"
  },
  
  // ============================================
  // AGREGA MÁS IMÁGENES AQUÍ ABAJO
  // ============================================
  // 
  // Ejemplo:
  // {
  //   id: 6,
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
