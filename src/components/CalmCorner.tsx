import React, { useEffect, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Check,
  RefreshCw,
  Feather,
  Sparkles,
  Wind,
} from 'lucide-react';
import type { GradeLevel } from '../types/index.ts';
import { POSITIVE_AFFIRMATIONS, VIBE_IMAGES } from '../data/vibeData.ts';

interface CalmCornerProps {
  gradeLevel: GradeLevel;
}

type BreathMode = 'box_4_4' | 'belly_4_2_6';

const BREATH_CONFIG: Record<
  BreathMode,
  {
    title: string;
    subtitle: string;
    phases: { label: string; seconds: number; scale: number }[];
  }
> = {
  box_4_4: {
    title: 'Thở vuông 4-4-4-4',
    subtitle: 'Phù hợp khi cần lấy lại nhịp bình tĩnh nhanh chóng trước giờ kiểm tra hoặc khi hồi hộp.',
    phases: [
      { label: 'Hít vào thật chậm', seconds: 4, scale: 1.24 },
      { label: 'Giữ hơi nhẹ nhàng', seconds: 4, scale: 1.24 },
      { label: 'Thở ra êm ái', seconds: 4, scale: 0.85 },
      { label: 'Thả lỏng nghỉ ngơi', seconds: 4, scale: 0.85 },
    ],
  },
  belly_4_2_6: {
    title: 'Thở sâu xoa dịu cơ thể (4-2-6)',
    subtitle: 'Nhịp thở ra dài hơn nhịp hít vào giúp hệ thần kinh dịu xuống tự nhiên.',
    phases: [
      { label: 'Hít sâu phình bụng', seconds: 4, scale: 1.24 },
      { label: 'Giữ nhẹ 2 giây', seconds: 2, scale: 1.24 },
      { label: 'Thở ra hết hơi căng', seconds: 6, scale: 0.82 },
    ],
  },
};

const GROUNDING_STEPS = [
  { count: 5, sense: 'Nhìn thấy', prompt: 'Tìm 5 đồ vật xung quanh bạn (cái bút, khung cửa sổ, chiếc lá...)' },
  { count: 4, sense: 'Chạm vào', prompt: 'Cảm nhận 4 chất liệu (mặt bàn mát, vạt áo mềm, mặt đất dưới chân...)' },
  { count: 3, sense: 'Lắng nghe', prompt: 'Ghi nhận 3 âm thanh nhẹ nhất bạn nghe được lúc này' },
  { count: 2, sense: 'Ngửi thấy', prompt: 'Nhận biết 2 mùi hương dễ chịu hoặc không khí trong lành quanh bạn' },
  { count: 1, sense: 'Trân trọng', prompt: 'Nghĩ về 1 điều tốt đẹp nhỏ bé về bản thân hoặc ngày hôm nay' },
];

const RELAXATION_STEPS = [
  {
    part: 'Đôi vai & cổ',
    instruction: 'Nhún nhẹ hai vai lên gần tai trong 4 giây, rồi thả rơi hoàn toàn để cảm nhận sự nhẹ nhõm.',
  },
  {
    part: 'Hai bàn tay',
    instruction: 'Nắm chặt hai bàn tay trong 4 giây như đang bóp quả bóng mềm, sau đó xòe rộng thả lỏng các ngón tay.',
  },
  {
    part: 'Khuôn mặt & hàm',
    instruction: 'Nhíu nhẹ lông mày rồi thả lỏng vầng trán, hé nhẹ hàm dưới để các cơ mặt được nghỉ ngơi.',
  },
  {
    part: 'Toàn thân & hơi thở',
    instruction: 'Đặt hai bàn chân vững trên sàn nhà, cảm nhận trọng lượng cơ thể được nâng đỡ an toàn.',
  },
];

const COPING_CARDS = [
  {
    category: 'Giải tỏa tức giận an toàn',
    tint: 'bg-[#FEECEB]/70 border-[#F7D1CE]',
    tips: [
      'Rời khỏi tình huống đang căng thẳng 3–5 phút và uống một ngụm nước mát.',
      'Vò một tờ giấy nháp hoặc siết nhẹ gối mềm thay vì ném đồ hay nói lời làm đau người khác.',
      'Viết hết điều làm bạn bực ra giấy rồi gấp lại, chỉ quay lại nói chuyện khi nhịp tim đã bình ổn.',
    ],
  },
  {
    category: 'Ứng phó với lo lắng & áp lực học tập',
    tint: 'bg-[#F3EEFF]/80 border-[#DDD2FA]',
    tips: [
      'Chia bài tập lớn thành các bước 15–20 phút thay vì nhìn toàn bộ khối lượng cùng lúc.',
      'Phân biệt điều bạn kiểm soát được (ôn từng phần nhỏ, ngủ đủ) và điều ngoài tầm kiểm soát.',
      'Tạm dừng 5 phút sau mỗi 45 phút học để vươn vai và nhìn ra không gian xanh.',
    ],
  },
  {
    category: 'Khi cảm thấy cô đơn',
    tint: 'bg-[#EAF2FE]/80 border-[#CFE0FA]',
    tips: [
      'Nhớ rằng cảm giác cô đơn có thể xuất hiện ngay cả khi đang ở giữa đám đông — điều đó không có nghĩa bạn không được yêu quý.',
      'Thử nhắn một tin đơn giản cho người bạn tin tưởng hoặc người thân: "Hôm nay cậu rảnh trò chuyện một chút không?"',
      'Ghé Phòng Tâm lý học đường hoặc trò chuyện với Buddy Talk bất cứ khi nào bạn cần được lắng nghe.',
    ],
  },
];

export function CalmCorner({ gradeLevel }: CalmCornerProps) {
  const [breathMode, setBreathMode] = useState<BreathMode>('box_4_4');
  const [isRunning, setIsRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(BREATH_CONFIG.box_4_4.phases[0].seconds);
  const [cyclesDone, setCyclesDone] = useState(0);

  const [groundingChecked, setGroundingChecked] = useState<boolean[]>([false, false, false, false, false]);
  const [groundingNotes, setGroundingNotes] = useState<string[]>(['', '', '', '', '']);
  const [relaxStep, setRelaxStep] = useState(0);

  const [releaseText, setReleaseText] = useState('');
  const [releasedNotice, setReleasedNotice] = useState(false);
  const [affirmationIdx, setAffirmationIdx] = useState(0);

  const activeBreath = BREATH_CONFIG[breathMode];
  const currentPhase = activeBreath.phases[phaseIdx] || activeBreath.phases[0];

  useEffect(() => {
    setIsRunning(false);
    setPhaseIdx(0);
    setSecondsLeft(BREATH_CONFIG[breathMode].phases[0].seconds);
    setCyclesDone(0);
  }, [breathMode]);

  useEffect(() => {
    if (!isRunning) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;
        setPhaseIdx((currIdx) => {
          const nextIdx = (currIdx + 1) % activeBreath.phases.length;
          if (nextIdx === 0) {
            setCyclesDone((c) => c + 1);
          }
          setSecondsLeft(activeBreath.phases[nextIdx].seconds);
          return nextIdx;
        });
        return 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isRunning, activeBreath]);

  function handleReleaseWrite() {
    if (!releaseText.trim()) return;
    setReleaseText('');
    setReleasedNotice(true);
    window.setTimeout(() => setReleasedNotice(false), 3500);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">
      {/* Header Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch bg-white rounded-2xl border border-[#E8E3F0] overflow-hidden">
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center space-y-3">
          <div className="text-xs font-medium text-[#155E47]">
            Phân hệ 2 · Calm Corner · Góc bình yên
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#242038] text-balance">
            {gradeLevel === 'primary'
              ? 'Cùng hít thở nhẹ nhàng như làn gió mát nhé!'
              : 'Dành vài phút đưa tâm trí và cơ thể trở về trạng thái an toàn'}
          </h1>
          <p className="text-sm text-[#5A5475] leading-relaxed">
            Khi cảm thấy tim đập nhanh, căng thẳng hoặc tức giận, bạn có thể dừng lại ở đây để thực hành hít thở, thư giãn giác quan và buông nhẹ những suy nghĩ nặng nề.
          </p>
        </div>
        <div className="lg:col-span-5 min-h-[200px]">
          <img
            src={VIBE_IMAGES.calm}
            alt="Minh họa mặt hồ sen tĩnh lặng tạo cảm giác bình yên"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Interactive Breathing Pacer + Positive Affirmation Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Breathing Pacer */}
        <div className="lg:col-span-7 bg-[#E5F7F0]/55 rounded-2xl border border-[#CBEFE2] p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display font-bold text-xl text-[#155E47] flex items-center gap-2">
                <Wind className="w-5 h-5" />
                <span>{activeBreath.title}</span>
              </h2>
              <p className="text-xs text-[#2E6F59] mt-1">{activeBreath.subtitle}</p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-[#CBEFE2]">
              <button
                type="button"
                onClick={() => setBreathMode('box_4_4')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  breathMode === 'box_4_4'
                    ? 'bg-[#38B28B] text-white'
                    : 'text-[#155E47] hover:bg-[#E5F7F0]'
                }`}
              >
                Thở 4-4
              </button>
              <button
                type="button"
                onClick={() => setBreathMode('belly_4_2_6')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  breathMode === 'belly_4_2_6'
                    ? 'bg-[#38B28B] text-white'
                    : 'text-[#155E47] hover:bg-[#E5F7F0]'
                }`}
              >
                Thở sâu 4-2-6
              </button>
            </div>
          </div>

          {/* Animated Ring */}
          <div className="py-8 flex flex-col items-center justify-center gap-6">
            <div className="relative w-52 h-52 flex items-center justify-center">
              <div
                className="w-40 h-40 rounded-full bg-[#38B28B]/20 border-2 border-[#38B28B] flex flex-col items-center justify-center text-center transition-transform duration-1000 ease-in-out"
                style={{
                  transform: `scale(${isRunning ? currentPhase.scale : 1})`,
                }}
              >
                <span className="font-mono font-bold text-3xl text-[#155E47] tabular-nums">
                  {secondsLeft}s
                </span>
                <span className="text-xs font-semibold text-[#155E47] mt-1 px-3">
                  {isRunning ? currentPhase.label : 'Sẵn sàng bắt đầu'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsRunning(!isRunning)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#155E47] text-white text-sm font-medium hover:bg-[#0F4937] transition-colors"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isRunning ? 'Tạm dừng' : 'Bắt đầu hít thở'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRunning(false);
                  setPhaseIdx(0);
                  setSecondsLeft(activeBreath.phases[0].seconds);
                  setCyclesDone(0);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#CBEFE2] text-[#155E47] text-sm font-medium hover:bg-[#F2FBF8] transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Làm lại</span>
              </button>
              <span className="text-xs font-medium text-[#155E47] tabular-nums px-2">
                Đã hoàn thành: {cyclesDone} vòng
              </span>
            </div>
          </div>
        </div>

        {/* Positive Affirmation + Expressive Release Pad */}
        <div className="lg:col-span-5 space-y-6">
          {/* Affirmations */}
          <div className="bg-[#FEF6DF]/70 rounded-2xl border border-[#F8E2A5] p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display font-bold text-base text-[#805708] flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Lời nhắn tích cực cho bản thân</span>
              </h3>
              <button
                type="button"
                onClick={() =>
                  setAffirmationIdx((i) => (i + 1) % POSITIVE_AFFIRMATIONS.length)
                }
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#805708] hover:underline"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Đổi lời nhắn</span>
              </button>
            </div>
            <p className="font-display font-semibold text-lg text-[#4B3406] leading-relaxed">
              “{POSITIVE_AFFIRMATIONS[affirmationIdx]}”
            </p>
          </div>

          {/* Ephemeral Write-out Release Pad */}
          <div className="bg-white rounded-2xl border border-[#E8E3F0] p-6 space-y-4">
            <div>
              <h3 className="font-display font-bold text-base text-[#242038] flex items-center gap-2">
                <Feather className="w-4 h-4 text-[#6B4CE6]" />
                <span>Hoạt động viết ra cảm xúc để thả nhẹ</span>
              </h3>
              <p className="text-xs text-[#6B6585] mt-1">
                Viết điều đang làm bạn bực bội hoặc lo âu rồi bấm "Thả trôi" — nội dung này không lưu lại ở bất cứ đâu.
              </p>
            </div>
            <textarea
              rows={3}
              value={releaseText}
              onChange={(e) => setReleaseText(e.target.value)}
              placeholder="Viết ra những gì đang chất chứa trong lòng bạn..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E3DCF8] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]"
            />
            <div className="flex items-center justify-between gap-3">
              {releasedNotice ? (
                <span className="text-xs font-medium text-[#155E47]">
                  Đã thả trôi suy nghĩ ấy rồi. Bạn vừa cho mình một khoảng thở nhẹ nhàng.
                </span>
              ) : (
                <span className="text-xs text-[#6B6585]">Chỉ hiển thị tạm thời trên màn hình</span>
              )}
              <button
                type="button"
                onClick={handleReleaseWrite}
                disabled={!releaseText.trim()}
                className="px-4 py-2 rounded-xl bg-[#EDE8FF] text-[#3E2B85] text-xs font-semibold hover:bg-[#E1D8FE] disabled:opacity-50 whitespace-nowrap"
              >
                Thả trôi nhẹ nhàng
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5-4-3-2-1 Grounding + Progressive Muscle Relaxation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 5-4-3-2-1 Grounding */}
        <div className="bg-white rounded-2xl border border-[#E8E3F0] p-6 space-y-5">
          <div>
            <h2 className="font-display font-bold text-lg text-[#242038]">
              Bài tập Grounding 5-4-3-2-1
            </h2>
            <p className="text-xs text-[#5A5475] mt-1">
              Kéo sự chú ý từ những lo âu trong đầu trở về với hiện tại qua 5 giác quan.
            </p>
          </div>
          <div className="space-y-3">
            {GROUNDING_STEPS.map((step, idx) => {
              const checked = groundingChecked[idx];
              return (
                <div
                  key={step.count}
                  className={`p-3.5 rounded-xl border transition-colors ${
                    checked ? 'bg-[#E5F7F0]/60 border-[#CBEFE2]' : 'bg-[#FCFBF9] border-[#EFEBF7]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setGroundingChecked((prev) => prev.map((v, i) => (i === idx ? !v : v)))
                      }
                      className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                        checked
                          ? 'bg-[#38B28B] border-[#38B28B] text-white'
                          : 'bg-white border-[#D3C9F8]'
                      }`}
                      aria-label={`Đánh dấu bước ${step.count} ${step.sense}`}
                    >
                      {checked && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <div className="flex-1 space-y-1.5">
                      <div className="text-sm font-semibold text-[#242038]">
                        <span className="font-mono text-[#5A3EE0] mr-1.5">{step.count}</span>
                        {step.sense}
                      </div>
                      <p className="text-xs text-[#5A5475]">{step.prompt}</p>
                      <input
                        type="text"
                        value={groundingNotes[idx]}
                        onChange={(e) =>
                          setGroundingNotes((prev) =>
                            prev.map((v, i) => (i === idx ? e.target.value : v))
                          )
                        }
                        placeholder="Ghi nhanh điều bạn nhận thấy (không bắt buộc)..."
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E8E3F0] bg-white focus:outline-none focus:ring-1 focus:ring-[#7C5CFC]"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progressive Muscle Relaxation */}
        <div className="bg-white rounded-2xl border border-[#E8E3F0] p-6 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div>
              <h2 className="font-display font-bold text-lg text-[#242038]">
                Thư giãn cơ thể từng bước
              </h2>
              <p className="text-xs text-[#5A5475] mt-1">
                Thực hiện lần lượt 4 bước để giải phóng căng cứng ở vai, tay và khuôn mặt.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {RELAXATION_STEPS.map((s, idx) => (
                <button
                  key={s.part}
                  type="button"
                  onClick={() => setRelaxStep(idx)}
                  className={`py-2 px-2 rounded-xl text-xs font-medium transition-colors border ${
                    relaxStep === idx
                      ? 'bg-[#EDE8FF] border-[#7C5CFC] text-[#3E2B85]'
                      : 'bg-[#FCFBF9] border-[#EFEBF7] text-[#5A5475]'
                  }`}
                >
                  Bước {idx + 1}
                </button>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-[#F6F3FB] border border-[#E3DCF8] space-y-2">
              <div className="text-xs font-semibold text-[#5A3EE0]">
                Bước {relaxStep + 1}/4 · {RELAXATION_STEPS[relaxStep].part}
              </div>
              <p className="text-base text-[#242038] leading-relaxed font-medium">
                {RELAXATION_STEPS[relaxStep].instruction}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#F0ECF7]">
            <button
              type="button"
              disabled={relaxStep === 0}
              onClick={() => setRelaxStep((s) => Math.max(0, s - 1))}
              className="px-4 py-2 text-xs font-medium rounded-xl border border-[#E3DCF8] text-[#5A5475] disabled:opacity-40"
            >
              Bước trước
            </button>
            <button
              type="button"
              onClick={() => setRelaxStep((s) => (s + 1) % RELAXATION_STEPS.length)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#6B4CE6] text-white hover:bg-[#5A3BD6]"
            >
              {relaxStep < RELAXATION_STEPS.length - 1 ? 'Bước tiếp theo' : 'Quay lại bước 1'}
            </button>
          </div>
        </div>
      </div>

      {/* Coping Guidance Cards */}
      <div className="space-y-4">
        <h2 className="font-display font-bold text-xl text-[#242038]">
          Gợi ý ứng phó an toàn theo tình huống
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {COPING_CARDS.map((card) => (
            <div key={card.category} className={`p-6 rounded-2xl border ${card.tint} space-y-3`}>
              <h3 className="font-display font-bold text-base text-[#242038]">{card.category}</h3>
              <ul className="space-y-2.5 text-sm text-[#4A4463]">
                {card.tips.map((tip, i) => (
                  <li key={i} className="leading-relaxed">
                    • {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
