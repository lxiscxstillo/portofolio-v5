import React from "react";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const quickLinks = [
    { href: "#Home",       labelKey: "nav.home" },
    { href: "#About",      labelKey: "nav.about" },
    { href: "#Portofolio",   labelKey: "nav.portfolio" },
    { href: "#Testimonials", labelKey: "nav.testimonials" },
    { href: "#Contact",      labelKey: "nav.contact" },
  ];

  const socialLinks = [
    {
      href: "https://github.com/lxiscxstillo",
      label: "GitHub",
      icon: Github,
    },
    {
      href: "https://www.linkedin.com/in/luis-esteban-castillo-pedroza",
      label: "LinkedIn",
      icon: Linkedin,
    },
    {
      href: "mailto:luisestebancastillopedroza90@gmail.com",
      label: "Email",
      icon: Mail,
    },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const section = document.querySelector(href);
    if (section) {
      window.scrollTo({ top: section.offsetTop - 100, behavior: "smooth" });
    }
  };

  const borderColor = isLight ? "border-black/10" : "border-white/10";
  const textPrimary = isLight ? "text-gray-900" : "text-white";
  const textSecondary = isLight ? "text-gray-600" : "text-gray-400";
  const textMuted = isLight ? "text-gray-500" : "text-gray-500";
  const hoverText = isLight ? "hover:text-gray-900" : "hover:text-white";
  const iconBg = isLight
    ? "bg-black/5 border-black/10 hover:bg-black/10"
    : "bg-white/5 border-white/10 hover:bg-white/10";

  return (
    <footer
      className={`relative z-10 w-full border-t ${borderColor} mt-10 ${
        isLight ? "bg-white" : "bg-[#0A0A0A]"
      }`}
      role="contentinfo"
    >
      <div className="px-[5%] sm:px-[5%] lg:px-[10%] py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand column */}
          <div className="space-y-4">
            <a
              href="#Home"
              onClick={(e) => scrollToSection(e, "#Home")}
              className={`text-xl font-bold ${textPrimary} hover:opacity-80 transition-opacity`}
            >
              Luis Castillo
            </a>
            <p className={`text-sm leading-relaxed ${textSecondary} max-w-xs`}>
              {t("footer.tagline")}
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`p-2.5 rounded-xl border transition-all duration-300 ${iconBg}`}
                >
                  <Icon className={`w-4 h-4 ${textPrimary}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links column */}
          <div className="space-y-4">
            <h3 className={`text-sm font-semibold uppercase tracking-widest ${textMuted}`}>
              {t("footer.quick_links")}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map(({ href, labelKey }) => (
                <li key={labelKey}>
                  <a
                    href={href}
                    onClick={(e) => scrollToSection(e, href)}
                    className={`inline-flex items-center gap-1.5 text-sm ${textSecondary} ${hoverText} transition-colors duration-200 group`}
                  >
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200 opacity-0 group-hover:opacity-100">
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                    {t(labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect column */}
          <div className="space-y-4">
            <h3 className={`text-sm font-semibold uppercase tracking-widest ${textMuted}`}>
              {t("footer.connect")}
            </h3>
            <ul className="space-y-2">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 text-sm ${textSecondary} ${hoverText} transition-colors duration-200`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`pt-6 border-t ${borderColor} flex flex-col sm:flex-row items-center justify-between gap-3`}>
          <span className={`text-sm ${textMuted}`}>
            © {currentYear}{" "}
            <a
              href="https://lxiscxstillo.vercel.app"
              className={`${hoverText} transition-colors underline-offset-4 hover:underline`}
            >
              Luis Castillo™
            </a>
            {". "}
            {t("footer.rights")}
          </span>
          <span className={`text-xs ${textMuted}`}>
            {t("footer.role")}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
