# Dekora Clean S.A.S - Landing Page PRD

## Original Problem Statement
Build a landing page for a cleaning service company in Colombia called "Dekora Clean S.A.S". Use the exact template provided (green #2ED573 color scheme) and base the website information from the business card. Make English and Colombian Spanish version with language toggle. Domain: dekoraclean.com. Add SEO meta tags. Fix layout spacing issues and use exact services from business card.

## Services from Business Card (EXACT)
1. Cortinas y Persianas (venta, lavado, mantenimiento)
2. Alfombras y Tapetes (venta y lavado)
3. Lavado de Muebles (salas, comedor, oficinas)
4. Lencería y Ropa de Cama (venta y lavado)
5. Pisos de Madera y Laminados (venta, instalación, mantenimiento)
6. Tapicería Automotriz (lavado)
7. Arreglos Locativos (obra civil)
8. Lavandería y Sastrería

## What's Been Implemented (April 8, 2026)

### Phase 1 - MVP Complete ✅
- **Hero Section**: Full-width background, contact form on right, phone CTA
- **Language Toggle**: EN/ES switch in header with full i18n support
- **Contact Form**: Name, email, phone, service type (8 services), message - saves to MongoDB
- **Stats Section**: 10Y Experience, 20K Services, 4.9 Rating, 1.1M Customers
- **Services Grid**: 8 service cards matching business card exactly (4x2 grid)
- **Why Choose Us**: Feature list with icons and professional cleaner image
- **How It Works**: 3-step process (Quote, Book, Relax)
- **Testimonials**: 3 Colombian Spanish testimonials (Bogotá, Medellín, Cali)
- **FAQ**: 6 questions with Shadcn Accordion - updated for specific services
- **CTA Section**: Green gradient with booking buttons
- **Footer**: Contact info, services, hours from business card
- **WhatsApp Float**: Button linking to +57 304 407 2499
- **Mobile Responsive**: Full mobile support with hamburger menu
- **SEO**: Complete meta tags, Open Graph, Twitter cards, JSON-LD

### Layout Fixes Applied ✅
- Reduced section padding for better flow
- Fixed service card grid (4 columns on desktop)
- Improved typography sizing
- Better container width control
- Proper z-index management

### Technical Stack
- Frontend: React + Tailwind CSS + Shadcn/UI
- Backend: FastAPI + MongoDB
- Font: Plus Jakarta Sans
- Colors: Green (#2ED573) primary, Dark (#1E272E) secondary

## Business Card Details
- **Company**: Dekora Clean S.A.S
- **Slogan**: "Ambientes más agradables, Decoración y mantenimiento"
- **Contact**: Jhon Jairo Vargas Molano
- **Phone**: +57 304 407 2499
- **Email**: dekoraclean@hotmail.com
- **Website**: www.dekoraclean.com
- **Address**: Calle 19 No.96 G - 76 - Int. 7, Colombia

## Next Tasks
1. Add Resend email integration when user provides API key
2. Add Google Analytics tracking
3. Consider adding portfolio/gallery section
