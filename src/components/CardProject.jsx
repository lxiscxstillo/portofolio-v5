import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, ArrowRight } from "lucide-react";
import { toSlug } from "../utils/slug";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const CardProject = ({ Img, Title, Description, Link: ProjectLink, id }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { t } = useLanguage();

  const handleLiveDemo = (e) => {
    if (!ProjectLink) {
      e.preventDefault();
      alert(t('project.no_demo_alert'));
    }
  };

  const handleDetails = (e) => {
    if (!id) {
      e.preventDefault();
      alert(t('project.no_details_alert'));
    }
  };

  return (
    <div className="group relative w-full">
      <div
        className="relative overflow-hidden rounded-xl backdrop-blur-lg transition-all duration-300"
        style={isLight ? {
          background: 'rgba(255, 255, 255, 0.92)',
          border: '1px solid rgba(99, 102, 241, 0.12)',
          boxShadow: '0 4px 24px rgba(15, 23, 42, 0.08), 0 1px 4px rgba(15, 23, 42, 0.05)',
        } : {
          background: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.9) 100%)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        <div
          className="absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity duration-300"
          style={{
            background: isLight
              ? 'linear-gradient(135deg, rgba(99,102,241,0.04) 0%, rgba(139,92,246,0.04) 50%, rgba(236,72,153,0.03) 100%)'
              : 'linear-gradient(135deg, rgba(59,130,246,0.10) 0%, rgba(139,92,246,0.10) 50%, rgba(236,72,153,0.10) 100%)',
          }}
        />

        <div className="relative p-5 z-10">
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={Img}
              alt={Title}
              className="w-full h-full object-cover aspect-[16/8] transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="mt-4 space-y-3">
            <h3
              className="text-xl font-semibold"
              style={isLight ? {
                background: 'linear-gradient(90deg, #4f46e5, #7c3aed, #be185d)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              } : {
                background: 'linear-gradient(90deg, #bfdbfe, #ddd6fe, #fbcfe8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {Title}
            </h3>

            <p
              className="text-sm leading-relaxed line-clamp-2"
              style={{ color: isLight ? '#475569' : 'rgba(203,213,225,0.80)' }}
            >
              {Description}
            </p>

            <div className="pt-4 flex items-center justify-between">
              {ProjectLink ? (
                <a
                  href={ProjectLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLiveDemo}
                  className="inline-flex items-center space-x-2 transition-colors duration-200"
                  style={{ color: isLight ? '#4f46e5' : '#60a5fa' }}
                >
                  <span className="text-sm font-medium">{t('project.demo')}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <span className="text-sm" style={{ color: isLight ? '#94a3b8' : '#6b7280' }}>
                  {t('project.demo_unavailable')}
                </span>
              )}

              {id ? (
                <Link
                  to={`/project/${toSlug(Title)}`}
                  onClick={handleDetails}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none"
                  style={isLight ? {
                    background: 'rgba(99,102,241,0.08)',
                    color: '#4f46e5',
                    border: '1px solid rgba(99,102,241,0.18)',
                  } : {
                    background: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.90)',
                    border: '1px solid rgba(255,255,255,0.10)',
                  }}
                >
                  <span className="text-sm font-medium">{t('project.details')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="text-sm" style={{ color: isLight ? '#94a3b8' : '#6b7280' }}>
                  {t('project.details_unavailable')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProject;
