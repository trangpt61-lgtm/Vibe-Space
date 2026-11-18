import React, { useEffect, useState } from 'react';
import { Users, GraduationCap, HeartHandshake, ShieldAlert, CheckCircle2 } from 'lucide-react';
import type { ActiveModule, UserProfile } from '../types/index.ts';
import { PARENT_GUIDES, TEACHER_GUIDES } from '../data/vibeData.ts';

interface ParentTeacherCornerProps {
  user: UserProfile | null;
  onNavigate: (mod: ActiveModule) => void;
}

export function ParentTeacherCorner({ user, onNavigate }: ParentTeacherCornerProps) {
  const [activeTab, setActiveTab] = useState<'parent' | 'teacher'>(
    user?.role === 'teacher' ? 'teacher' : 'parent'
  );
  const [selectedGuideId, setSelectedGuideId] = useState<string>(PARENT_GUIDES[0].id);

  useEffect(() => {
    if (user?.role === 'teacher') {
      setActiveTab('teacher');
    } else if (user?.role === 'parent') {
      setActiveTab('parent');
    }
  }, [user?.role]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EFEBF7] pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs font-medium text-[#155E47]">
            Phân hệ 7 · Parent & Teacher Corner · Dành cho người lớn đồng hành
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#242038]">
            Góc Phụ huynh và Giáo viên FPT Hà Nam
          </h1>
          <p className="text-sm text-[#5A5475] leading-relaxed">
            Cung cấp kiến thức tâm lý lứa tuổi, kỹ năng lắng nghe đồng hành và quy trình phối hợp an toàn cùng Phòng Tâm lý học đường.
          </p>
        </div>

        {/* Segmented Role Switch */}
        <div className="flex items-center gap-1 p-1 bg-white border border-[#E8E3F0] rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('parent')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === 'parent'
                ? 'bg-[#6B4CE6] text-white'
                : 'text-[#5A5475] hover:text-[#242038]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Dành cho Phụ huynh</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('teacher')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === 'teacher'
                ? 'bg-[#155E47] text-white'
                : 'text-[#5A5475] hover:text-[#242038]'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Dành cho Giáo viên</span>
          </button>
        </div>
      </div>

      {/* Privacy Principle Note */}
      <div className="p-4 rounded-2xl bg-[#F6F3FB] border border-[#E3DCF8] text-xs text-[#4A4463] leading-relaxed">
        <strong>Nguyên tắc tôn trọng quyền riêng tư học sinh:</strong> VIBE SPACE không công khai Nhật ký cảm xúc cá nhân hoặc nội dung trò chuyện riêng tư của học sinh cho phụ huynh và giáo viên, trừ trường hợp cần xử lý khẩn cấp nhằm bảo đảm an toàn cho trẻ theo quy trình bảo vệ học sinh của nhà trường.
      </div>

      {activeTab === 'parent' ? (
        <div className="space-y-8">
          {/* Age Group Guides */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 space-y-2.5">
              <h2 className="font-display font-bold text-base text-[#242038] mb-2">
                Đặc điểm tâm lý theo độ tuổi
              </h2>
              {PARENT_GUIDES.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGuideId(g.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${
                    selectedGuideId === g.id
                      ? 'bg-[#EDE8FF] border-[#7C5CFC]'
                      : 'bg-white border-[#E8E3F0] hover:bg-[#FAF8FF]'
                  }`}
                >
                  <div className="text-xs font-semibold text-[#5A3EE0]">{g.ageGroup}</div>
                  <div className="font-display font-semibold text-sm text-[#242038] mt-1">
                    {g.title}
                  </div>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E8E3F0] p-6 sm:p-8 space-y-5">
              {(() => {
                const current =
                  PARENT_GUIDES.find((g) => g.id === selectedGuideId) || PARENT_GUIDES[0];
                return (
                  <>
                    <div>
                      <div className="text-xs font-medium text-[#5A3EE0]">{current.ageGroup}</div>
                      <h3 className="font-display font-bold text-xl text-[#242038] mt-1">
                        {current.title}
                      </h3>
                      <p className="text-sm text-[#5A5475] mt-2 leading-relaxed">
                        {current.summary}
                      </p>
                    </div>
                    <div className="space-y-3 pt-2 border-t border-[#F0ECF7]">
                      <h4 className="font-display font-semibold text-sm text-[#242038]">
                        Gợi ý đồng hành cùng con tại nhà:
                      </h4>
                      {current.keyPoints.map((pt, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-sm text-[#3D3759]">
                          <CheckCircle2 className="w-4 h-4 text-[#38B28B] shrink-0 mt-1" />
                          <p className="leading-relaxed">{pt}</p>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Accompanying Emotions & School Connection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-[#E8E3F0] p-6 space-y-3">
              <h3 className="font-display font-bold text-lg text-[#242038]">
                Khi con buồn bã, lo lắng hoặc tức giận
              </h3>
              <ul className="space-y-2.5 text-sm text-[#5A5475] leading-relaxed">
                <li>
                  • <strong>Giữ bình tĩnh làm điểm tựa:</strong> Trẻ học cách điều hòa cảm xúc thông qua thái độ điềm tĩnh của bố mẹ trước tiên.
                </li>
                <li>
                  • <strong>Xác nhận cảm xúc trước khi sửa hành vi:</strong> "Bố/mẹ hiểu con đang rất bực khi bị điểm thấp" thay vì trách mắng ngay.
                </li>
                <li>
                  • <strong>Nhận diện dấu hiệu cần hỗ trợ:</strong> Mất ngủ kéo dài, chán ăn, thu mình khỏi gia đình bạn bè, hoặc nhắc đến sự vô giá trị của bản thân.
                </li>
              </ul>
            </div>

            <div className="bg-[#E5F7F0]/60 rounded-2xl border border-[#CBEFE2] p-6 flex flex-col justify-between gap-4">
              <div className="space-y-2.5">
                <h3 className="font-display font-bold text-lg text-[#155E47] flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5" />
                  <span>Kết nối với Phòng Tâm lý học đường</span>
                </h3>
                <p className="text-sm text-[#1D5441] leading-relaxed">
                  Phụ huynh có thể trao đổi thông qua Giáo viên chủ nhiệm hoặc liên hệ trực tiếp Phòng Tâm lý học đường FPT Hà Nam trong giờ hành chính (Thứ 2 – Thứ 6) để cùng phối hợp hỗ trợ con kịp thời.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('get-support')}
                className="self-start px-4 py-2.5 rounded-xl bg-[#155E47] text-white text-xs font-semibold hover:bg-[#0F4937]"
              >
                Xem thông tin Phòng Tâm lý học đường
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TEACHER_GUIDES.map((guide) => (
              <div
                key={guide.id}
                className="bg-white rounded-2xl border border-[#E8E3F0] p-6 space-y-4"
              >
                <div>
                  <div className="text-xs font-semibold text-[#155E47]">{guide.category}</div>
                  <h2 className="font-display font-bold text-lg text-[#242038] mt-1">
                    {guide.title}
                  </h2>
                </div>
                <ul className="space-y-2.5 text-sm text-[#4A4463]">
                  {guide.steps.map((st, idx) => (
                    <li key={idx} className="leading-relaxed">
                      • {st}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-[#FEECEB]/70 border border-[#F5C6C4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-[#8D282C] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-[#8D282C]">
                  Hướng dẫn xử lý tình huống học sinh có nguy cơ mất an toàn
                </h3>
                <p className="text-xs sm:text-sm text-[#612224] leading-relaxed">
                  Khi phát hiện học sinh có dấu hiệu tự làm hại bản thân, ý nghĩ không muốn tồn tại, hoặc bị bạo lực/xâm hại: giữ học sinh ở nơi an toàn có người lớn đi cùng, không phán xét, và báo ngay trực tiếp cho Cán bộ Phòng Tâm lý cùng Ban Giám hiệu.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
