'use client';

import React from 'react';
import { ToiletPaper } from '@phosphor-icons/react';
import { t } from '@/lib/i18n';

interface TissueRollRatingProps {
  value: number;
  onChange: (rating: number) => void;
  activeColorClass?: string;
}

export function TissueRollRating({
  value,
  onChange,
  activeColorClass = 'text-splash border-splash bg-splash/10',
}: TissueRollRatingProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2.5">
        {[1, 2, 3, 4, 5].map((num) => {
          const isSelected = num <= value;
          return (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              aria-label={`Rating ${num} gulungan tisu`}
              className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all duration-150 active:scale-125 ${
                isSelected
                  ? `${activeColorClass} [--lip-color:#1593CF] shadow-lip-sm scale-105`
                  : 'bg-sand border-line text-ink-faint hover:border-line-strong'
              }`}
            >
              <ToiletPaper size={28} weight={isSelected ? 'fill' : 'bold'} />
            </button>
          );
        })}
      </div>
      <span className="font-display font-extrabold text-base text-ink">
        {t(`rating.level_${value}`)}
      </span>
    </div>
  );
}
