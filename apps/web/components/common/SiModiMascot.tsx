'use client';

import React from 'react';

export type ModiPose = 'happy' | 'relieved' | 'panic' | 'sleep' | 'celebrate';

export function SiModiMascot({
  pose = 'happy',
  size = 64,
  className = '',
}: {
  pose?: ModiPose;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={`Maskot Si Modi (${pose})`}
    >
      {/* Shadow lip */}
      <ellipse cx="48" cy="86" rx="32" ry="6" fill="#D6C6AD" />
      {/* Base tier */}
      <rect
        x="16"
        y="58"
        width="64"
        height="24"
        rx="12"
        fill="#8A5A3B"
        stroke="#5C3A22"
        strokeWidth="3.5"
      />
      {/* Middle tier */}
      <rect
        x="23"
        y="39"
        width="50"
        height="23"
        rx="11.5"
        fill="#8A5A3B"
        stroke="#5C3A22"
        strokeWidth="3.5"
      />
      {/* Top swirl */}
      <path
        d="M34 40C34 26 45 16 52 14C55 21 62 27 62 40H34Z"
        fill="#8A5A3B"
        stroke="#5C3A22"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Cute highlight */}
      <ellipse cx="38" cy="34" rx="4" ry="2.5" fill="#B5805D" />
      {/* Rosy cheeks */}
      <ellipse cx="31" cy="60" rx="5.5" ry="3.5" fill="#FF7EB6" />
      <ellipse cx="65" cy="60" rx="5.5" ry="3.5" fill="#FF7EB6" />

      {/* Eyes based on pose */}
      {pose === 'relieved' || pose === 'sleep' ? (
        <>
          <path
            d="M33 52C35 55 39 55 41 52"
            stroke="#3C2A1E"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M55 52C57 55 61 55 63 52"
            stroke="#3C2A1E"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <circle cx="37" cy="51" r="5" fill="#3C2A1E" />
          <circle cx="35.5" cy="49.5" r="2" fill="#FFFFFF" />
          <circle cx="59" cy="51" r="5" fill="#3C2A1E" />
          <circle cx="57.5" cy="49.5" r="2" fill="#FFFFFF" />
        </>
      )}

      {/* Mouth */}
      {pose === 'panic' ? (
        <ellipse cx="48" cy="64" rx="6" ry="5" fill="#FF4B4B" stroke="#3C2A1E" strokeWidth="2.5" />
      ) : (
        <path
          d="M42 61C44 66 52 66 54 61"
          stroke="#3C2A1E"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      )}

      {/* Sparkle / Sweat */}
      {pose === 'celebrate' && (
        <circle cx="76" cy="24" r="5" fill="#FFC800" stroke="#E0A500" strokeWidth="2" />
      )}
      {pose === 'panic' && (
        <path
          d="M72 34C72 34 77 41 77 44C77 46.7 74.7 49 72 49C69.3 49 67 46.7 67 44C67 41 72 34 72 34Z"
          fill="#1CB0F6"
        />
      )}
    </svg>
  );
}
