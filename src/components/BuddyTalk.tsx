import React, { useEffect, useState } from 'react';
import {
  HeartHandshake,
  MessageCircleHeart,
  RotateCcw,
  Send,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import type {
  ActiveModule,
  BuddyTalkOption,
  BuddyTalkStep,
  GradeLevel,
  UserProfile,
} from '../types/index.ts';
import { SAFETY_KEYWORDS } from '../data/vibeData.ts';
import { apiFetch } from '../lib/api.ts';

interface BuddyTalkProps {
  gradeLevel: GradeLevel;
  user: UserProfile | null;
  onNavigate: (mod: ActiveModule) => void;
  onOpenAuth: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user' | 'safety';
  text: string;
  actionHint?: string;
}

export function BuddyTalk({ gradeLevel, user, onNavigate, onOpenAuth }: BuddyTalkProps) {
  const [steps, setSteps] = useState<BuddyTalkStep[]>([]);
  const [currentStepId, setCurrentStepId] = useState<string>('step-1');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [helpNote, setHelpNote] = useState('');
  const [signalSent, setSignalSent] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    apiFetch<{ steps: BuddyTalkStep[] }>('/api/buddytalk/flows')
      .then((res) => {
        setSteps(res.steps);
        const first = res.steps.find((s) => s.id === 'step-1') || res.steps[0];
        if (first) {
          setCurrentStepId(first.id);
          setMessages([
            {
              id: 'init-bot',
              sender: 'bot',
              text:
                gradeLevel === 'primary'
                  ? 'Chào bạn nhỏ! Mình là Buddy Talk đây. Hôm nay bạn cảm thấy trong lòng thế nào?'
                  : first.question,
            },
          ]);
        }
      })
      .catch(() => {});
  }, [gradeLevel]);

  const currentStep = steps.find((s) => s.id === currentStepId);

  function resetChat() {
    const first = steps.find((s) => s.id === 'step-1') || steps[0];
    setCompleted(false);
    setSignalSent(false);
    if (first) {
      setCurrentStepId(first.id);
      setMessages([
        {
          id: `reset-${Date.now()}`,
          sender: 'bot',
          text:
            gradeLevel === 'primary'
              ? 'Chào bạn nhỏ! Chúng mình cùng trò chuyện lại từ đầu nhé. Hôm nay bạn thấy thế nào?'
              : first.question,
        },
      ]);
    }
  }

  function handleSelectOption(opt: BuddyTalkOption) {
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: opt.label,
    };
    const nextMessages: ChatMessage[] = [
      userMsg,
      {
        id: `b-reply-${Date.now()}`,
        sender: 'bot',
        text: opt.empathyReply,
        actionHint: opt.suggestedAction,
      },
    ];

    if (opt.nextStepId === 'finish' || opt.nextStepId === 'support_redirect') {
      setCompleted(true);
      setMessages((prev) => [...prev, ...nextMessages]);
      return;
    }

    const nextStep = steps.find((s) => s.id === opt.nextStepId);
    if (nextStep) {
      nextMessages.push({
        id: `b-q-${Date.now() + 1}`,
        sender: 'bot',
        text: nextStep.question,
      });
      setCurrentStepId(nextStep.id);
    } else {
      setCompleted(true);
    }
    setMessages((prev) => [...prev, ...nextMessages]);
  }

  async function handleCustomSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = customInput.trim();
    if (!trimmed) return;
    setCustomInput('');

    const userMsg: ChatMessage = {
      id: `uc-${Date.now()}`,
      sender: 'user',
      text: trimmed,
    };

    const lowered = trimmed.toLowerCase();
    const hasSafetyConcern = SAFETY_KEYWORDS.some((kw) => lowered.includes(kw));

    if (hasSafetyConcern) {
      const safetyMsg: ChatMessage = {
        id: `safe-${Date.now()}`,
        sender: 'safety',
        text:
          'Mình nghe thấy bạn đang trải qua cảm giác rất nặng nề hoặc không an toàn. Bạn không cần phải tự chịu đựng một mình lúc này. Xin hãy kết nối ngay với bố mẹ, thầy cô giáo đáng tin cậy hoặc Phòng Tâm lý học đường FPT Hà Nam để được ở bên lắng nghe và bảo vệ bạn.',
      };
      setMessages((prev) => [...prev, userMsg, safetyMsg]);
      setShowHelpPanel(true);
      if (user) {
        apiFetch('/api/buddytalk/safety-signal', {
          method: 'POST',
          body: JSON.stringify({
            source: 'buddy_talk',
            triggerSummary: 'Phát hiện chia sẻ liên quan đến an toàn của học sinh trong Buddy Talk',
            studentMessageExcerpt: trimmed,
            gradeLevel,
          }),
        }).catch(() => {});
      }
      return;
    }

    const botFollowUp: ChatMessage = {
      id: `bc-${Date.now()}`,
      sender: 'bot',
      text:
        'Cảm ơn bạn đã diễn đạt suy nghĩ của mình. Bạn có thể chọn một gợi ý bên dưới để tiếp tục khám phá điều mình cần lúc này nhé.',
    };
    setMessages((prev) => [...prev, userMsg, botFollowUp]);
  }

  async function handleSendSafetySignal() {
    if (!user) {
      onOpenAuth();
      return;
    }
    try {
      await apiFetch('/api/buddytalk/safety-signal', {
        method: 'POST',
        body: JSON.stringify({
          source: 'manual_help_button',
          triggerSummary: 'Học sinh chủ động nhấn nút "Mình cần người hỗ trợ" trong Buddy Talk',
          studentMessageExcerpt:
            helpNote.trim() || 'Học sinh mong muốn được kết nối với cán bộ Phòng Tâm lý học đường.',
          gradeLevel,
        }),
      });
      setSignalSent(true);
      setHelpNote('');
    } catch {
      // ignore error
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      {/* Header with Always-Visible Help Button */}
      <div className="bg-white rounded-2xl border border-[#E8E3F0] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-medium text-[#5A3EE0]">
            Phân hệ 3 · Buddy Talk · Kịch bản được chuyên viên tâm lý kiểm duyệt
          </div>
          <h1 className="font-display font-bold text-2xl text-[#242038] flex items-center gap-2">
            <MessageCircleHeart className="w-6 h-6 text-[#6B4CE6]" />
            <span>Người bạn đồng hành Buddy Talk</span>
          </h1>
          <p className="text-xs text-[#6B6585]">
            Buddy Talk giúp bạn gọi tên cảm xúc và tìm hướng ứng phó nhẹ nhàng — không chẩn đoán bệnh lý và không thay thế tham vấn trực tiếp.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={resetChat}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#E3DCF8] bg-[#FCFBF9] text-xs font-medium text-[#5A5475] hover:bg-[#F3EEFF] whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Bắt đầu lại</span>
          </button>
          <button
            type="button"
            onClick={() => setShowHelpPanel(!showHelpPanel)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E56B6F] text-white text-xs sm:text-sm font-semibold hover:bg-[#D6585C] transition-colors whitespace-nowrap"
          >
            <HeartHandshake className="w-4 h-4 shrink-0" />
            <span>Mình cần người hỗ trợ</span>
          </button>
        </div>
      </div>

      {/* Persistent Immediate Help Drawer when toggled */}
      {showHelpPanel && (
        <div className="bg-[#FEECEB]/75 border border-[#F5C6C4] rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#8D282C] shrink-0 mt-0.5" />
            <div className="space-y-1.5 flex-1">
              <h2 className="font-display font-bold text-base text-[#8D282C]">
                Kết nối ngay với người lớn đáng tin cậy hoặc Phòng Tâm lý học đường
              </h2>
              <p className="text-xs sm:text-sm text-[#612224] leading-relaxed">
                Nếu bạn đang gặp nguy hiểm, bị bạo lực hoặc có ý nghĩ tự làm hại bản thân, hãy báo ngay cho bố mẹ, giáo viên gần nhất hoặc liên hệ đường dây nóng bảo vệ trẻ em <strong>111</strong> (miễn phí 24/7). Tại trường FPT Hà Nam, Phòng Tâm lý học đường luôn sẵn sàng lắng nghe bạn.
              </p>
            </div>
          </div>

          {signalSent ? (
            <div className="p-3.5 rounded-xl bg-white border border-[#CBEFE2] text-xs font-medium text-[#155E47] flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Đã gửi tín hiệu cần hỗ trợ tới Phòng Tâm lý học đường để chuyên viên xác minh và liên hệ bạn.
              </span>
              <button
                type="button"
                onClick={() => onNavigate('get-support')}
                className="underline font-semibold whitespace-nowrap"
              >
                Mở trang Kết nối hỗ trợ
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={helpNote}
                onChange={(e) => setHelpNote(e.target.value)}
                placeholder="Nhắn ngắn điều bạn muốn thầy cô tâm lý biết (không bắt buộc)..."
                className="flex-1 px-3.5 py-2.5 text-sm rounded-xl border border-[#F2C3C0] bg-white focus:outline-none focus:ring-2 focus:ring-[#E56B6F]"
              />
              <button
                type="button"
                onClick={handleSendSafetySignal}
                className="px-4 py-2.5 rounded-xl bg-[#8D282C] text-white text-xs font-semibold hover:bg-[#731E21] whitespace-nowrap"
              >
                {user ? 'Gửi tín hiệu tới Phòng Tâm lý' : 'Đăng nhập để gửi tín hiệu'}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('get-support')}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#E8C5C3] text-[#8D282C] text-xs font-semibold hover:bg-[#FFF5F5] whitespace-nowrap"
              >
                Điền phiếu tham vấn
              </button>
            </div>
          )}
        </div>
      )}

      {/* Conversation Viewport */}
      <div className="bg-white rounded-2xl border border-[#E8E3F0] overflow-hidden flex flex-col">
        <div className="p-5 sm:p-6 space-y-4 max-h-[420px] overflow-y-auto bg-[#FCFBF9]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-[#6B4CE6] text-white'
                    : msg.sender === 'safety'
                      ? 'bg-[#FEECEB] border border-[#F5C6C4] text-[#612224]'
                      : 'bg-white border border-[#E8E3F0] text-[#242038]'
                }`}
              >
                <p>{msg.text}</p>
                {msg.actionHint && (
                  <div className="pt-1 flex flex-wrap gap-2">
                    {msg.actionHint.includes('Góc bình yên') && (
                      <button
                        type="button"
                        onClick={() => onNavigate('calm-corner')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E5F7F0] text-[#155E47] text-xs font-semibold hover:bg-[#D2F0E4]"
                      >
                        <span>{msg.actionHint}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {msg.actionHint.includes('Nhật ký') && (
                      <button
                        type="button"
                        onClick={() => onNavigate('emotion-diary')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EAF2FE] text-[#1E468C] text-xs font-semibold hover:bg-[#D8E7FD]"
                      >
                        <span>{msg.actionHint}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {msg.actionHint.includes('Thư viện') && (
                      <button
                        type="button"
                        onClick={() => onNavigate('library')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FEF6DF] text-[#805708] text-xs font-semibold hover:bg-[#FDECB8]"
                      >
                        <span>{msg.actionHint}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {msg.actionHint.includes('hỗ trợ') && (
                      <button
                        type="button"
                        onClick={() => onNavigate('get-support')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EDE8FF] text-[#3E2B85] text-xs font-semibold hover:bg-[#E1D8FE]"
                      >
                        <span>{msg.actionHint}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Guided Choice Buttons */}
        <div className="p-5 bg-white border-t border-[#EFEBF7] space-y-4">
          {!completed && currentStep ? (
            <div className="space-y-2.5">
              <div className="text-xs font-medium text-[#6B6585]">
                Chọn câu trả lời phù hợp với bạn:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentStep.options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt)}
                    className="p-3.5 rounded-xl border border-[#E3DCF8] bg-[#FAF8FF] hover:bg-[#EDE8FF] hover:border-[#7C5CFC] text-left text-sm font-medium text-[#242038] transition-colors"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#F6F3FB] flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs sm:text-sm text-[#3E2B85] font-medium">
                Cảm ơn bạn đã dành thời gian trò chuyện cùng Buddy Talk hôm nay.
              </span>
              <button
                type="button"
                onClick={resetChat}
                className="px-4 py-2 rounded-xl bg-[#6B4CE6] text-white text-xs font-semibold hover:bg-[#5A3BD6]"
              >
                Trò chuyện lượt mới
              </button>
            </div>
          )}

          {/* Optional Free-Text Expression */}
          <form onSubmit={handleCustomSend} className="flex items-center gap-2 pt-2 border-t border-[#F4F0FA]">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Hoặc viết thêm vài dòng suy nghĩ của bạn tại đây..."
              className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-[#E3DCF8] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]"
            />
            <button
              type="submit"
              disabled={!customInput.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#6B4CE6] text-white text-sm font-medium hover:bg-[#5A3BD6] disabled:opacity-40 whitespace-nowrap"
            >
              <Send className="w-4 h-4" />
              <span>Gửi</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
