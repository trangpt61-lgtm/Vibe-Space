import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, PlayCircle, FileText, Compass, CheckCircle2, X } from 'lucide-react';
import type { GradeLevel, LibraryFormat, LibraryResource } from '../types/index.ts';
import {
  GRADE_LEVEL_CONFIG,
  LIBRARY_FORMAT_LABELS,
  VIBE_IMAGES,
} from '../data/vibeData.ts';
import { apiFetch } from '../lib/api.ts';

interface PsychologyLibraryProps {
  gradeLevel: GradeLevel;
  onChangeGradeLevel: (g: GradeLevel) => void;
}

export function PsychologyLibrary({ gradeLevel, onChangeGradeLevel }: PsychologyLibraryProps) {
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [formatFilter, setFormatFilter] = useState<'all' | LibraryFormat>('all');
  const [activeItem, setActiveItem] = useState<LibraryResource | null>(null);
  const [selectedQuizChoice, setSelectedQuizChoice] = useState<number | null>(null);

  useEffect(() => {
    apiFetch<{ items: LibraryResource[] }>('/api/library')
      .then((res) => setResources(res.items))
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    return resources.filter((item) => {
      if (item.gradeLevel !== gradeLevel) return false;
      if (formatFilter !== 'all' && item.format !== formatFilter) return false;
      return true;
    });
  }, [resources, gradeLevel, formatFilter]);

  const bannerImage =
    gradeLevel === 'primary' ? VIBE_IMAGES.primaryLibrary : VIBE_IMAGES.teenLibrary;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Header Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch bg-white rounded-2xl border border-[#E8E3F0] overflow-hidden">
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5">
          <div className="space-y-2">
            <div className="text-xs font-medium text-[#5A3EE0]">
              Phân hệ 6 · Psychology Library · Thư viện kiến thức tâm lý
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#242038]">
              Học liệu tâm lý – xã hội cho cấp {GRADE_LEVEL_CONFIG[gradeLevel].label}
            </h1>
            <p className="text-sm text-[#5A5475] leading-relaxed">
              Nội dung được thiết kế phù hợp với từng lứa tuổi qua bài viết, tình huống thực tế, infographic, video và bài tập tự thực hành.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(['primary', 'middle', 'high'] as GradeLevel[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => onChangeGradeLevel(g)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  gradeLevel === g
                    ? 'bg-[#6B4CE6] text-white'
                    : 'bg-[#F6F3FB] text-[#5A5475] hover:bg-[#EDE8FF]'
                }`}
              >
                {GRADE_LEVEL_CONFIG[g].label} ({GRADE_LEVEL_CONFIG[g].ageRange})
              </button>
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 min-h-[210px]">
          <img
            src={bannerImage}
            alt={`Minh họa thư viện tâm lý cấp ${GRADE_LEVEL_CONFIG[gradeLevel].label}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Format Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-[#E8E3F0] rounded-xl">
          <button
            type="button"
            onClick={() => setFormatFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              formatFilter === 'all' ? 'bg-[#EDE8FF] text-[#3E2B85]' : 'text-[#5A5475]'
            }`}
          >
            Tất cả hình thức
          </button>
          {(Object.entries(LIBRARY_FORMAT_LABELS) as [LibraryFormat, string][]).map(
            ([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFormatFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  formatFilter === key ? 'bg-[#EDE8FF] text-[#3E2B85]' : 'text-[#5A5475]'
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>

        <span className="text-xs text-[#6B6585] tabular-nums">
          {filtered.length} học liệu phù hợp
        </span>
      </div>

      {/* Resource Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E3F0] p-12 text-center space-y-2">
          <p className="text-sm font-medium text-[#242038]">
            Chưa có học liệu ở hình thức này cho cấp {GRADE_LEVEL_CONFIG[gradeLevel].label}.
          </p>
          <button
            type="button"
            onClick={() => setFormatFilter('all')}
            className="text-xs font-semibold text-[#5A3EE0] hover:underline"
          >
            Xem tất cả hình thức
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl border border-[#E8E3F0] p-6 flex flex-col justify-between gap-5 hover:border-[#CBBDFB] transition-colors"
            >
              <div className="space-y-3">
                <div className="text-xs text-[#6B6585] flex items-center gap-2">
                  <span>{LIBRARY_FORMAT_LABELS[item.format]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.readTime}</span>
                </div>
                <h2 className="font-display font-bold text-lg text-[#242038] leading-snug">
                  {item.title}
                </h2>
                <p className="text-xs font-medium text-[#5A3EE0]">{item.topic}</p>
                <p className="text-sm text-[#5A5475] leading-relaxed">{item.summary}</p>
              </div>

              <div className="pt-3 border-t border-[#F0ECF7] flex items-center justify-between">
                <span className="text-[11px] text-[#6B6585]">
                  Có câu hỏi tương tác & thực hành
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveItem(item);
                    setSelectedQuizChoice(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#EDE8FF] text-[#3E2B85] text-xs font-semibold hover:bg-[#E1D8FE] transition-colors"
                >
                  Khám phá ngay
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 bg-[#242038]/40 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-[#E8E3F0] shadow-xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-[#F0ECF7] flex items-start justify-between gap-4">
              <div>
                <div className="text-xs text-[#6B6585]">
                  {GRADE_LEVEL_CONFIG[activeItem.gradeLevel].label} ·{' '}
                  {LIBRARY_FORMAT_LABELS[activeItem.format]} · {activeItem.readTime}
                </div>
                <h2 className="font-display font-bold text-lg text-[#242038] mt-1">
                  {activeItem.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[#6B6585] hover:bg-[#F3EEFF]"
                aria-label="Đóng bài học"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="space-y-3 text-sm text-[#3D3759] leading-relaxed">
                {activeItem.content.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Interactive Question */}
              <div className="p-5 rounded-2xl bg-[#F6F3FB] border border-[#E3DCF8] space-y-3">
                <div className="font-display font-semibold text-sm text-[#242038] flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#6B4CE6]" />
                  <span>Câu hỏi tương tác: {activeItem.interactiveQuestion}</span>
                </div>
                <div className="space-y-2">
                  {activeItem.interactiveChoices.map((choice, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedQuizChoice(idx)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs sm:text-sm border transition-colors ${
                        selectedQuizChoice === idx
                          ? 'bg-white border-[#6B4CE6] text-[#3E2B85] font-semibold'
                          : 'bg-white/70 border-[#E3DCF8] text-[#4A4463] hover:bg-white'
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
                {selectedQuizChoice !== null && (
                  <p className="text-xs text-[#155E47] font-medium flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      Cảm ơn bạn đã suy ngẫm! Nhận diện suy nghĩ của mình giúp bạn chủ động hơn trong tình huống thực tế.
                    </span>
                  </p>
                )}
              </div>

              {/* Practice Exercise */}
              <div className="p-5 rounded-2xl bg-[#E5F7F0]/70 border border-[#CBEFE2] space-y-1.5">
                <div className="font-display font-semibold text-sm text-[#155E47] flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Bài tập thực hành gợi ý</span>
                </div>
                <p className="text-sm text-[#1D5441] leading-relaxed">
                  {activeItem.practiceExercise}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
