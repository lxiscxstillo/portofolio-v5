import React from "react"
import { useTheme } from "../context/ThemeContext"

const AnimatedBackground = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="fixed inset-0">
      {/* Base — transparent in light so the body gradient shows through */}
      <div className={`absolute inset-0 ${isLight ? 'bg-transparent' : 'bg-[#0A0A0A]'}`}></div>
      {/*
        Grid — solid indigo in light mode so it remains visible at ~5% through the
        pointer-events-none opacity wrapper in App.jsx.
      */}
      <div
        className="absolute inset-0 bg-[size:32px_32px]"
        style={{
          backgroundImage: isLight
            ? 'linear-gradient(to right, rgba(99,102,241,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.12) 1px, transparent 1px)'
            : 'linear-gradient(to right, rgba(255,255,255,0.031) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.031) 1px, transparent 1px)',
        }}
      />
    </div>
  )
}

export default AnimatedBackground
