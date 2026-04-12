import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const TechStackIcon = ({ TechStackIcon, Language, description }) => {
  const [flipped, setFlipped] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const frontBg = isLight
    ? 'linear-gradient(145deg, #ffffff 0%, #f0f4ff 50%, #e8eeff 100%)'
    : 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
  const frontBorder = isLight
    ? '1px solid rgba(99, 102, 241, 0.15)'
    : '1px solid rgba(255,255,255,0.07)';
  const frontShadow = isLight
    ? '0 4px 20px rgba(99, 102, 241, 0.10), 0 1px 4px rgba(15, 23, 42, 0.06)'
    : undefined;

  const backBg = isLight
    ? 'linear-gradient(145deg, #e8eeff 0%, #f0f4ff 50%, #ffffff 100%)'
    : 'linear-gradient(145deg, #0f3460 0%, #16213e 50%, #1a1a2e 100%)';
  const backBorder = isLight
    ? '1px solid rgba(99, 102, 241, 0.18)'
    : '1px solid rgba(255,255,255,0.12)';

  return (
    <div
      className="w-full h-[170px] cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={() => setFlipped(f => !f)}
    >
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 group rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:scale-105"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: frontBg,
            border: frontBorder,
            boxShadow: frontShadow,
          }}
        >
          <img
            src={TechStackIcon}
            alt={`${Language} icon`}
            className="h-16 w-16 md:h-20 md:w-20 object-contain drop-shadow-lg"
          />
          <span
            className="font-semibold text-sm md:text-base tracking-wide"
            style={{ color: isLight ? '#334155' : '#e2e8f0' }}
          >
            {Language}
          </span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center gap-2 px-4 pt-4 pb-3 shadow-xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: backBg,
            border: backBorder,
          }}
        >
          <span
            className="flex-shrink-0 font-bold text-sm tracking-wide"
            style={{ color: isLight ? '#1e293b' : '#ffffff' }}
          >
            {Language}
          </span>
          <div
            className="flex-shrink-0 w-8 h-px rounded-full"
            style={{ background: isLight ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.25)' }}
          />
          <p
            className="techstack-desc flex-1 w-full text-[11px] md:text-xs text-center leading-relaxed overflow-y-auto"
            style={{ color: isLight ? '#475569' : '#cbd5e1' }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TechStackIcon;
