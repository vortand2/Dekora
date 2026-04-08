import { useState, useEffect, createContext, useContext } from "react";
import "@/App.css";
import axios from "axios";
import { translations } from "./i18n/translations";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Star, 
  ChevronDown,
  Home,
  Building2,
  Sparkles,
  Truck,
  Sofa,
  Car,
  Shield,
  Calendar,
  Leaf,
  Award,
  ClipboardList,
  CalendarCheck,
  PartyPopper,
  Globe,
  Menu,
  X
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

// WhatsApp Icon Component
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Header Component
const Header = ({ t, lang, setLang }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      data-testid="header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 header-blur shadow-sm border-b border-stone-200"
          : "bg-transparent"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2" data-testid="logo">
            <div className="flex items-center gap-1">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
                <div className="w-3 h-3 bg-orange-400 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
              </div>
              <span className={`text-xl sm:text-2xl font-bold ml-2 ${isScrolled ? 'text-stone-900' : 'text-white'}`}>
                Dekora <span className="text-blue-600">Clean</span>
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("services")}
              className={`nav-link ${isScrolled ? 'text-stone-600' : 'text-white/90 hover:text-white'}`}
              data-testid="nav-services"
            >
              {t.nav.services}
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className={`nav-link ${isScrolled ? 'text-stone-600' : 'text-white/90 hover:text-white'}`}
              data-testid="nav-about"
            >
              {t.nav.about}
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className={`nav-link ${isScrolled ? 'text-stone-600' : 'text-white/90 hover:text-white'}`}
              data-testid="nav-testimonials"
            >
              {t.nav.testimonials}
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className={`nav-link ${isScrolled ? 'text-stone-600' : 'text-white/90 hover:text-white'}`}
              data-testid="nav-faq"
            >
              {t.nav.faq}
            </button>
          </nav>

          {/* Right side - Language & CTA */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "en" ? "es" : "en")}
              className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all ${
                isScrolled 
                  ? 'border-stone-200 hover:border-blue-600 text-stone-700' 
                  : 'border-white/30 hover:border-white text-white'
              }`}
              data-testid="language-toggle"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{lang === "en" ? "ES" : "EN"}</span>
            </button>

            {/* CTA Button - Desktop */}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("hero");
              }}
              className="hidden sm:flex btn-primary !py-3 !px-6"
              data-testid="header-cta"
            >
              {t.nav.contact}
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 ${isScrolled ? 'text-stone-900' : 'text-white'}`}
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-stone-200 py-4" data-testid="mobile-menu">
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => scrollToSection("services")}
                className="px-4 py-3 text-left text-stone-700 hover:bg-stone-50"
              >
                {t.nav.services}
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="px-4 py-3 text-left text-stone-700 hover:bg-stone-50"
              >
                {t.nav.about}
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="px-4 py-3 text-left text-stone-700 hover:bg-stone-50"
              >
                {t.nav.testimonials}
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="px-4 py-3 text-left text-stone-700 hover:bg-stone-50"
              >
                {t.nav.faq}
              </button>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("hero");
                }}
                className="mx-4 mt-2 btn-primary !py-3"
              >
                {t.nav.contact}
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// Hero Section with Contact Form
const HeroSection = ({ t }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service_type: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${API}/contact`, formData);
      toast.success(t.form.success);
      setFormData({ name: "", email: "", phone: "", service_type: "", message: "" });
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(t.form.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-20"
      data-testid="hero-section"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=2070&q=80')`,
        }}
      >
        <div className="absolute inset-0 hero-overlay"></div>
      </div>

      <div className="container-custom relative z-10 py-12 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-white animate-fade-in-up">
            <p className="text-sm sm:text-base font-semibold tracking-widest text-blue-400 mb-4">
              {t.hero.tagline}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {t.hero.title}{" "}
              <span className="text-blue-400">{t.hero.titleHighlight}</span>{" "}
              {t.hero.titleEnd}
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-lg">
              {t.hero.subtitle}
            </p>
            <a
              href="tel:+573044072499"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-medium transition-all hover:-translate-y-1"
              data-testid="hero-phone-btn"
            >
              <Phone className="w-5 h-5" />
              +57 304 407 2499
            </a>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
              {[
                { icon: <Shield className="w-5 h-5" />, title: t.hero.features.professional, desc: t.hero.features.professionalDesc },
                { icon: <Clock className="w-5 h-5" />, title: t.hero.features.onTime, desc: t.hero.features.onTimeDesc },
                { icon: <CheckCircle2 className="w-5 h-5" />, title: t.hero.features.transparent, desc: t.hero.features.transparentDesc },
                { icon: <Leaf className="w-5 h-5" />, title: t.hero.features.eco, desc: t.hero.features.ecoDesc },
              ].map((feature, idx) => (
                <div key={idx} className="text-center sm:text-left">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-blue-400 mb-2">
                    {feature.icon}
                  </div>
                  <h4 className="text-sm font-semibold text-white">{feature.title}</h4>
                  <p className="text-xs text-white/60">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Contact Form */}
          <div className="hero-form animate-fade-in-up animation-delay-200" data-testid="contact-form">
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-6">{t.form.title}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
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
              <div className="grid sm:grid-cols-2 gap-4">
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
                  onValueChange={(value) => setFormData({ ...formData, service_type: value })}
                >
                  <SelectTrigger className="form-input !p-3" data-testid="form-service">
                    <SelectValue placeholder={t.form.service} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">{t.form.serviceOptions.residential}</SelectItem>
                    <SelectItem value="commercial">{t.form.serviceOptions.commercial}</SelectItem>
                    <SelectItem value="deep">{t.form.serviceOptions.deep}</SelectItem>
                    <SelectItem value="curtains">{t.form.serviceOptions.curtains}</SelectItem>
                    <SelectItem value="carpets">{t.form.serviceOptions.carpets}</SelectItem>
                    <SelectItem value="furniture">{t.form.serviceOptions.furniture}</SelectItem>
                    <SelectItem value="upholstery">{t.form.serviceOptions.upholstery}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <textarea
                placeholder={t.form.message}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="form-input min-h-[100px] resize-none"
                data-testid="form-message"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
    { value: "10+", label: t.stats.experience },
    { value: "2K+", label: t.stats.services },
    { value: "4.9", label: t.stats.rating, suffix: <Star className="w-5 h-5 text-yellow-500 inline ml-1" /> },
    { value: "1.5K+", label: t.stats.customers },
  ];

  return (
    <section className="py-12 bg-white border-y border-stone-200" data-testid="stats-section">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="stat-number">
                {stat.value}
                {stat.suffix}
              </div>
              <p className="text-stone-600 text-sm sm:text-base mt-1">{stat.label}</p>
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
    { icon: <Home className="w-8 h-8" />, ...t.services.items.residential },
    { icon: <Building2 className="w-8 h-8" />, ...t.services.items.commercial },
    { icon: <Truck className="w-8 h-8" />, ...t.services.items.moveInOut },
    { icon: <Sparkles className="w-8 h-8" />, ...t.services.items.deep },
    { icon: <Sofa className="w-8 h-8" />, ...t.services.items.curtains },
    { icon: <Car className="w-8 h-8" />, ...t.services.items.furniture },
  ];

  return (
    <section id="services" className="section-padding bg-stone-50" data-testid="services-section">
      <div className="container-custom">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-sm font-bold tracking-widest text-blue-600 mb-3">
            {t.services.tagline}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mb-4">
            {t.services.title}{" "}
            <span className="text-blue-600">{t.services.titleHighlight}</span>{" "}
            {t.services.titleEnd}
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">{t.services.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="card-hover p-6 sm:p-8"
              data-testid={`service-card-${idx}`}
            >
              <div className="service-icon">{service.icon}</div>
              <h3 className="text-xl font-semibold text-stone-900 mb-3">{service.title}</h3>
              <p className="text-stone-600">{service.desc}</p>
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
    { icon: <Shield className="w-6 h-6" />, ...t.whyUs.features.insured },
    { icon: <Calendar className="w-6 h-6" />, ...t.whyUs.features.flexible },
    { icon: <Leaf className="w-6 h-6" />, ...t.whyUs.features.eco },
    { icon: <Award className="w-6 h-6" />, ...t.whyUs.features.guarantee },
  ];

  return (
    <section id="about" className="section-padding" data-testid="why-us-section">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/9462192/pexels-photo-9462192.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt="Professional cleaner"
              className="rounded-2xl shadow-2xl w-full object-cover max-h-[500px]"
            />
            <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-2xl hidden sm:block">
              <p className="text-3xl font-bold">10+</p>
              <p className="text-sm text-blue-100">{t.stats.experience}</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-sm font-bold tracking-widest text-blue-600 mb-3">
              {t.whyUs.tagline}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mb-4">
              {t.whyUs.title}{" "}
              <span className="text-blue-600">{t.whyUs.titleHighlight}</span>{" "}
              {t.whyUs.titleEnd}
            </h2>
            <p className="text-stone-600 mb-8">{t.whyUs.subtitle}</p>

            <div className="space-y-6">
              {features.map((feature, idx) => (
                <div key={idx} className="flex gap-4" data-testid={`feature-${idx}`}>
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900 mb-1">{feature.title}</h4>
                    <p className="text-stone-600 text-sm">{feature.desc}</p>
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
    { icon: <ClipboardList className="w-8 h-8" />, num: "01", ...t.howItWorks.steps.quote },
    { icon: <CalendarCheck className="w-8 h-8" />, num: "02", ...t.howItWorks.steps.book },
    { icon: <PartyPopper className="w-8 h-8" />, num: "03", ...t.howItWorks.steps.relax },
  ];

  return (
    <section className="section-padding bg-stone-900 text-white" data-testid="how-it-works-section">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <p className="text-sm font-bold tracking-widest text-blue-400 mb-3">
              {t.howItWorks.tagline}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {t.howItWorks.title}{" "}
              <span className="text-blue-400">{t.howItWorks.titleHighlight}</span>{" "}
              {t.howItWorks.titleEnd}
            </h2>
            <p className="text-stone-400 mb-8">{t.howItWorks.subtitle}</p>

            <div className="space-y-6">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start" data-testid={`step-${idx}`}>
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400">
                    {step.icon}
                  </div>
                  <div>
                    <span className="text-blue-400 text-sm font-bold">{step.num}</span>
                    <h4 className="font-semibold text-white text-lg">{step.title}</h4>
                    <p className="text-stone-400 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/573044072499"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex mt-8 btn-primary"
              data-testid="how-it-works-cta"
            >
              {t.howItWorks.cta}
            </a>
          </div>

          {/* Image */}
          <div className="relative hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=800&q=80"
              alt="Cleaning service"
              className="rounded-2xl shadow-2xl w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection = ({ t }) => {
  return (
    <section id="testimonials" className="section-padding bg-stone-50" data-testid="testimonials-section">
      <div className="container-custom">
        <div className="text-center mb-12">
          <p className="text-sm font-bold tracking-widest text-blue-600 mb-3">
            {t.testimonials.tagline}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900">
            {t.testimonials.title}{" "}
            <span className="text-blue-600">{t.testimonials.titleHighlight}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {t.testimonials.items.map((testimonial, idx) => (
            <div key={idx} className="testimonial-card" data-testid={`testimonial-${idx}`}>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-stone-600 mb-6 italic">"{testimonial.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-stone-900">{testimonial.name}</p>
                  <p className="text-sm text-stone-500">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// FAQ Section
const FAQSection = ({ t }) => {
  return (
    <section id="faq" className="section-padding" data-testid="faq-section">
      <div className="container-custom">
        <div className="text-center mb-12">
          <p className="text-sm font-bold tracking-widest text-blue-600 mb-3">
            {t.faq.tagline}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900">
            {t.faq.title}
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {t.faq.items.map((item, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="bg-white border border-stone-200 rounded-xl px-6 overflow-hidden"
                data-testid={`faq-item-${idx}`}
              >
                <AccordionTrigger className="text-left font-medium text-stone-900 hover:text-blue-600 py-5">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-stone-600 pb-5">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = ({ t }) => {
  return (
    <section className="section-padding bg-blue-600 relative overflow-hidden" data-testid="cta-section">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <p className="text-sm font-bold tracking-widest text-blue-200 mb-3">
              {t.cta.tagline}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {t.cta.title}{" "}
              <span className="text-yellow-400">{t.cta.titleHighlight}</span>{" "}
              {t.cta.titleEnd}
            </h2>
            <p className="text-blue-100 mb-8">{t.cta.subtitle}</p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/573044072499"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full font-medium transition-all flex items-center gap-2"
                data-testid="cta-book"
              >
                {t.cta.primaryBtn}
              </a>
              <a
                href="tel:+573044072499"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-full font-medium transition-all flex items-center gap-2"
                data-testid="cta-call"
              >
                <Phone className="w-5 h-5" />
                +57 304 407 2499
              </a>
            </div>
          </div>

          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1596263373351-e31e9c1a5a24?auto=format&fit=crop&w=600&q=80"
              alt="Cleaning professional"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = ({ t }) => {
  return (
    <footer className="bg-stone-900 text-white py-16" data-testid="footer">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
                <div className="w-3 h-3 bg-orange-400 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
              </div>
              <span className="text-xl font-bold ml-2">
                Dekora <span className="text-blue-400">Clean</span>
              </span>
            </div>
            <p className="text-stone-400 text-sm">{t.footer.description}</p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t.footer.services}</h4>
            <ul className="space-y-2">
              {t.footer.serviceList.map((service, idx) => (
                <li key={idx}>
                  <a href="#services" className="text-stone-400 hover:text-white text-sm transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t.footer.contact}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-stone-400 text-sm">
                <Phone className="w-4 h-4 text-blue-400" />
                +57 304 407 2499
              </li>
              <li className="flex items-center gap-3 text-stone-400 text-sm">
                <Mail className="w-4 h-4 text-blue-400" />
                dekoraclean@hotmail.com
              </li>
              <li className="flex items-start gap-3 text-stone-400 text-sm">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                Calle 19 No.96 G - 76 - Int. 7, Colombia
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t.footer.hours}</h4>
            <div className="flex items-center gap-3 text-stone-400 text-sm">
              <Clock className="w-4 h-4 text-blue-400" />
              {t.footer.hoursText}
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-12 pt-8 text-center text-stone-500 text-sm">
          © {new Date().getFullYear()} Dekora Clean S.A.S. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
};

// WhatsApp Float Button
const WhatsAppFloat = () => {
  return (
    <a
      href="https://wa.me/573044072499"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float animate-pulse-glow"
      data-testid="whatsapp-float"
      aria-label="Contact via WhatsApp"
    >
      <WhatsAppIcon />
    </a>
  );
};

// Main App Component
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
