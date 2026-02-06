import React from 'react';
import { cn } from '../../lib/utils';

export function Logo({ className, textClassName, showText = true }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* Doodle Background Blob */}
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full text-brand-600 dark:text-brand-500 fill-current opacity-20 transform scale-125">
          <path d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.2,-19.2,95.8,-5.3C93.4,8.6,81.8,21.5,70.5,32.5C59.1,43.5,48,52.6,35.9,59.3C23.8,66,10.7,70.3,-1.6,73.1C-13.9,75.9,-29.1,77.2,-41.8,70.8C-54.5,64.4,-64.7,50.3,-71.6,35.4C-78.5,20.5,-82.1,4.8,-79.1,-9.3C-76.1,-23.4,-66.5,-35.9,-55.1,-44.9C-43.7,-53.9,-30.5,-59.4,-17.3,-62.7C-4.1,-66,8.2,-67.1,21.5,-73.4C30.5,-77.7,40.5,-61.8,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>

        {/* Doodle S Icon */}
        <svg viewBox="0 0 100 100" className="relative w-6 h-6 text-brand-600 dark:text-brand-400 stroke-current stroke-[8] fill-none stroke-linecap-round stroke-linejoin-round" style={{ filter: "drop-shadow(2px 2px 0px rgba(0,0,0,0.1))" }}>
          <path d="M 70 20 Q 20 20 20 50 Q 20 80 80 80" className="opacity-50" />
          <path d="M 30 20 Q 80 20 80 50 Q 80 80 30 80" />
          <line x1="50" y1="10" x2="50" y2="90" className="stroke-[6]" />
        </svg>
      </div>

      {showText && (
        <span className={cn("font-bold text-xl tracking-tight font-sans", textClassName)}>
          Splitwise<span className="text-brand-600 relative inline-block">
            Pro
            {/* Doodle under Pro */}
            <svg className="absolute -bottom-2 left-0 w-full h-3 text-yellow-400" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0 10 Q 50 20 100 5" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </span>
        </span>
      )}
    </div>
  );
}
