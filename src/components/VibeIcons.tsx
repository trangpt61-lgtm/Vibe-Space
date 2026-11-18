import React from 'react';
import type { EmotionId } from '../types/index.ts';

export function VibeSpaceLogo({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="36" height="36" rx="12" fill="#EDE8FF" />
      <path
        d="M20 31.5C20 31.5 9.5 24.8 9.5 16.8C9.5 13.1 12.4 10.2 15.9 10.2C17.9 10.2 19.3 11.2 20 12.5C20.7 11.2 22.1 10.2 24.1 10.2C27.6 10.2 30.5 13.1 30.5 16.8C30.5 24.8 20 31.5 20 31.5Z"
        fill="#7C5CFC"
        fillOpacity="0.22"
        stroke="#6B4CE6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="15.8" cy="17.2" r="1.4" fill="#3E2B85" />
      <circle cx="24.2" cy="17.2" r="1.4" fill="#3E2B85" />
      <path
        d="M17.2 21.2C18.1 22.3 19.1 22.8 20 22.8C20.9 22.8 21.9 22.3 22.8 21.2"
        stroke="#38B28B"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function EmotionIllustration({
  emotion,
  size = 44,
}: {
  emotion: EmotionId;
  size?: number;
}) {
  const palette: Record<EmotionId, { circle: string; stroke: string; cheek: string }> = {
    vui_ve: { circle: '#FDE6A8', stroke: '#805708', cheek: '#F59E6C' },
    binh_yen: { circle: '#CBEFE2', stroke: '#155E47', cheek: '#88D4B9' },
    buon_ba: { circle: '#D3E4FD', stroke: '#1E468C', cheek: '#9EC0FA' },
    lo_lang: { circle: '#E2D8FE', stroke: '#462C9E', cheek: '#B9A5FA' },
    tuc_gian: { circle: '#FCD2D0', stroke: '#8D282C', cheek: '#F29492' },
    that_vong: { circle: '#E6E0F0', stroke: '#473D61', cheek: '#C2B7D6' },
    co_don: { circle: '#D5E8F0', stroke: '#255369', cheek: '#A3CBE0' },
    met_moi: { circle: '#EDE4D3', stroke: '#5E4B2E', cheek: '#D1C0A5' },
  };
  const c = palette[emotion];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="21" fill={c.circle} stroke={c.stroke} strokeWidth="2" />
      <circle cx="13.5" cy="26.5" r="2.6" fill={c.cheek} fillOpacity="0.65" />
      <circle cx="34.5" cy="26.5" r="2.6" fill={c.cheek} fillOpacity="0.65" />

      {emotion === 'vui_ve' && (
        <>
          <path d="M15 20C15.8 18.2 18.2 18.2 19 20" stroke={c.stroke} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M29 20C29.8 18.2 32.2 18.2 33 20" stroke={c.stroke} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M17 28C18.8 32 29.2 32 31 28" stroke={c.stroke} strokeWidth="2.4" strokeLinecap="round" />
        </>
      )}

      {emotion === 'binh_yen' && (
        <>
          <path d="M15 21C16 22.3 18 22.3 19 21" stroke={c.stroke} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M29 21C30 22.3 32 22.3 33 21" stroke={c.stroke} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M19 29C21 30.8 27 30.8 29 29" stroke={c.stroke} strokeWidth="2.2" strokeLinecap="round" />
        </>
      )}

      {emotion === 'buon_ba' && (
        <>
          <circle cx="17" cy="21" r="1.9" fill={c.stroke} />
          <circle cx="31" cy="21" r="1.9" fill={c.stroke} />
          <path d="M18 31.5C20 28.5 28 28.5 30 31.5" stroke={c.stroke} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M33.5 24.5C34.5 26 34.5 27.8 33.5 28.5C32.5 27.8 32.5 26 33.5 24.5Z" fill="#5B8DEF" />
        </>
      )}

      {emotion === 'lo_lang' && (
        <>
          <path d="M14.5 17.5L19 16.2" stroke={c.stroke} strokeWidth="1.9" strokeLinecap="round" />
          <path d="M33.5 17.5L29 16.2" stroke={c.stroke} strokeWidth="1.9" strokeLinecap="round" />
          <circle cx="17" cy="21.5" r="2" fill={c.stroke} />
          <circle cx="31" cy="21.5" r="2" fill={c.stroke} />
          <path d="M18 30C19.5 28.5 21 31 22.5 29.5C24 28 25.5 31 27 29.5C28.5 28 29.5 30 30.5 29.5" stroke={c.stroke} strokeWidth="2.1" strokeLinecap="round" />
        </>
      )}

      {emotion === 'tuc_gian' && (
        <>
          <path d="M14.5 17.5L20 20" stroke={c.stroke} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M33.5 17.5L28 20" stroke={c.stroke} strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="17.5" cy="22" r="1.9" fill={c.stroke} />
          <circle cx="30.5" cy="22" r="1.9" fill={c.stroke} />
          <path d="M18.5 31C20.5 28.5 27.5 28.5 29.5 31" stroke={c.stroke} strokeWidth="2.3" strokeLinecap="round" />
        </>
      )}

      {emotion === 'that_vong' && (
        <>
          <path d="M14.5 19.5L19.5 18.5" stroke={c.stroke} strokeWidth="1.9" strokeLinecap="round" />
          <path d="M33.5 19.5L28.5 18.5" stroke={c.stroke} strokeWidth="1.9" strokeLinecap="round" />
          <circle cx="17" cy="22.5" r="1.8" fill={c.stroke} />
          <circle cx="31" cy="22.5" r="1.8" fill={c.stroke} />
          <path d="M19 30.5H29" stroke={c.stroke} strokeWidth="2.2" strokeLinecap="round" />
        </>
      )}

      {emotion === 'co_don' && (
        <>
          <circle cx="17" cy="21.5" r="1.8" fill={c.stroke} />
          <circle cx="31" cy="21.5" r="1.8" fill={c.stroke} />
          <path d="M20 30C22 29 26 29 28 30.5" stroke={c.stroke} strokeWidth="2.1" strokeLinecap="round" />
        </>
      )}

      {emotion === 'met_moi' && (
        <>
          <path d="M14.5 21.5H19.5" stroke={c.stroke} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M28.5 21.5H33.5" stroke={c.stroke} strokeWidth="2.2" strokeLinecap="round" />
          <ellipse cx="24" cy="30" rx="3" ry="2.2" stroke={c.stroke} strokeWidth="2" />
        </>
      )}
    </svg>
  );
}

export const DIARY_STICKERS = [
  { id: 'sunbeam', label: 'Nắng ấm' },
  { id: 'lotus', label: 'Hoa sen' },
  { id: 'cloud', label: 'Mây êm' },
  { id: 'star', label: 'Ngôi sao' },
  { id: 'sprout', label: 'Mầm xanh' },
];

export function DiaryStickerBadge({ stickerId, size = 28 }: { stickerId: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      {stickerId === 'sunbeam' && (
        <>
          <circle cx="16" cy="16" r="7" fill="#FDE6A8" stroke="#D99B26" strokeWidth="1.8" />
          <path d="M16 4V7M16 25V28M4 16H7M25 16H28M7.5 7.5L9.8 9.8M22.2 22.2L24.5 24.5M24.5 7.5L22.2 9.8M9.8 22.2L7.5 24.5" stroke="#D99B26" strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}
      {stickerId === 'lotus' && (
        <>
          <path d="M16 7C19 11 20 16 16 22C12 16 13 11 16 7Z" fill="#EDE8FF" stroke="#6B4CE6" strokeWidth="1.7" />
          <path d="M9 12C13 13 15 17 15 22C10 21 8 17 9 12Z" fill="#E5F7F0" stroke="#38B28B" strokeWidth="1.7" />
          <path d="M23 12C19 13 17 17 17 22C22 21 24 17 23 12Z" fill="#E5F7F0" stroke="#38B28B" strokeWidth="1.7" />
        </>
      )}
      {stickerId === 'cloud' && (
        <path
          d="M10 22H22.5C25 22 27 20.1 27 17.8C27 15.6 25.3 13.8 23.1 13.6C22.3 10.6 19.6 8.5 16.4 8.5C12.6 8.5 9.5 11.4 9.5 15.1C7.5 15.6 6 17.3 6 19.3C6 21.8 7.8 22 10 22Z"
          fill="#EAF2FE"
          stroke="#5B8DEF"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      )}
      {stickerId === 'star' && (
        <path
          d="M16 5L19.1 11.4L26.2 12.4L21.1 17.4L22.3 24.5L16 21.1L9.7 24.5L10.9 17.4L5.8 12.4L12.9 11.4L16 5Z"
          fill="#FEF6DF"
          stroke="#E59E23"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      )}
      {stickerId === 'sprout' && (
        <>
          <path d="M16 26V14" stroke="#2D8B6C" strokeWidth="2" strokeLinecap="round" />
          <path d="M16 16C11 16 8 13 8 8C13 8 16 11 16 16Z" fill="#CBEFE2" stroke="#2D8B6C" strokeWidth="1.8" />
          <path d="M16 14C21 14 24 11 24 6C19 6 16 9 16 14Z" fill="#CBEFE2" stroke="#2D8B6C" strokeWidth="1.8" />
        </>
      )}
    </svg>
  );
}
