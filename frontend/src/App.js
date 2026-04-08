import { useState, useEffect, createContext, useContext } from "react";
import "@/App.css";
import axios from "axios";
import { translations } from "./i18n/translations";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Star, 
  Home,
  Building2,
  Sparkles,
  Truck,
  Grid3X3,
  Car,
  Shield,
  Calendar,
  Leaf,
  Award,
  FileText,
  CalendarCheck,
  Smile,
  Globe,
  Menu,
  X,
  ChevronRight,
  Users,
  ThumbsUp
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Toaster, toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Language Context
const LanguageContext = createContext();
export const useLanguage = () => useContext(LanguageContext);

// WhatsApp Icon
const WhatsAppIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Logo Component
const Logo = ({ light = false }) => (
  <div className="flex items-center gap-2">
    <div className="grid grid-cols-2 gap-0.5">
      <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
      <div className="w-3 h-3 bg-orange-400 rounded-sm"></div>
      <div className="w-3 h-3 bg-[#2ED573] rounded-sm"></div>
      <div className="w-3 h-3 bg-[#7BED9F] rounded-sm"></div>
    </div>
    <span className={`text-xl font-bold ${light ? 'text-white' : 'text-[#1E272E]'}`}>
      Dekora <span className="text-[#2ED573]">Clean</span>
    </span>
  </div>
);

// Header Component
const Header = ({ t, lang, setLang }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`} data-testid="header">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          <a href="/" data-testid="logo">
            <Logo light={!isScrolled} />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {['services', 'about', 'testimonials', 'faq'].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item)}
                className={`text-sm font-medium transition-colors ${
                  isScrolled ? 'text-[#57606F] hover:text-[#2ED573]' : 'text-white/80 hover:text-white'
                }`}
                data-testid={`nav-${item}`}
              >
                {t.nav[item]}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "en" ? "es" : "en")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                isScrolled 
                  ? 'bg-[#F8FAFB] text-[#1E272E] hover:bg-[#E8ECEF]' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              data-testid="language-toggle"
            >
              <Globe className="w-4 h-4" />
              {lang === "en" ? "ES" : "EN"}
            </button>

            {/* CTA Button */}
            <a
              href="#hero"
              onClick={(e) => { e.preventDefault(); scrollTo("hero"); }}
              className="hidden md:flex btn-primary !py-3 !px-6"
              data-testid="header-cta"
            >
              {t.nav.contact}
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 ${isScrolled ? 'text-[#1E272E]' : 'text-white'}`}
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t py-4 -mx-6 px-6" data-testid="mobile-menu">
            {['services', 'about', 'testimonials', 'faq'].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item)}
                className="block w-full text-left py-3 text-[#1E272E] font-medium hover:text-[#2ED573]"
              >
                {t.nav[item]}
              </button>
            ))}
            <button onClick={() => scrollTo("hero")} className="btn-primary w-full mt-4">
              {t.nav.contact}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

// Hero Section
const HeroSection = ({ t }) => {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", service_type: "", message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`${API}/contact`, formData);
      toast.success(t.form.success);
      setFormData({ name: "", email: "", phone: "", service_type: "", message: "" });
    } catch (error) {
      toast.error(t.form.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="hero" className="hero" data-testid="hero-section">
      <div 
        className="hero-bg"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=2070&q=80')` }}
      />
      <div className="hero-overlay" />
      
      <div className="container relative z-10 py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-white animate-fade-in-up">
            <p className="overline !text-[#2ED573] mb-4">{t.hero.tagline}</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              {t.hero.title}{" "}
              <span className="text-[#2ED573]">{t.hero.titleHighlight}</span>{" "}
              {t.hero.titleEnd}
            </h1>
            <p className="text-lg text-white/70 mb-8 max-w-lg">{t.hero.subtitle}</p>
            
            <div className="flex flex-wrap gap-4 mb-12">
              <a href="tel:+573044072499" className="btn-primary" data-testid="hero-phone-btn">
                <Phone className="w-5 h-5" />
                +57 304 407 2499
              </a>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: <Users className="w-5 h-5" />, title: t.hero.features.professional, desc: t.hero.features.professionalDesc },
                { icon: <Clock className="w-5 h-5" />, title: t.hero.features.onTime, desc: t.hero.features.onTimeDesc },
                { icon: <CheckCircle className="w-5 h-5" />, title: t.hero.features.transparent, desc: t.hero.features.transparentDesc },
                { icon: <Leaf className="w-5 h-5" />, title: t.hero.features.eco, desc: t.hero.features.ecoDesc },
              ].map((f, i) => (
                <div key={i} className="text-center md:text-left">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-[#2ED573] mb-2">
                    {f.icon}
                  </div>
                  <h4 className="text-sm font-semibold text-white">{f.title}</h4>
                  <p className="text-xs text-white/50">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="form-card animate-fade-in-up delay-200" data-testid="contact-form">
            <h3 className="text-xl font-bold text-[#1E272E] mb-6">{t.form.title}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder={t.form.name}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  required
                  data-testid="form-name"
                />
                <input
                  type="email"
                  placeholder={t.form.email}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  required
                  data-testid="form-email"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder={t.form.phone}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input"
                  required
                  data-testid="form-phone"
                />
                <Select
                  value={formData.service_type}
                  onValueChange={(v) => setFormData({ ...formData, service_type: v })}
                >
                  <SelectTrigger className="form-input h-auto" data-testid="form-service">
                    <SelectValue placeholder={t.form.service} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(t.form.serviceOptions).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <textarea
                placeholder={t.form.message}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="form-input min-h-[80px] resize-none"
                data-testid="form-message"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full disabled:opacity-50"
                data-testid="form-submit"
              >
                {isSubmitting ? "..." : t.form.submit}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// Stats Section
const StatsSection = ({ t }) => {
  const stats = [
    { value: "10", suffix: "Y", label: t.stats.experience },
    { value: "20", suffix: "K", label: t.stats.services },
    { value: "4.9", suffix: "*", label: t.stats.rating, icon: <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> },
    { value: "1.1", suffix: "M", label: t.stats.customers },
  ];

  return (
    <section className="section bg-white border-y border-[#E8ECEF]" data-testid="stats-section">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-number flex items-center justify-center gap-1">
                {s.value}<span className="text-[#7BED9F]">{s.suffix}</span>
                {s.icon}
              </div>
              <p className="stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Services Section
const ServicesSection = ({ t }) => {
  const services = [
    { icon: <Home className="w-6 h-6" />, ...t.services.items.residential },
    { icon: <Building2 className="w-6 h-6" />, ...t.services.items.commercial },
    { icon: <Truck className="w-6 h-6" />, ...t.services.items.moveInOut },
    { icon: <Sparkles className="w-6 h-6" />, ...t.services.items.deep },
    { icon: <Grid3X3 className="w-6 h-6" />, ...t.services.items.curtains },
    { icon: <Car className="w-6 h-6" />, ...t.services.items.furniture },
  ];

  return (
    <section id="services" className="section section-gray" data-testid="services-section">
      <div className="container">
        <div className="text-center mb-16">
          <p className="overline mb-3">{t.services.tagline}</p>
          <h2 className="heading-md">
            {t.services.title} <span className="text-[#2ED573]">{t.services.titleHighlight}</span> {t.services.titleEnd}
          </h2>
          <p className="text-[#57606F] mt-4 max-w-2xl mx-auto">{t.services.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div key={i} className="service-card" data-testid={`service-card-${i}`}>
              <div className="service-icon">{s.icon}</div>
              <h3 className="text-lg font-bold text-[#1E272E] mb-2">{s.title}</h3>
              <p className="text-[#57606F] text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Why Choose Us Section
const WhyChooseUsSection = ({ t }) => {
  const features = [
    { icon: <Shield className="w-5 h-5" />, ...t.whyUs.features.insured },
    { icon: <Calendar className="w-5 h-5" />, ...t.whyUs.features.flexible },
    { icon: <Leaf className="w-5 h-5" />, ...t.whyUs.features.eco },
    { icon: <Award className="w-5 h-5" />, ...t.whyUs.features.guarantee },
  ];

  return (
    <section id="about" className="section" data-testid="why-us-section">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Professional cleaner"
              className="rounded-2xl shadow-xl w-full object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-[#2ED573] text-white p-6 rounded-2xl shadow-lg hidden md:block">
              <p className="text-3xl font-extrabold">10+</p>
              <p className="text-sm text-white/80">{t.stats.experience}</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="overline mb-3">{t.whyUs.tagline}</p>
            <h2 className="heading-md mb-4">
              {t.whyUs.title} <span className="text-[#2ED573]">{t.whyUs.titleHighlight}</span> {t.whyUs.titleEnd}
            </h2>
            <p className="text-[#57606F] mb-8">{t.whyUs.subtitle}</p>

            <div className="space-y-6">
              {features.map((f, i) => (
                <div key={i} className="feature-item" data-testid={`feature-${i}`}>
                  <div className="w-10 h-10 rounded-lg bg-[#2ED573]/10 flex items-center justify-center text-[#2ED573]">
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1E272E] mb-1">{f.title}</h4>
                    <p className="text-sm text-[#57606F]">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorksSection = ({ t }) => {
  const steps = [
    { icon: <FileText className="w-6 h-6" />, num: "01", ...t.howItWorks.steps.quote },
    { icon: <CalendarCheck className="w-6 h-6" />, num: "02", ...t.howItWorks.steps.book },
    { icon: <Smile className="w-6 h-6" />, num: "03", ...t.howItWorks.steps.relax },
  ];

  return (
    <section className="section section-dark" data-testid="how-it-works-section">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="overline !text-[#7BED9F] mb-3">{t.howItWorks.tagline}</p>
            <h2 className="heading-md !text-white mb-4">
              {t.howItWorks.title} <span className="text-[#2ED573]">{t.howItWorks.titleHighlight}</span> {t.howItWorks.titleEnd}
            </h2>
            <p className="text-white/60 mb-10">{t.howItWorks.subtitle}</p>

            <div className="space-y-8">
              {steps.map((s, i) => (
                <div key={i} className="flex gap-5" data-testid={`step-${i}`}>
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[#2ED573]/20 flex items-center justify-center text-[#2ED573]">
                    {s.icon}
                  </div>
                  <div>
                    <span className="text-[#2ED573] text-sm font-bold">{s.num}</span>
                    <h4 className="font-bold text-white text-lg">{s.title}</h4>
                    <p className="text-white/50 text-sm">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/573044072499"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-10"
              data-testid="how-it-works-cta"
            >
              {t.howItWorks.cta}
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="hidden lg:block">
            <img
              src="https://images.pexels.com/photos/4107120/pexels-photo-4107120.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Cleaning service"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection = ({ t }) => (
  <section id="testimonials" className="section section-gray" data-testid="testimonials-section">
    <div className="container">
      <div className="text-center mb-16">
        <p className="overline mb-3">{t.testimonials.tagline}</p>
        <h2 className="heading-md">
          {t.testimonials.title} <span className="text-[#2ED573]">{t.testimonials.titleHighlight}</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {t.testimonials.items.map((item, i) => (
          <div key={i} className="testimonial-card" data-testid={`testimonial-${i}`}>
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
            <p className="text-[#57606F] mb-6 text-sm leading-relaxed">"{item.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2ED573] flex items-center justify-center text-white font-bold">
                {item.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-[#1E272E] text-sm">{item.name}</p>
                <p className="text-xs text-[#A4B0BE]">{item.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// FAQ Section
const FAQSection = ({ t }) => (
  <section id="faq" className="section" data-testid="faq-section">
    <div className="container">
      <div className="text-center mb-16">
        <p className="overline mb-3">{t.faq.tagline}</p>
        <h2 className="heading-md">{t.faq.title}</h2>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-3">
          {t.faq.items.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="faq-item"
              data-testid={`faq-item-${i}`}
            >
              <AccordionTrigger className="faq-trigger hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 text-[#57606F] text-sm">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </section>
);

// CTA Section
const CTASection = ({ t }) => (
  <section className="cta-section section" data-testid="cta-section">
    <div className="cta-pattern" />
    <div className="container relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-white">
          <p className="text-sm font-bold tracking-widest text-white/70 mb-3">{t.cta.tagline}</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
            {t.cta.title} <span className="text-[#1E272E]">{t.cta.titleHighlight}</span> {t.cta.titleEnd}
          </h2>
          <p className="text-white/80 mb-8">{t.cta.subtitle}</p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://wa.me/573044072499"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#2ED573] hover:bg-[#1E272E] hover:text-white px-8 py-4 rounded-lg font-semibold transition-all"
              data-testid="cta-book"
            >
              {t.cta.primaryBtn}
            </a>
            <a
              href="tel:+573044072499"
              className="border-2 border-white text-white hover:bg-white hover:text-[#2ED573] px-8 py-4 rounded-lg font-semibold transition-all flex items-center gap-2"
              data-testid="cta-call"
            >
              <Phone className="w-5 h-5" />
              +57 304 407 2499
            </a>
          </div>
        </div>
        <div className="hidden lg:block">
          <img
            src="https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Cleaning professional"
            className="rounded-2xl shadow-2xl"
          />
        </div>
      </div>
    </div>
  </section>
);

// Footer
const Footer = ({ t }) => (
  <footer className="bg-[#1E272E] text-white py-16" data-testid="footer">
    <div className="container">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <Logo light />
          <p className="text-white/50 text-sm mt-4 leading-relaxed">{t.footer.description}</p>
        </div>
        <div>
          <h4 className="font-bold mb-4">{t.footer.services}</h4>
          <ul className="space-y-2">
            {t.footer.serviceList.map((s, i) => (
              <li key={i}>
                <a href="#services" className="text-white/50 text-sm hover:text-[#2ED573] transition-colors">{s}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">{t.footer.contact}</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3 text-white/50">
              <Phone className="w-4 h-4 text-[#2ED573]" />+57 304 407 2499
            </li>
            <li className="flex items-center gap-3 text-white/50">
              <Mail className="w-4 h-4 text-[#2ED573]" />dekoraclean@hotmail.com
            </li>
            <li className="flex items-start gap-3 text-white/50">
              <MapPin className="w-4 h-4 text-[#2ED573] mt-0.5" />Calle 19 No.96 G - 76 - Int. 7, Colombia
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">{t.footer.hours}</h4>
          <div className="flex items-center gap-3 text-white/50 text-sm">
            <Clock className="w-4 h-4 text-[#2ED573]" />{t.footer.hoursText}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/40 text-sm">
        © {new Date().getFullYear()} Dekora Clean S.A.S. {t.footer.rights}
      </div>
    </div>
  </footer>
);

// WhatsApp Float
const WhatsAppFloat = () => (
  <a
    href="https://wa.me/573044072499"
    target="_blank"
    rel="noopener noreferrer"
    className="whatsapp-btn animate-pulse-ring"
    data-testid="whatsapp-float"
    aria-label="WhatsApp"
  >
    <WhatsAppIcon className="w-7 h-7" />
  </a>
);

// Main App
function App() {
  const [lang, setLang] = useState("es");
  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <div className="App">
        <Toaster position="top-right" richColors />
        <Header t={t} lang={lang} setLang={setLang} />
        <main>
          <HeroSection t={t} />
          <StatsSection t={t} />
          <ServicesSection t={t} />
          <WhyChooseUsSection t={t} />
          <HowItWorksSection t={t} />
          <TestimonialsSection t={t} />
          <FAQSection t={t} />
          <CTASection t={t} />
        </main>
        <Footer t={t} />
        <WhatsAppFloat />
      </div>
    </LanguageContext.Provider>
  );
}

export default App;
