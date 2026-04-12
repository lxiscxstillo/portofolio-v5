import React, { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");

    const { lang, toggleLang, t } = useLanguage();
    const { theme, toggleTheme } = useTheme();

    const navItems = [
        { href: "#Home",         labelKey: "nav.home" },
        { href: "#About",        labelKey: "nav.about" },
        { href: "#Portofolio",   labelKey: "nav.portfolio" },
        { href: "#GitHub",       labelKey: "nav.github" },
        { href: "#Testimonials", labelKey: "nav.testimonials" },
        { href: "#Contact",      labelKey: "nav.contact" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
            const sections = navItems.map(item => {
                const section = document.querySelector(item.href);
                if (section) {
                    return {
                        id: item.href.replace("#", ""),
                        offset: section.offsetTop - 550,
                        height: section.offsetHeight
                    };
                }
                return null;
            }).filter(Boolean);

            const currentPosition = window.scrollY;
            const active = sections.find(section =>
                currentPosition >= section.offset &&
                currentPosition < section.offset + section.height
            );
            if (active) setActiveSection(active.id);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    }, [isOpen]);

    const scrollToSection = (e, href) => {
        e.preventDefault();
        const section = document.querySelector(href);
        if (section) {
            window.scrollTo({ top: section.offsetTop - 100, behavior: "smooth" });
        }
        setIsOpen(false);
    };

    const isLight = theme === 'light';

    return (
        <nav
            className={`fixed w-full top-0 z-50 transition-all duration-500 border-b ${
                isOpen
                    ? isLight
                        ? "bg-white/95 border-black/10"
                        : "bg-[#0A0A0A] border-white/10"
                    : scrolled
                    ? isLight
                        ? "bg-white/80 backdrop-blur-xl border-black/10"
                        : "bg-[#0A0A0A]/80 backdrop-blur-xl border-white/10"
                    : isLight
                        ? "bg-white/60 backdrop-blur-md border-black/5"
                        : "bg-[#0A0A0A]/60 backdrop-blur-md border-white/5"
            }`}
        >
            <div className="mx-auto px-[5%] sm:px-[5%] lg:px-[10%]">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a
                            href="#Home"
                            onClick={(e) => scrollToSection(e, "#Home")}
                            className={`text-xl font-bold bg-gradient-to-r ${
                                isLight
                                    ? "from-[#111827] to-[#374151]"
                                    : "from-[#ffffff] to-[#e5e7eb]"
                            } bg-clip-text text-transparent`}
                        >
                            Luis Castillo
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-3">
                        <div className="flex items-center space-x-6">
                            {navItems.map((item) => (
                                <a
                                    key={item.labelKey}
                                    href={item.href}
                                    onClick={(e) => scrollToSection(e, item.href)}
                                    className="group relative px-1 py-2 text-sm font-medium"
                                >
                                    <span
                                        className={`relative z-10 transition-colors duration-300 ${
                                            activeSection === item.href.substring(1)
                                                ? isLight
                                                    ? "text-gray-900 font-semibold"
                                                    : "bg-gradient-to-r from-[#ffffff] to-[#e5e7eb] bg-clip-text text-transparent font-semibold"
                                                : isLight
                                                    ? "text-gray-600 group-hover:text-gray-900"
                                                    : "text-gray-300 group-hover:text-white"
                                        }`}
                                    >
                                        {t(item.labelKey)}
                                    </span>
                                    <span
                                        className={`absolute bottom-0 left-0 w-full h-0.5 transform origin-left transition-transform duration-300 ${
                                            isLight ? "bg-gray-900" : "bg-gradient-to-r from-[#ffffff] to-[#e5e7eb]"
                                        } ${
                                            activeSection === item.href.substring(1)
                                                ? "scale-x-100"
                                                : "scale-x-0 group-hover:scale-x-100"
                                        }`}
                                    />
                                </a>
                            ))}
                        </div>

                        {/* Language + Theme controls */}
                        <div className="flex items-center gap-2 ml-2">
                            <button
                                onClick={toggleLang}
                                title={lang === 'en' ? t('nav.toggle_lang_to_es') : t('nav.toggle_lang_to_en')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all duration-200 cursor-pointer select-none ${
                                    isLight
                                        ? "border-black/15 text-gray-700 hover:bg-black/5"
                                        : "border-white/15 text-gray-300 hover:bg-white/10"
                                }`}
                            >
                                {lang === 'en' ? 'ES' : 'EN'}
                            </button>

                            <button
                                onClick={toggleTheme}
                                title={theme === 'dark' ? t('nav.toggle_theme_to_light') : t('nav.toggle_theme_to_dark')}
                                className={`p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                                    isLight
                                        ? "border-black/15 text-gray-700 hover:bg-black/5"
                                        : "border-white/15 text-gray-300 hover:bg-white/10"
                                }`}
                            >
                                {theme === 'dark'
                                    ? <Sun className="w-4 h-4" />
                                    : <Moon className="w-4 h-4" />
                                }
                            </button>
                        </div>
                    </div>

                    {/* Mobile: controls + hamburger */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={toggleLang}
                            className={`px-2 py-1 rounded-md text-xs font-bold border transition-all cursor-pointer ${
                                isLight ? "border-black/15 text-gray-700" : "border-white/15 text-gray-300"
                            }`}
                        >
                            {lang === 'en' ? 'ES' : 'EN'}
                        </button>
                        <button
                            onClick={toggleTheme}
                            className={`p-1.5 rounded-md border transition-all cursor-pointer ${
                                isLight ? "border-black/15 text-gray-700" : "border-white/15 text-gray-300"
                            }`}
                        >
                            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`relative p-2 transition-transform duration-300 ease-in-out transform ${
                                isLight ? "text-gray-700" : "text-gray-300 hover:text-white"
                            } ${isOpen ? "rotate-90 scale-125" : "rotate-0 scale-100"}`}
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                }`}
            >
                <div className="px-4 py-6 space-y-4">
                    {navItems.map((item, index) => (
                        <a
                            key={item.labelKey}
                            href={item.href}
                            onClick={(e) => scrollToSection(e, item.href)}
                            className={`block px-4 py-3 text-lg font-medium transition-all duration-300 ease ${
                                activeSection === item.href.substring(1)
                                    ? isLight
                                        ? "text-gray-900 font-semibold"
                                        : "bg-gradient-to-r from-[#ffffff] to-[#e5e7eb] bg-clip-text text-transparent font-semibold"
                                    : isLight
                                        ? "text-gray-600 hover:text-gray-900"
                                        : "text-gray-300 hover:text-white"
                            }`}
                            style={{
                                transitionDelay: `${index * 100}ms`,
                                transform: isOpen ? "translateX(0)" : "translateX(50px)",
                                opacity: isOpen ? 1 : 0,
                            }}
                        >
                            {t(item.labelKey)}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
