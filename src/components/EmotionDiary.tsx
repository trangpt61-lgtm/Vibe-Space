import React, { useEffect, useMemo, useState } from 'react';
import { Lock, Plus, Trash2, Calendar, BookOpenText, CheckCircle2, UserCheck } from 'lucide-react';
import type { DiaryEntry, EmotionId, GradeLevel, UserProfile } from '../types/index.ts';
import { EMOTIONS, EMOTION_MAP } from '../data/vibeData.ts';
import { DIARY_STICKERS, DiaryStickerBadge, EmotionIllustration } from './VibeIcons.tsx';
import { apiFetch } from '../lib/api.ts';

interface EmotionDiaryProps {
  gradeLevel: GradeLevel;
  user: UserProfile | null;
  onOpenAuth: () => void;
}

const GUEST_DEMO_DIARY: DiaryEntry[] = [
  {
    id: 'guest-dia-1',
    studentId: 'guest',
    emotion: 'binh_yen',
    sticker: 'lotus',
    feelingToday: 'Hôm nay mình thấy nhẹ nhõm hơn sau khi hoàn thành bài thuyết trình.',
    whatHappened: 'Mình đã chuẩn bị kỹ thẻ ghi chú nên nói khá trôi chảy trước lớp.',
    joyOrSadness: 'Điều khiến mình vui là các bạn trong nhóm đã vỗ tay cổ vũ.',
    howICoped: 'Trước khi lên nói, mình hít thở 4 nhịp theo hướng dẫn ở Góc bình yên.',
    gratitude: 'Mình biết ơn cô giáo đã cho mình thêm 1 ngày hoàn thiện slide.',
    positiveNote: 'Cứ từng bước chuẩn bị kỹ, mình sẽ làm tốt hơn mỗi ngày.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isDemoData: true,
  },
];

export function EmotionDiary({ gradeLevel, user, onOpenAuth }: EmotionDiaryProps) {
  const [entries, setEntries] = useState<DiaryEntry[]>(GUEST_DEMO_DIARY);
  const [selectedEmotionFilter, setSelectedEmotionFilter] = useState<'all' | EmotionId>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [emotion, setEmotion] = useState<EmotionId>('binh_yen');
  const [sticker, setSticker] = useState('sunbeam');
  const [feelingToday, setFeelingToday] = useState('');
  const [whatHappened, setWhatHappened] = useState('');
  const [joyOrSadness, setJoyOrSadness] = useState('');
  const [howICoped, setHowICoped] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [positiveNote, setPositiveNote] = useState('');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  const isStudent = user?.role === 'student';
  const isAdultBlocked = Boolean(user && user.role !== 'student');

  useEffect(() => {
    if (isStudent) {
      apiFetch<{ items: DiaryEntry[] }>('/api/diary')
        .then((res) => setEntries(res.items))
        .catch(() => {});
    } else if (!user) {
      setEntries(GUEST_DEMO_DIARY);
    }
  }, [isStudent, user]);

  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      if (selectedEmotionFilter !== 'all' && item.emotion !== selectedEmotionFilter) {
        return false;
      }
      if (dateFilter && !item.createdAt.startsWith(dateFilter)) {
        return false;
      }
      return true;
    });
  }, [entries, selectedEmotionFilter, dateFilter]);

  async function handleSaveEntry(e: React.FormEvent) {
    e.preventDefault();
    if (!feelingToday.trim() && !whatHappened.trim()) return;
    setSaving(true);
    setFeedback('');

    try {
      if (isStudent) {
        const res = await apiFetch<{ item: DiaryEntry }>('/api/diary', {
          method: 'POST',
          body: JSON.stringify({
            emotion,
            sticker,
            feelingToday,
            whatHappened,
            joyOrSadness,
            howICoped,
            gratitude,
            positiveNote,
          }),
        });
        setEntries((prev) => [res.item, ...prev]);
        setFeedback('Đã lưu trang nhật ký mới vào không gian riêng tư của bạn.');
      } else {
        const localItem: DiaryEntry = {
          id: `local-dia-${Date.now()}`,
          studentId: 'guest',
          emotion,
          sticker,
          feelingToday,
          whatHappened,
          joyOrSadness,
          howICoped,
          gratitude,
          positiveNote,
          createdAt: new Date().toISOString(),
          isDemoData: false,
        };
        setEntries((prev) => [localItem, ...prev]);
        setFeedback('Đã lưu tạm trên phiên hiện tại. Đăng nhập Học sinh để lưu trữ riêng tư.');
      }
      setFeelingToday('');
      setWhatHappened('');
      setJoyOrSadness('');
      setHowICoped('');
      setGratitude('');
      setPositiveNote('');
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (isStudent) {
      await apiFetch(`/api/diary/${id}`, { method: 'DELETE' }).catch(() => {});
    }
    setEntries((prev) => prev.filter((item) => item.id !== id));
  }

  if (isAdultBlocked) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white rounded-2xl border border-[#E8E3F0] p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EDE8FF] text-[#462C9E] flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-display font-bold text-xl text-[#242038]">
            Nhật ký cảm xúc được bảo mật riêng tư cho học sinh
          </h1>
          <p className="text-sm text-[#5A5475] leading-relaxed">
            Theo nguyên tắc bảo vệ dữ liệu cá nhân và quyền riêng tư trẻ em, nội dung Nhật ký cảm xúc chỉ hiển thị cho chính học sinh viết nhật ký — không công khai cho phụ huynh, giáo viên hoặc người dùng khác.
          </p>
          <button
            type="button"
            onClick={onOpenAuth}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6B4CE6] text-white text-sm font-medium hover:bg-[#5A3BD6]"
          >
            <span>Chuyển sang tài khoản Học sinh Demo để trải nghiệm</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EFEBF7] pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs font-medium text-[#1E468C] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>Phân hệ 4 · Emotion Diary · Bảo mật riêng tư cho học sinh</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#242038]">
            Nhật ký cảm xúc của riêng bạn
          </h1>
          <p className="text-sm text-[#5A5475]">
            {gradeLevel === 'primary'
              ? 'Hãy chọn một sticker đáng yêu và viết lại câu chuyện hôm nay của bạn nhé!'
              : 'Nơi lưu giữ chân thực cảm xúc, điều bạn học được và những khoảnh khắc đáng trân trọng mỗi ngày.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {!isStudent && (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#F3EEFF] text-[#3E2B85] text-xs font-semibold hover:bg-[#E7DEFF]"
            >
              <UserCheck className="w-4 h-4" />
              <span>Đăng nhập Học sinh</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6B4CE6] text-white text-sm font-semibold hover:bg-[#5A3BD6] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{showForm ? 'Thu gọn biểu mẫu' : 'Viết nhật ký mới'}</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-[#E5F7F0] text-[#155E47] text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* New Diary Form */}
      {showForm && (
        <form
          onSubmit={handleSaveEntry}
          className="bg-white rounded-2xl border border-[#E8E3F0] p-6 sm:p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emotion Pick */}
            <div className="space-y-2.5">
              <label className="block font-display font-semibold text-sm text-[#242038]">
                Cảm xúc chủ đạo hôm nay
              </label>
              <div className="grid grid-cols-4 gap-2">
                {EMOTIONS.map((em) => (
                  <button
                    key={em.id}
                    type="button"
                    onClick={() => setEmotion(em.id)}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-colors ${
                      emotion === em.id
                        ? 'bg-[#EDE8FF] border-[#7C5CFC]'
                        : 'bg-[#FCFBF9] border-[#EFEBF7] hover:bg-white'
                    }`}
                  >
                    <EmotionIllustration emotion={em.id} size={30} />
                    <span className="text-[11px] font-medium text-[#242038]">{em.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sticker Pick */}
            <div className="space-y-2.5">
              <label className="block font-display font-semibold text-sm text-[#242038]">
                Chọn sticker trang trí trang nhật ký
              </label>
              <div className="grid grid-cols-5 gap-2">
                {DIARY_STICKERS.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSticker(st.id)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-colors ${
                      sticker === st.id
                        ? 'bg-[#FEF6DF] border-[#F4B740]'
                        : 'bg-[#FCFBF9] border-[#EFEBF7] hover:bg-white'
                    }`}
                  >
                    <DiaryStickerBadge stickerId={st.id} size={28} />
                    <span className="text-[11px] font-medium text-[#4A4463]">{st.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#242038] mb-1">
                1. Hôm nay mình cảm thấy thế nào?
              </label>
              <textarea
                rows={2}
                required
                value={feelingToday}
                onChange={(e) => setFeelingToday(e.target.value)}
                placeholder="Mô tả ngắn gọn cảm giác của bạn hôm nay..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E3DCF8] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242038] mb-1">
                2. Điều gì đã xảy ra?
              </label>
              <textarea
                rows={2}
                value={whatHappened}
                onChange={(e) => setWhatHappened(e.target.value)}
                placeholder="Kể lại sự việc hoặc khoảnh khắc đáng nhớ..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E3DCF8] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242038] mb-1">
                3. Điều gì khiến mình vui hoặc buồn?
              </label>
              <textarea
                rows={2}
                value={joyOrSadness}
                onChange={(e) => setJoyOrSadness(e.target.value)}
                placeholder="Điều chạm đến cảm xúc của bạn nhất..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E3DCF8] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242038] mb-1">
                4. Mình đã làm gì để vượt qua cảm xúc đó?
              </label>
              <textarea
                rows={2}
                value={howICoped}
                onChange={(e) => setHowICoped(e.target.value)}
                placeholder="Ví dụ: Hít thở sâu, nói chuyện với bạn hoặc nghe nhạc..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E3DCF8] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242038] mb-1">
                5. Điều mình biết ơn hôm nay
              </label>
              <input
                type="text"
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                placeholder="Một người, một khoảnh khắc hoặc một điều nhỏ bé..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E3DCF8] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242038] mb-1">
                6. Một lời nhắn tích cực dành cho bản thân
              </label>
              <input
                type="text"
                value={positiveNote}
                onChange={(e) => setPositiveNote(e.target.value)}
                placeholder="Lời động viên nhẹ nhàng bạn muốn gửi chính mình..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E3DCF8] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 rounded-xl border border-[#E3DCF8] text-sm font-medium text-[#5A5475]"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#6B4CE6] text-white text-sm font-semibold hover:bg-[#5A3BD6] disabled:opacity-50"
            >
              {saving ? 'Đang lưu...' : 'Lưu trang nhật ký'}
            </button>
          </div>
        </form>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#E8E3F0] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedEmotionFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedEmotionFilter === 'all'
                ? 'bg-[#6B4CE6] text-white'
                : 'bg-[#F6F3FB] text-[#5A5475] hover:bg-[#EDE8FF]'
            }`}
          >
            Tất cả cảm xúc
          </button>
          {EMOTIONS.map((em) => (
            <button
              key={em.id}
              type="button"
              onClick={() => setSelectedEmotionFilter(em.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedEmotionFilter === em.id
                  ? 'bg-[#6B4CE6] text-white'
                  : 'bg-[#F6F3FB] text-[#5A5475] hover:bg-[#EDE8FF]'
              }`}
            >
              {em.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#6B6585]" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            aria-label="Lọc nhật ký theo ngày"
            className="px-3 py-1.5 text-xs rounded-lg border border-[#E3DCF8] bg-[#FCFBF9] text-[#242038]"
          />
          {dateFilter && (
            <button
              type="button"
              onClick={() => setDateFilter('')}
              className="text-xs text-[#5A3EE0] hover:underline"
            >
              Xóa ngày
            </button>
          )}
        </div>
      </div>

      {/* Diary Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E3F0] p-12 text-center space-y-3">
          <BookOpenText className="w-8 h-8 text-[#8E83A8] mx-auto" />
          <p className="text-sm font-medium text-[#242038]">
            Chưa có trang nhật ký nào khớp với bộ lọc hiện tại.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedEmotionFilter('all');
              setDateFilter('');
              setShowForm(true);
            }}
            className="px-4 py-2 rounded-xl bg-[#EDE8FF] text-[#3E2B85] text-xs font-semibold"
          >
            Viết trang nhật ký đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredEntries.map((entry) => {
            const meta = EMOTION_MAP[entry.emotion];
            const dateStr = new Date(entry.createdAt).toLocaleDateString('vi-VN', {
              weekday: 'long',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            });
            return (
              <article
                key={entry.id}
                className="bg-white rounded-2xl border border-[#E8E3F0] p-6 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3 border-b border-[#F4F0FA] pb-3.5">
                    <div className="flex items-center gap-3">
                      <EmotionIllustration emotion={entry.emotion} size={40} />
                      <div>
                        <div className="font-display font-bold text-base text-[#242038]">
                          {meta.label}
                        </div>
                        <div className="text-xs text-[#6B6585]">
                          {dateStr}
                          {entry.isDemoData ? ' · Dữ liệu minh họa' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DiaryStickerBadge stickerId={entry.sticker} size={30} />
                      <button
                        type="button"
                        onClick={() => handleDelete(entry.id)}
                        className="p-1.5 rounded-lg text-[#8E83A8] hover:text-[#8D282C] hover:bg-[#FEECEB]"
                        aria-label="Xóa trang nhật ký"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-sm text-[#3D3759]">
                    {entry.feelingToday && (
                      <div>
                        <span className="text-xs font-semibold text-[#6B6585] block">
                          Hôm nay mình cảm thấy:
                        </span>
                        <p>{entry.feelingToday}</p>
                      </div>
                    )}
                    {entry.whatHappened && (
                      <div>
                        <span className="text-xs font-semibold text-[#6B6585] block">
                          Điều đã xảy ra:
                        </span>
                        <p>{entry.whatHappened}</p>
                      </div>
                    )}
                    {entry.joyOrSadness && (
                      <div>
                        <span className="text-xs font-semibold text-[#6B6585] block">
                          Điều làm mình vui / buồn:
                        </span>
                        <p>{entry.joyOrSadness}</p>
                      </div>
                    )}
                    {entry.howICoped && (
                      <div>
                        <span className="text-xs font-semibold text-[#6B6585] block">
                          Cách mình vượt qua:
                        </span>
                        <p>{entry.howICoped}</p>
                      </div>
                    )}
                    {entry.gratitude && (
                      <div>
                        <span className="text-xs font-semibold text-[#6B6585] block">
                          Điều biết ơn hôm nay:
                        </span>
                        <p>{entry.gratitude}</p>
                      </div>
                    )}
                  </div>
                </div>

                {entry.positiveNote && (
                  <div className="p-3.5 rounded-xl bg-[#FEF6DF]/70 text-xs font-medium text-[#694808]">
                    Lời nhắn cho mình: “{entry.positiveNote}”
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
