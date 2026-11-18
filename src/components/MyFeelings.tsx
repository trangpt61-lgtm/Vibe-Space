import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, CheckCircle2, Clock, Sparkles, UserCheck } from 'lucide-react';
import type { EmotionCheckIn, EmotionId, GradeLevel, UserProfile } from '../types/index.ts';
import { EMOTIONS, EMOTION_MAP, GRADE_LEVEL_CONFIG } from '../data/vibeData.ts';
import { EmotionIllustration } from './VibeIcons.tsx';
import { apiFetch } from '../lib/api.ts';

interface MyFeelingsProps {
  gradeLevel: GradeLevel;
  user: UserProfile | null;
  onOpenAuth: () => void;
}

const INTENSITY_LABELS: Record<number, string> = {
  1: 'Rất nhẹ',
  2: 'Nhẹ',
  3: 'Vừa phải',
  4: 'Rõ rệt',
  5: 'Rất mạnh',
};

const LOCAL_PREVIEW_SEED: EmotionCheckIn[] = [
  {
    id: 'local-demo-1',
    studentId: 'guest-demo',
    gradeLevel: 'middle',
    emotion: 'binh_yen',
    intensity: 4,
    causePrompt: 'Nghe nhạc nhẹ sau giờ học (Dữ liệu minh họa)',
    extraNote: '',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    isDemoData: true,
  },
  {
    id: 'local-demo-2',
    studentId: 'guest-demo',
    gradeLevel: 'middle',
    emotion: 'lo_lang',
    intensity: 3,
    causePrompt: 'Chuẩn bị bài thuyết trình nhóm (Dữ liệu minh họa)',
    extraNote: '',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isDemoData: true,
  },
  {
    id: 'local-demo-3',
    studentId: 'guest-demo',
    gradeLevel: 'middle',
    emotion: 'vui_ve',
    intensity: 5,
    causePrompt: 'Hoàn thành tốt phần trình bày cùng các bạn (Dữ liệu minh họa)',
    extraNote: '',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isDemoData: true,
  },
];

export function MyFeelings({ gradeLevel, user, onOpenAuth }: MyFeelingsProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionId>('binh_yen');
  const [intensity, setIntensity] = useState<number>(3);
  const [causePrompt, setCausePrompt] = useState('');
  const [extraNote, setExtraNote] = useState('');
  const [history, setHistory] = useState<EmotionCheckIn[]>(LOCAL_PREVIEW_SEED);
  const [chartRange, setChartRange] = useState<'day' | 'week' | 'month'>('week');
  const [submitting, setSubmitting] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const gradeCfg = GRADE_LEVEL_CONFIG[gradeLevel];
  const isStudent = user?.role === 'student';

  useEffect(() => {
    if (isStudent) {
      apiFetch<{ items: EmotionCheckIn[] }>('/api/checkins')
        .then((res) => setHistory(res.items))
        .catch(() => {});
    } else {
      setHistory(LOCAL_PREVIEW_SEED);
    }
  }, [isStudent, user?.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    setSavedFeedback('');
    setSubmitting(true);

    try {
      if (isStudent) {
        const res = await apiFetch<{ item: EmotionCheckIn }>('/api/checkins', {
          method: 'POST',
          body: JSON.stringify({
            emotion: selectedEmotion,
            intensity,
            causePrompt,
            extraNote,
            gradeLevel,
          }),
        });
        setHistory((prev) => [res.item, ...prev]);
        setSavedFeedback('Đã lưu check-in cảm xúc của bạn vào không gian riêng tư.');
      } else {
        const localItem: EmotionCheckIn = {
          id: `preview-${Date.now()}`,
          studentId: 'guest-preview',
          gradeLevel,
          emotion: selectedEmotion,
          intensity,
          causePrompt: causePrompt || 'Ghi nhận trải nghiệm thử trên phiên trình duyệt',
          extraNote,
          createdAt: new Date().toISOString(),
          isDemoData: false,
        };
        setHistory((prev) => [localItem, ...prev]);
        setSavedFeedback(
          'Đã ghi nhận trên phiên hiện tại. Đăng nhập tài khoản Học sinh để lưu trữ lâu dài.'
        );
      }
      setCausePrompt('');
      setExtraNote('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể lưu check-in.');
    } finally {
      setSubmitting(false);
    }
  }

  const filteredChartItems = useMemo(() => {
    const now = Date.now();
    const limitMs =
      chartRange === 'day'
        ? 86400000
        : chartRange === 'week'
          ? 86400000 * 7
          : 86400000 * 30;
    const filtered = history.filter(
      (item) => now - new Date(item.createdAt).getTime() <= limitMs
    );
    return [...filtered].reverse().slice(-12);
  }, [history, chartRange]);

  const emotionCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of history) {
      map[item.emotion] = (map[item.emotion] || 0) + 1;
    }
    return map;
  }, [history]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EFEBF7] pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs font-medium text-[#6B6585]">
            Phân hệ 1 · My Feelings · Dành cho cấp {gradeCfg.label}
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#242038] text-balance">
            {gradeCfg.checkInQuestion}
          </h1>
          <p className="text-sm text-[#5A5475]">
            Không có cảm xúc đúng hay sai. Gọi tên cảm xúc là bước đầu tiên để lắng nghe và chăm sóc chính mình.
          </p>
        </div>

        {!isStudent && (
          <button
            type="button"
            onClick={onOpenAuth}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EDE8FF] text-[#3E2B85] text-xs font-semibold hover:bg-[#E1D8FE] transition-colors whitespace-nowrap shrink-0"
          >
            <UserCheck className="w-4 h-4" />
            <span>Đăng nhập Học sinh để lưu lịch sử cá nhân</span>
          </button>
        )}
      </div>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Check-In Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 bg-white rounded-2xl border border-[#E8E3F0] p-6 sm:p-7 space-y-7"
        >
          {/* Step 1: Emotion Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-display font-semibold text-base text-[#242038]">
                1. Chọn cảm xúc gần với bạn nhất lúc này
              </label>
              <span className="text-xs text-[#6B6585]">8 trạng thái cảm xúc</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {EMOTIONS.map((em) => {
                const active = selectedEmotion === em.id;
                return (
                  <button
                    key={em.id}
                    type="button"
                    onClick={() => setSelectedEmotion(em.id)}
                    className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                      active
                        ? 'border-[#6B4CE6] ring-2 ring-[#6B4CE6]/20 bg-[#FAF8FF]'
                        : 'border-[#EFEBF7] bg-[#FCFBF9] hover:bg-white hover:border-[#D3C9F8]'
                    }`}
                  >
                    <EmotionIllustration
                      emotion={em.id}
                      size={gradeLevel === 'primary' ? 54 : 44}
                    />
                    <span className="font-display font-semibold text-sm text-[#242038]">
                      {em.label}
                    </span>
                    {gradeLevel === 'primary' && (
                      <span className="text-[11px] text-[#6B6585] leading-tight">
                        {em.shortDesc}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8F6FC] text-xs text-[#5A5475] flex items-center gap-3">
              <EmotionIllustration emotion={selectedEmotion} size={28} />
              <span>
                Bạn đang chọn <strong className="text-[#242038]">{EMOTION_MAP[selectedEmotion].label}</strong> —{' '}
                {EMOTION_MAP[selectedEmotion].shortDesc}.
              </span>
            </div>
          </div>

          {/* Step 2: Intensity Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="emotion-intensity"
                className="font-display font-semibold text-base text-[#242038]"
              >
                2. Mức độ cảm xúc hiện tại
              </label>
              <span className="text-sm font-semibold text-[#5A3EE0] tabular-nums">
                Mức {intensity}/5 · {INTENSITY_LABELS[intensity]}
              </span>
            </div>
            <input
              id="emotion-intensity"
              type="range"
              min={1}
              max={5}
              step={1}
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full accent-[#6B4CE6] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#6B6585] tabular-nums">
              <span>1 · Rất nhẹ</span>
              <span>2 · Nhẹ</span>
              <span>3 · Vừa phải</span>
              <span>4 · Rõ rệt</span>
              <span>5 · Rất mạnh</span>
            </div>
          </div>

          {/* Step 3: Reflection Prompts */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="cause-prompt"
                className="block font-display font-semibold text-sm text-[#242038] mb-1.5"
              >
                3. Điều gì khiến bạn cảm thấy như vậy?
              </label>
              <input
                id="cause-prompt"
                type="text"
                value={causePrompt}
                onChange={(e) => setCausePrompt(e.target.value)}
                placeholder={
                  gradeLevel === 'primary'
                    ? 'Ví dụ: Hôm nay mình được chơi cùng bạn hoặc gặp bài toán hơi khó...'
                    : 'Ví dụ: Một sự việc ở lớp, cuộc trò chuyện với bạn bè hoặc áp lực bài kiểm tra...'
                }
                className="w-full px-4 py-3 text-sm rounded-xl border border-[#E3DCF8] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]"
              />
            </div>

            <div>
              <label
                htmlFor="extra-note"
                className="block font-display font-semibold text-sm text-[#242038] mb-1.5"
              >
                4. Bạn muốn chia sẻ thêm điều gì không? (Không bắt buộc)
              </label>
              <textarea
                id="extra-note"
                rows={3}
                value={extraNote}
                onChange={(e) => setExtraNote(e.target.value)}
                placeholder="Ghi lại suy nghĩ hoặc điều bạn muốn nhắn nhủ cho bản thân..."
                className="w-full px-4 py-3 text-sm rounded-xl border border-[#E3DCF8] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#FEECEB] text-[#8D282C] text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {savedFeedback && (
            <div className="p-3.5 rounded-xl bg-[#E5F7F0] text-[#155E47] text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{savedFeedback}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-xs text-[#6B6585]">
              Dữ liệu check-in dùng để bạn tự quan sát tâm trạng của mình.
            </span>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-[#6B4CE6] text-white text-sm font-semibold hover:bg-[#5A3BD6] transition-colors disabled:opacity-60 whitespace-nowrap"
            >
              {submitting ? 'Đang lưu...' : 'Lưu check-in cảm xúc'}
            </button>
          </div>
        </form>

        {/* Right: Mood Chart & History */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interactive Chart Card */}
          <div className="bg-white rounded-2xl border border-[#E8E3F0] p-6 space-y-5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="font-display font-bold text-base text-[#242038]">
                  Biểu đồ cảm xúc của bạn
                </h2>
                <p className="text-xs text-[#6B6585] mt-0.5">
                  Quan sát nhịp điệu tâm trạng theo thời gian
                </p>
              </div>
              <div className="flex items-center gap-1 p-1 bg-[#F6F3FB] rounded-lg">
                {(
                  [
                    { id: 'day', label: 'Ngày' },
                    { id: 'week', label: 'Tuần' },
                    { id: 'month', label: 'Tháng' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setChartRange(tab.id)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      chartRange === tab.id
                        ? 'bg-white text-[#5A3EE0] shadow-xs'
                        : 'text-[#6B6585] hover:text-[#242038]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredChartItems.length === 0 ? (
              <div className="py-10 text-center text-xs text-[#6B6585] bg-[#FCFBF9] rounded-xl border border-dashed border-[#E3DCF8]">
                Chưa có lượt check-in nào trong khoảng thời gian này.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Bar Timeline */}
                <div className="h-40 flex items-end gap-2 pt-4 px-2 bg-[#FCFBF9] rounded-xl border border-[#F0ECF7]">
                  {filteredChartItems.map((item) => {
                    const meta = EMOTION_MAP[item.emotion];
                    const heightPct = Math.max(22, item.intensity * 18);
                    const dateObj = new Date(item.createdAt);
                    const label = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
                    return (
                      <div
                        key={item.id}
                        className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full pb-2 group"
                        title={`${meta.label} · Mức ${item.intensity}/5`}
                      >
                        <div
                          className="w-full max-w-[28px] rounded-t-lg transition-all relative flex items-start justify-center pt-1"
                          style={{
                            height: `${heightPct}%`,
                            backgroundColor: meta.accentHex,
                          }}
                        >
                          <span className="text-[10px] font-mono font-semibold text-white tabular-nums">
                            {item.intensity}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#6B6585] tabular-nums">{label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Top Emotion Summary */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#5A5475] pt-1">
                  {Object.entries(emotionCounts).map(([emId, count]) => {
                    const m = EMOTION_MAP[emId as EmotionId];
                    if (!m) return null;
                    return (
                      <span key={emId} className="inline-flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-xs inline-block"
                          style={{ backgroundColor: m.accentHex }}
                        />
                        <span>
                          {m.label}: <strong className="tabular-nums text-[#242038]">{count}</strong>
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Recent Check-In History */}
          <div className="bg-white rounded-2xl border border-[#E8E3F0] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-base text-[#242038]">
                Lịch sử check-in gần đây
              </h2>
              <span className="text-xs text-[#6B6585] tabular-nums">
                {history.length} lượt ghi nhận
              </span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {history.map((item) => {
                const meta = EMOTION_MAP[item.emotion];
                const d = new Date(item.createdAt);
                const dateLabel = d.toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                });
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-[#F0ECF7] bg-[#FCFBF9] flex items-start gap-3"
                  >
                    <EmotionIllustration emotion={item.emotion} size={36} />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-[#242038]">
                          {meta.label} · Mức {item.intensity}/5
                        </span>
                        <span className="text-[#6B6585] tabular-nums inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {dateLabel}
                        </span>
                      </div>
                      {item.causePrompt && (
                        <p className="text-xs text-[#4A4463] leading-relaxed">{item.causePrompt}</p>
                      )}
                      {item.extraNote && (
                        <p className="text-xs text-[#6B6585] italic">{item.extraNote}</p>
                      )}
                      {item.isDemoData && (
                        <p className="text-[11px] text-[#7C5CFC]">Dữ liệu minh họa (Demo)</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
