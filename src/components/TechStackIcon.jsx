import React, { useState } from 'react';

const TechStackIcon = ({ TechStackIcon, Language, description }) => {
  const [flipped, setFlipped] = useState(false);

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
          className="absolute inset-0 group rounded-2xl flex flex-col items-center justify-center gap-3 shadow-lg transition-all duration-300 hover:scale-105"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <img
            src={TechStackIcon}
            alt={`${Language} icon`}
            className="h-16 w-16 md:h-20 md:w-20 object-contain drop-shadow-lg"
          />
          <span className="text-slate-200 font-semibold text-sm md:text-base tracking-wide">
            {Language}
          </span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-2 px-4 py-4 shadow-xl"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(145deg, #0f3460 0%, #16213e 50%, #1a1a2e 100%)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          <span className="text-white font-bold text-sm tracking-wide">
            {Language}
          </span>
          <div className="w-8 h-px bg-white/25 rounded-full" />
          <p className="text-slate-300 text-[11px] md:text-xs text-center leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TechStackIcon;
