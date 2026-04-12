import { useEffect } from "react";
import { Linkedin, Github, ExternalLink } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import PresenceWidget from "./PresenceWidget";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const socialLinks = [
  {
    name: "LinkedIn",
    displayName: "Let's Connect",
    subText: "on LinkedIn",
    icon: Linkedin,
    url: "https://www.linkedin.com/in/luis-esteban-castillo-pedroza",
    color: "#0A66C2",
    gradient: "from-[#0A66C2] to-[#0077B5]",
    isPrimary: true,
  },
  {
    name: "GitHub",
    displayName: "GitHub",
    subText: "@lxiscxstillo",
    icon: Github,
    url: "https://github.com/lxiscxstillo",
    color: "#ffffff",
    gradient: "from-[#333] to-[#24292e]",
  },
];

const SocialLinks = () => {
  const linkedIn = socialLinks.find((link) => link.isPrimary);
  const github = socialLinks.find((link) => link.name === "GitHub");
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { t } = useLanguage();

  // GitHub icon is white by default — make it dark in light mode
  const githubIconColor = isLight ? '#1e293b' : github.color;

  useEffect(() => {
    AOS.init({ offset: 10 });
  }, []);

  return (
    <div
      className="w-full rounded-2xl p-6 py-8 backdrop-blur-xl"
      style={isLight ? {
        background: 'rgba(255,255,255,0.85)',
        border: '1px solid rgba(99,102,241,0.12)',
        boxShadow: '0 4px 24px rgba(99,102,241,0.07)',
      } : {
        background: 'linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.05))',
      }}
    >
      <h3
        className="text-xl font-semibold mb-6 flex items-center gap-2"
        style={{ color: isLight ? '#0f172a' : '#ffffff' }}
        data-aos="fade-down"
      >
        <span
          className="inline-block w-8 h-1 rounded-full"
          style={{ background: isLight ? '#4f46e5' : '#ffffff' }}
        />
        {t('testimonials.connect')}
      </h3>

      <div className="flex flex-col gap-4">
        {/* LinkedIn — Primary */}
        <a
          href={linkedIn.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-between p-4 rounded-lg
                     bg-white/5 border border-white/10 overflow-hidden
                     hover:border-white/20 transition-all duration-500"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500
                       bg-gradient-to-r ${linkedIn.gradient}`}
          />

          <div className="relative flex items-center gap-4">
            <div className="relative flex items-center justify-center">
              <div
                className="absolute inset-0 opacity-20 rounded-md transition-all duration-500
                               group-hover:scale-110 group-hover:opacity-30"
                style={{ backgroundColor: linkedIn.color }}
              />
              <div className="relative p-2 rounded-md">
                <linkedIn.icon
                  className="w-6 h-6 transition-all duration-500 group-hover:scale-105"
                  style={{ color: linkedIn.color }}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <span
                className="text-lg font-bold pt-[0.2rem] tracking-tight leading-none transition-colors duration-300"
                style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}
              >
                {linkedIn.displayName}
              </span>
              <span
                className="text-sm transition-colors duration-300"
                style={{ color: isLight ? '#64748b' : '#94a3b8' }}
              >
                {linkedIn.subText}
              </span>
            </div>
          </div>

          <ExternalLink
            className="relative w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 -translate-x-1"
            style={{ color: isLight ? '#4f46e5' : '#ffffff' }}
          />

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                               translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
            />
          </div>
        </a>

        {/* GitHub */}
        <a
          href={github.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-3 p-4 rounded-xl
                     bg-white/5 border border-white/10 overflow-hidden
                     hover:border-white/20 transition-all duration-500"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500
                         bg-gradient-to-r ${github.gradient}`}
          />

          <div className="relative flex items-center justify-center">
            <div
              className="absolute inset-0 opacity-20 rounded-lg transition-all duration-500 group-hover:scale-125 group-hover:opacity-30"
              style={{ backgroundColor: githubIconColor }}
            />
            <div className="relative p-2 rounded-lg">
              <github.icon
                className="w-5 h-5 transition-all duration-500 group-hover:scale-110"
                style={{ color: githubIconColor }}
              />
            </div>
          </div>

          <div className="flex flex-col min-w-0">
            <span
              className="text-sm font-bold transition-colors duration-300"
              style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}
            >
              {github.displayName}
            </span>
            <span
              className="text-xs truncate transition-colors duration-300"
              style={{ color: isLight ? '#64748b' : '#94a3b8' }}
            >
              {github.subText}
            </span>
          </div>

          <ExternalLink
            className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 -translate-x-2"
            style={{ color: isLight ? '#4f46e5' : '#ffffff' }}
          />

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                           translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
            />
          </div>
        </a>

        <PresenceWidget />
      </div>
    </div>
  );
};

export default SocialLinks;
