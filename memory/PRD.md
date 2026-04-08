# Dekora Clean S.A.S - Landing Page PRD

## Original Problem Statement
Build a landing page for a cleaning service company in Colombia called "Dekora Clean S.A.S". Use the exact template provided (green #2ED573 color scheme) and base the website information from the business card. Make English and Colombian Spanish version with language toggle. Domain: dekoraclean.com. Add SEO meta tags.

## User Personas
1. **Residential Clients**: Homeowners in Colombia looking for professional cleaning services
2. **Commercial Clients**: Businesses needing office cleaning, post-construction cleaning
3. **Property Managers**: Looking for move-in/move-out cleaning services

## Core Requirements (Static)
- Bilingual landing page (English/Spanish) - ✅ COMPLETE
- Contact form for lead generation - ✅ COMPLETE
- Company information from business card - ✅ COMPLETE
- Services showcase - ✅ COMPLETE
- Testimonials section - ✅ COMPLETE
- FAQ section - ✅ COMPLETE
- WhatsApp integration - ✅ COMPLETE
- Mobile responsive design - ✅ COMPLETE
- SEO meta tags - ✅ COMPLETE
- Match template design (green color scheme) - ✅ COMPLETE

## What's Been Implemented (April 8, 2026)

### Phase 1 - MVP Complete ✅
- **Hero Section**: Full-width background, contact form on right, phone CTA
- **Language Toggle**: EN/ES switch in header with full i18n support
- **Contact Form**: Name, email, phone, service type, message - saves to MongoDB
- **Stats Section**: 10Y Experience, 20K Services, 4.9* Rating, 1.1M Customers
- **Services Grid**: 6 service cards (Home, Office, Move-in/out, Deep, Curtains, Furniture)
- **Why Choose Us**: Feature list with icons and professional cleaner image
- **How It Works**: 3-step process (Quote, Book, Relax)
- **Testimonials**: 3 Colombian Spanish testimonials (Bogotá, Medellín, Cali)
- **FAQ**: 6 questions with Shadcn Accordion
- **CTA Section**: Green gradient with booking buttons
- **Footer**: Contact info, services, hours from business card
- **WhatsApp Float**: Animated button linking to +57 304 407 2499
- **Mobile Responsive**: Full mobile support with hamburger menu

### SEO Implementation ✅
- Title tag with keywords
- Meta description
- Meta keywords
- Open Graph tags (Facebook)
- Twitter card tags
- Geo tags for Colombia
- hreflang for language alternates
- JSON-LD structured data (LocalBusiness schema)
- Canonical URL

### Technical Stack
- Frontend: React + Tailwind CSS + Shadcn/UI
- Backend: FastAPI + MongoDB
- Font: Plus Jakarta Sans
- Colors: Green (#2ED573) primary, Dark (#1E272E) secondary

## Prioritized Backlog

### P0 (Critical) - NONE

### P1 (High Priority)
- [ ] Email integration with Resend for contact form notifications
- [ ] Google Analytics integration

### P2 (Medium Priority)
- [ ] Service detail pages
- [ ] Portfolio/Gallery of completed work
- [ ] Google Maps integration for address
- [ ] Blog section for SEO

### P3 (Nice to Have)
- [ ] Online booking system with calendar
- [ ] Admin dashboard for contact management
- [ ] Customer reviews integration (Google Reviews widget)

## Next Tasks
1. Add Resend email integration when user provides API key
2. Add Google Analytics tracking
3. Consider adding service detail pages

## Business Card Details
- **Company**: Dekora Clean S.A.S
- **Slogan**: "Ambientes más agradables, Decoración y mantenimiento"
- **Contact**: Jhon Jairo Vargas Molano
- **Phone**: +57 304 407 2499
- **Email**: dekoraclean@hotmail.com
- **Website**: www.dekoraclean.com
- **Address**: Calle 19 No.96 G - 76 - Int. 7, Colombia
