import React from 'react';

interface CanvoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showTagline?: boolean;
  className?: string;
  variant?: 'light' | 'dark';
}

export const CanvoLogo: React.FC<CanvoLogoProps> = ({
  size = 'md',
  showWordmark = true,
  showTagline = true,
  className = '',
  variant = 'light'
}) => {
  // Sizing definitions
  const dimensions = {
    sm: {
      svgSize: 28,
      containerSize: 'w-8 h-8',
      fontSize: 'text-lg',
      tagSize: 'text-[9px]',
      badgeSize: 'text-[9px] px-1.5 py-0.2'
    },
    md: {
      svgSize: 36,
      containerSize: 'w-10 h-10',
      fontSize: 'text-2xl',
      tagSize: 'text-[11px]',
      badgeSize: 'text-[10px] px-2 py-0.5'
    },
    lg: {
      svgSize: 44,
      containerSize: 'w-12 h-12',
      fontSize: 'text-3xl',
      tagSize: 'text-xs',
      badgeSize: 'text-xs px-2.5 py-0.5'
    },
    xl: {
      svgSize: 56,
      containerSize: 'w-16 h-16',
      fontSize: 'text-4xl',
      tagSize: 'text-sm',
      badgeSize: 'text-xs px-3 py-1'
    }
  }[size];

  const isDark = variant === 'dark';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      
      {/* BOTANICAL DIALOGUE SVG MARK */}
      <div 
        className={`${dimensions.containerSize} relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105`}
        title="Canvo — Botanical Dialogue Logo"
      >
        <svg
          width={dimensions.svgSize}
          height={dimensions.svgSize}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          <defs>
            {/* Primary Terracotta Gradient (Speaker / Prompting Leaf) */}
            <linearGradient id={`leafTerra_${size}_${variant}`} x1="7" y1="6" x2="30" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F38048" />
              <stop offset="50%" stopColor="#E2703A" />
              <stop offset="100%" stopColor="#C45320" />
            </linearGradient>

            {/* Charcoal Gradient for Light Backgrounds */}
            <linearGradient id={`leafCharcoal_${size}_${variant}`} x1="18" y1="14" x2="41" y2="42" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#44352D" />
              <stop offset="60%" stopColor="#2C2420" />
              <stop offset="100%" stopColor="#18120E" />
            </linearGradient>

            {/* Cream / Parchment Gradient for Dark Backgrounds */}
            <linearGradient id={`leafCream_${size}_${variant}`} x1="18" y1="14" x2="41" y2="42" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#F9F4EB" />
              <stop offset="100%" stopColor="#ECDCC5" />
            </linearGradient>

            {/* Subtle Drop Glow */}
            <filter id={`botanicalGlow_${size}_${variant}`} x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor={isDark ? "#000000" : "#C45320"} floodOpacity={isDark ? "0.4" : "0.18"} />
            </filter>
          </defs>

          <g filter={`url(#botanicalGlow_${size}_${variant})`}>
            {/* Left/Top Botanical Leaf-Comma (Terracotta: represents prompt / speaker) */}
            <path
              d="M23.2 6.4C14.1 6.8 7 14.2 7 23.5C7 28.6 9.4 33.1 13.2 36C12.8 32.5 13.8 28.7 16.5 25.8C19.6 22.5 24.2 20.8 28.5 21.4C29.2 21.5 29.8 20.8 29.5 20.1C27.8 15.6 25.2 10.4 23.2 6.4Z"
              fill={`url(#leafTerra_${size}_${variant})`}
            />

            {/* Right/Bottom Botanical Leaf-Comma (Charcoal or Light Parchment on Dark) */}
            <path
              d="M24.8 41.6C33.9 41.2 41 33.8 41 24.5C41 19.4 38.6 14.9 34.8 12C35.2 15.5 34.2 19.3 31.5 22.2C28.4 25.5 23.8 27.2 19.5 26.6C18.8 26.5 18.2 27.2 18.5 27.9C20.2 32.4 22.8 37.6 24.8 41.6Z"
              fill={isDark ? `url(#leafCream_${size}_${variant})` : `url(#leafCharcoal_${size}_${variant})`}
            />

            {/* Central Dialogue Seed / Accent Nucleus */}
            <circle 
              cx="24" 
              cy="24" 
              r="2.2" 
              fill="#E2703A" 
              opacity="0.95" 
            />
          </g>
        </svg>
      </div>

      {/* TYPOGRAPHY WORDMARK: Italic Serif Canvo + Platform Badge */}
      {showWordmark && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span 
              className={`font-serif italic font-bold ${dimensions.fontSize} tracking-tight leading-none ${
                isDark ? 'text-white' : 'text-artisan-950'
              }`}
            >
              Canvo
            </span>

            <span className={`${dimensions.badgeSize} uppercase tracking-wider font-bold rounded-full border ${
              isDark 
                ? 'bg-white/15 text-honey-300 border-white/20' 
                : 'bg-terracotta-50 text-terracotta-700 border-terracotta-200/80'
            }`}>
              AI
            </span>
          </div>

          {showTagline && (
            <p className={`${dimensions.tagSize} font-medium tracking-wide mt-1 hidden sm:block ${
              isDark ? 'text-artisan-400' : 'text-artisan-500'
            }`}>
              Conversational AI Platform for Local Commerce
            </p>
          )}
        </div>
      )}

    </div>
  );
};

export const ConvoLogo = CanvoLogo;
export default CanvoLogo;
