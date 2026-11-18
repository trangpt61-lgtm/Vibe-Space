import React from 'react';
import {
  Smile,
  Wind,
  MessageCircleHeart,
  BookOpenText,
  HeartHandshake,
  Library,
  Users,
  ShieldCheck,
  ArrowRight,
  Lock,
} from 'lucide-react';
import type { ActiveModule, GradeLevel, UserProfile } from '../types/index.ts';
import { GRADE_LEVEL_CONFIG, VIBE_IMAGES } from '../data/vibeData.ts';

interface HomePageProps {
  gradeLevel: GradeLevel;
  onChangeGradeLevel: (g: GradeLevel) => void;
  onNavigate: (mod: ActiveModule) => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
}

export function HomePage({
  gradeLevel,
  onChangeGradeLevel,
  onNavigate,
  user,
  onOpenAuth,
}: HomePageProps) {
  const gradeCfg = GRADE_LEVEL_CONFIG[gradeLevel];

  const studentModules: {
    id: ActiveModule;
    title: string;
    subtitle: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
    tint: string;
    iconBg: string;
  }[] = [
    {
      id: 'my-feelings',
      title: 'My Feelings',
      subtitle: 'Không gian cảm xúc',
      desc: 'Check-in cảm xúc hằng ngày với biểu tượng sinh động và theo dõi biểu đồ tâm trạng theo tuần, tháng.',
      icon: Smile,
      tint: 'bg-[#FEF6DF]/70',
      iconBg: 'bg-[#FDE6A8] text-[#805708]',
    },
    {
      id: 'calm-corner',
      title: 'Calm Corner',
      subtitle: 'Góc bình yên',
      desc: 'Thực hành hít thở 4-4, bài tập 5-4-3-2-1, thư giãn cơ thể và những lời nhắn dịu dàng cho bản thân.',
      icon: Wind,
      tint: 'bg-[#E5F7F0]/75',
      iconBg: 'bg-[#CBEFE2] text-[#155E47]',
    },
    {
      id: 'buddy-talk',
      title: 'Buddy Talk',
      subtitle: 'Người bạn đồng hành',
      desc: 'Trò chuyện từng bước để gọi tên điều đang làm bạn bận tâm và tìm cách ứng phó phù hợp, an toàn.',
      icon: MessageCircleHeart,
      tint: 'bg-[#F3EEFF]/80',
      iconBg: 'bg-[#E2D8FE] text-[#462C9E]',
    },
    {
      id: 'emotion-diary',
      title: 'Emotion Diary',
      subtitle: 'Nhật ký cảm xúc',
      desc: 'Không gian viết riêng tư với câu hỏi gợi mở, sticker đáng yêu và bộ lọc theo cảm xúc, ngày tháng.',
      icon: BookOpenText,
      tint: 'bg-[#EAF2FE]/70',
      iconBg: 'bg-[#D3E4FD] text-[#1E468C]',
    },
    {
      id: 'get-support',
      title: 'Get Support',
      subtitle: 'Kết nối hỗ trợ',
      desc: 'Gửi yêu cầu hỗ trợ hoặc đăng ký tham vấn cá nhân cùng Phòng Tâm lý học đường FPT Hà Nam.',
      icon: HeartHandshake,
      tint: 'bg-[#FEECEB]/65',
      iconBg: 'bg-[#FCD2D0] text-[#8D282C]',
    },
    {
      id: 'library',
      title: 'Psychology Library',
      subtitle: 'Thư viện tâm lý',
      desc: 'Bài viết, tình huống thực tế và bài tập kỹ năng sống phân chia riêng cho Tiểu học, THCS và THPT.',
      icon: Library,
      tint: 'bg-[#F6F2EA]/80',
      iconBg: 'bg-[#EDE4D3] text-[#5E4B2E]',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8 py-2">
            <div className="space-y-5">
              <div className="text-xs font-medium text-[#5A5475] flex flex-wrap items-center gap-2">
                <span>Trường Tiểu học, THCS & THPT FPT Hà Nam</span>
                <span aria-hidden="true">·</span>
                <span>Không gian sức khỏe tinh thần học đường</span>
              </div>

              <h1 className="font-display font-bold text-3xl sm:text-5xl leading-[1.16] tracking-tight text-[#242038] text-balance">
                {gradeCfg.heroWelcome}
              </h1>

              <p className="text-base sm:text-lg text-[#5A5475] leading-relaxed max-w-2xl">
                {gradeCfg.heroSub}
              </p>

              <p className="text-sm font-medium text-[#5A3EE0]">
                Understand yourself – Express your feelings – Connect with care.
              </p>
            </div>

            {/* Grade Level Personalization Switcher */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-[#E8E3F0] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#242038]">
                    Cá nhân hóa không gian theo cấp học
                  </span>
                  <span className="text-xs text-[#6B6585]">{gradeCfg.toneNote}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['primary', 'middle', 'high'] as GradeLevel[]).map((g) => {
                    const cfg = GRADE_LEVEL_CONFIG[g];
                    const active = gradeLevel === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => onChangeGradeLevel(g)}
                        className={`px-3 py-2.5 rounded-xl text-left transition-colors border ${
                          active
                            ? 'bg-[#EDE8FF] border-[#7C5CFC] text-[#3E2B85]'
                            : 'bg-[#FCFBF9] border-[#E8E3F0] text-[#5A5475] hover:bg-[#F6F3FB]'
                        }`}
                      >
                        <div className="font-display font-semibold text-sm">{cfg.label}</div>
                        <div className="text-[11px] opacity-80">{cfg.ageRange}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('my-feelings')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6B4CE6] text-white font-medium text-sm hover:bg-[#5A3BD6] transition-colors whitespace-nowrap"
                >
                  <span>Check-in cảm xúc ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('buddy-talk')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#E5F7F0] text-[#155E47] font-medium text-sm hover:bg-[#D4F2E7] transition-colors whitespace-nowrap"
                >
                  <span>Trò chuyện cùng Buddy Talk</span>
                </button>
                {!user && (
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-[#E3DCF8] bg-white text-[#3E2B85] font-medium text-sm hover:bg-[#F6F3FB] transition-colors whitespace-nowrap"
                  >
                    <span>Chọn tài khoản Demo</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Visual Stage */}
          <div className="lg:col-span-5 flex">
            <div className="w-full rounded-2xl overflow-hidden border border-[#E8E3F0] bg-[#F6F3FB] flex flex-col">
              <div className="relative flex-1 min-h-[280px]">
                <img
                  src={VIBE_IMAGES.hero}
                  alt="Không gian lắng nghe và chăm sóc cảm xúc ấm áp tại Trường FPT Hà Nam"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 bg-white border-t border-[#F0ECF7] space-y-1.5">
                <p className="font-display font-semibold text-sm text-[#242038]">
                  VIBE SPACE – Không gian để hiểu mình, lắng nghe cảm xúc và kết nối yêu thương
                </p>
                <p className="text-xs text-[#6B6585] leading-relaxed">
                  Mọi nhật ký cá nhân và chia sẻ riêng tư của học sinh đều được bảo vệ nghiêm ngặt, chỉ phục vụ mục đích nâng đỡ tinh thần và an toàn học đường.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Student Modules */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EFEBF7] pb-4">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#242038] text-balance">
              Các phân hệ dành cho học sinh
            </h2>
            <p className="text-sm text-[#5A5475] mt-1">
              Lựa chọn công cụ phù hợp với nhu cầu của bạn ngay lúc này · Đang hiển thị theo cấp {gradeCfg.label}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('get-support')}
            className="text-sm font-semibold text-[#5A3EE0] hover:underline whitespace-nowrap shrink-0"
          >
            Cần gặp Phòng Tâm lý học đường? →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {studentModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => onNavigate(mod.id)}
                className={`group text-left p-6 rounded-2xl border border-[#E8E3F0] ${mod.tint} hover:bg-white hover:border-[#CBBDFB] transition-colors flex flex-col justify-between gap-5`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${mod.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8E83A8] group-hover:translate-x-0.5 group-hover:text-[#5A3EE0] transition-transform" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#6B6585]">{mod.subtitle}</div>
                    <h3 className="font-display font-bold text-lg text-[#242038] mt-0.5">
                      {mod.title}
                    </h3>
                    <p className="text-sm text-[#5A5475] leading-relaxed mt-2">{mod.desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Role Portals: Parent & Teacher + Psychology Admin */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Parent & Teacher Corner */}
          <div className="p-7 rounded-2xl bg-white border border-[#E8E3F0] flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#E5F7F0] text-[#155E47] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-xs font-medium text-[#6B6585]">
                Phân hệ 7 · Dành cho người lớn đồng hành
              </div>
              <h3 className="font-display font-bold text-xl text-[#242038]">
                Góc Phụ huynh & Giáo viên
              </h3>
              <p className="text-sm text-[#5A5475] leading-relaxed">
                Tài liệu tâm lý lứa tuổi, kỹ năng lắng nghe không phán xét, nhận diện sớm dấu hiệu học sinh gặp khó khăn và quy trình phối hợp an toàn với Phòng Tâm lý học đường.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#F0ECF7]">
              <span className="text-xs text-[#6B6585]">
                Không hiển thị nhật ký riêng tư của học sinh
              </span>
              <button
                type="button"
                onClick={() => onNavigate('parent-teacher')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E5F7F0] text-[#155E47] font-medium text-sm hover:bg-[#D1F0E4] transition-colors whitespace-nowrap"
              >
                <span>Mở Góc Phụ huynh & GV</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Psychology Admin Console */}
          <div className="p-7 rounded-2xl bg-[#F6F3FB] border border-[#E3DCF8] flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#EDE8FF] text-[#462C9E] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-xs font-medium text-[#6B6585]">
                Phân hệ 8 · Quyền truy cập chuyên môn
              </div>
              <h3 className="font-display font-bold text-xl text-[#242038]">
                Trang quản trị Phòng Tâm lý học đường
              </h3>
              <p className="text-sm text-[#5A5475] leading-relaxed">
                Theo dõi xu hướng cảm xúc ở mức dữ liệu nhóm, tiếp nhận phiếu đăng ký tham vấn, quản lý học liệu & kịch bản Buddy Talk và xác minh cảnh báo an toàn học sinh.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E6DFFA]">
              <span className="inline-flex items-center gap-1.5 text-xs text-[#5A5475]">
                <Lock className="w-3.5 h-3.5" />
                <span>Ghi nhận lịch sử truy cập dữ liệu nhạy cảm</span>
              </span>
              {user?.role === 'admin' ? (
                <button
                  type="button"
                  onClick={() => onNavigate('admin-dashboard')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6B4CE6] text-white font-medium text-sm hover:bg-[#5A3BD6] transition-colors whitespace-nowrap"
                >
                  <span>Vào Dashboard Tâm lý</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#D8CEFA] text-[#3E2B85] font-medium text-sm hover:bg-[#EDE8FF] transition-colors whitespace-nowrap"
                >
                  <span>Đăng nhập vai trò Tâm lý</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
