# Dekora Clean S.A.S - Landing Page PRD

## Original Problem Statement
Build a landing page for a cleaning service company in Colombia called "Dekora Clean S.A.S". Use the exact template provided and base the website information from the business card. Make English and Colombian Spanish version with language toggle. Domain: dekoraclean.com

## User Personas
1. **Residential Clients**: Homeowners in Colombia looking for professional cleaning services
2. **Commercial Clients**: Businesses needing office cleaning, post-construction cleaning
3. **Property Managers**: Looking for move-in/move-out cleaning services

## Core Requirements (Static)
- Bilingual landing page (English/Spanish)
- Contact form for lead generation
- Company information from business card
- Services showcase
- Testimonials section
- FAQ section
- WhatsApp integration for direct contact
- Mobile responsive design

## What's Been Implemented (April 8, 2026)

### Phase 1 - MVP Complete ✅
- **Hero Section**: Full-width background with overlay, contact form, phone CTA
- **Language Toggle**: EN/ES switch in header with full i18n support
- **Contact Form**: Name, email, phone, service type, message - saves to MongoDB
- **Stats Section**: Placeholder statistics (10+ years, 2K+ services, 4.9 rating, 1.5K customers)
- **Services Grid**: 6 service cards (Home, Office, Move-in/out, Deep, Curtains, Furniture)
- **Why Choose Us**: Feature list with icons
- **How It Works**: 3-step process
- **Testimonials**: 3 Colombian Spanish testimonials (Bogotá, Medellín, Cali)
- **FAQ**: 6 questions with Shadcn Accordion
- **CTA Section**: Call-to-action with booking buttons
- **Footer**: Contact info, services, hours from business card
- **WhatsApp Float**: Floating button linking to +57 304 407 2499
- **Mobile Responsive**: Full mobile support with hamburger menu

### Technical Stack
- Frontend: React + Tailwind CSS + Shadcn/UI
- Backend: FastAPI + MongoDB
- Fonts: Outfit (headings), Work Sans (body)
- Colors: Blue (#2563eb) primary, Stone neutrals

## Prioritized Backlog

### P0 (Critical) - None remaining

### P1 (High Priority)
- [ ] Email integration with Resend for contact form notifications
- [ ] SEO meta tags and Open Graph
- [ ] Google Analytics integration

### P2 (Medium Priority)
- [ ] Service detail pages
- [ ] Portfolio/Gallery of completed work
- [ ] Google Maps integration for address
- [ ] Blog section for SEO

### P3 (Nice to Have)
- [ ] Online booking system with calendar
- [ ] Admin dashboard for contact management
- [ ] Customer reviews integration

## Next Tasks
1. Add Resend email integration when user provides API key
2. Add meta tags for SEO
3. Add analytics tracking

## Business Card Details
- **Company**: Dekora Clean S.A.S
- **Slogan**: "Ambientes más agradables, Decoración y mantenimiento"
- **Contact**: Jhon Jairo Vargas Molano
- **Phone**: +57 304 407 2499
- **Email**: dekoraclean@hotmail.com
- **Website**: www.dekoraclean.com
- **Address**: Calle 19 No.96 G - 76 - Int. 7, Colombia
