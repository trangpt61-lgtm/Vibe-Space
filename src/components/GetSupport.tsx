import React, { useEffect, useState } from 'react';
import {
  HeartHandshake,
  ShieldCheck,
  AlertCircle,
  MapPin,
  Clock,
  CheckCircle2,
  UserCheck,
} from 'lucide-react';
import type {
  ContactMethod,
  GradeLevel,
  SupportRequest,
  SupportTopic,
  UserProfile,
} from '../types/index.ts';
import {
  CONTACT_METHOD_LABELS,
  GRADE_LEVEL_CONFIG,
  SUPPORT_TOPIC_LABELS,
} from '../data/vibeData.ts';
import { apiFetch } from '../lib/api.ts';

interface GetSupportProps {
  gradeLevel: GradeLevel;
  user: UserProfile | null;
  onOpenAuth: () => void;
}

const STATUS_LABELS: Record<SupportRequest['status'], string> = {
  moi_tiep_nhan: 'Mới tiếp nhận',
  dang_lien_he: 'Phòng Tâm lý đang liên hệ',
  da_ket_noi: 'Đã kết nối hỗ trợ',
};

export function GetSupport({ gradeLevel, user, onOpenAuth }: GetSupportProps) {
  const [requestType, setRequestType] = useState<'ho_tro' | 'tham_van_ca_nhan'>('ho_tro');
  const [topic, setTopic] = useState<SupportTopic>('cam_xuc');
  const [contactMethod, setContactMethod] = useState<ContactMethod>('phong_tam_ly');
  const [contactDetail, setContactDetail] = useState('');
  const [classLabel, setClassLabel] = useState(user?.classLabel || '');
  const [description, setDescription] = useState('');
  const [myRequests, setMyRequests] = useState<SupportRequest[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submittedMsg, setSubmittedMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const isStudent = user?.role === 'student';

  useEffect(() => {
    if (user?.classLabel) {
      setClassLabel(user.classLabel);
    }
    if (isStudent) {
      apiFetch<{ items: SupportRequest[] }>('/api/support')
        .then((res) => setMyRequests(res.items))
        .catch(() => {});
    } else {
      setMyRequests([]);
    }
  }, [isStudent, user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    setSubmittedMsg('');

    if (!isStudent) {
      onOpenAuth();
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch<{ item: SupportRequest }>('/api/support', {
        method: 'POST',
        body: JSON.stringify({
          gradeLevel,
          classLabel: classLabel || 'FPT Hà Nam',
          requestType,
          topic,
          contactMethod,
          contactDetail,
          description,
        }),
      });
      setMyRequests((prev) => [res.item, ...prev]);
      setDescription('');
      setContactDetail('');
      setSubmittedMsg(
        'Phiếu kết nối của bạn đã được gửi bảo mật tới Phòng Tâm lý học đường FPT Hà Nam.'
      );
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể gửi yêu cầu.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-[#EFEBF7] pb-6 max-w-3xl">
        <div className="text-xs font-medium text-[#8D282C]">
          Phân hệ 5 · Get Support · Kết nối hỗ trợ
        </div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#242038]">
          Kết nối với Phòng Tâm lý học đường FPT Hà Nam
        </h1>
        <p className="text-sm text-[#5A5475] leading-relaxed">
          Khi bạn cần một người lắng nghe chuyên môn, đồng hành giải quyết khó khăn học tập, bạn bè hay gia đình, bạn luôn có thể chủ động gửi yêu cầu tại đây.
        </p>
      </div>

      {/* Explicit Non-Emergency Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FEF6DF] border border-[#F6DF9C] flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#805708] shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-[#5C3E04] leading-relaxed">
          <strong>Lưu ý quan trọng về phản hồi khẩn cấp:</strong> Việc gửi yêu cầu trên website không đồng nghĩa với việc được hỗ trợ khẩn cấp ngay lập tức. Nếu bạn hoặc bạn bè đang gặp tình huống nguy cấp hay có nguy cơ mất an toàn, vui lòng tìm gặp trực tiếp thầy cô gần nhất, bố mẹ hoặc gọi Tổng đài Quốc gia Bảo vệ Trẻ em <strong>111</strong> (miễn phí 24/7).
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Office Info & Confidentiality Principles */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E8E3F0] p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#EDE8FF] text-[#462C9E] flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-base text-[#242038]">
                  Phòng Tâm lý học đường FPT Hà Nam
                </h2>
                <p className="text-xs text-[#6B6585]">Không gian an toàn, tôn trọng và lắng nghe</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-[#4A4463]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#6B4CE6] shrink-0 mt-0.5" />
                <span>Khu vực Phòng Tham vấn Tâm lý – Tòa nhà THPT & THCS, Trường FPT Hà Nam</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#6B4CE6] shrink-0 mt-0.5" />
                <span>Thứ Hai – Thứ Sáu: 08:00 – 17:00 (Giờ làm việc chính thức của nhà trường)</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F0ECF7] space-y-2.5">
              <h3 className="font-display font-semibold text-sm text-[#242038] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#38B28B]" />
                <span>Vai trò cán bộ tâm lý & nguyên tắc bảo mật</span>
              </h3>
              <ul className="space-y-2 text-xs text-[#5A5475] leading-relaxed">
                <li>• Lắng nghe không phán xét, đồng hành cùng học sinh tháo gỡ vướng mắc cảm xúc và kỹ năng.</li>
                <li>• Mọi nội dung chia sẻ cá nhân được bảo mật theo quy định nghề nghiệp tâm lý học đường.</li>
                <li>• Ngoại lệ bảo mật chỉ áp dụng khi cần bảo vệ an toàn tính mạng của học sinh hoặc phòng ngừa nguy cơ bạo lực, xâm hại theo quy định bảo vệ trẻ em.</li>
              </ul>
            </div>
          </div>

          {/* Student's Own Submitted Requests */}
          {isStudent && (
            <div className="bg-white rounded-2xl border border-[#E8E3F0] p-6 space-y-4">
              <h3 className="font-display font-bold text-base text-[#242038]">
                Yêu cầu bạn đã gửi ({myRequests.length})
              </h3>
              {myRequests.length === 0 ? (
                <p className="text-xs text-[#6B6585]">Bạn chưa gửi yêu cầu hỗ trợ nào.</p>
              ) : (
                <div className="space-y-3">
                  {myRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-3.5 rounded-xl bg-[#FCFBF9] border border-[#EFEBF7] space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-[#242038]">
                          {req.requestType === 'tham_van_ca_nhan'
                            ? 'Đăng ký tham vấn cá nhân'
                            : 'Yêu cầu hỗ trợ'}
                        </span>
                        <span className="font-medium text-[#5A3EE0]">
                          {STATUS_LABELS[req.status]}
                        </span>
                      </div>
                      <p className="text-xs text-[#5A5475]">
                        Chủ đề: {SUPPORT_TOPIC_LABELS[req.topic]} ·{' '}
                        {CONTACT_METHOD_LABELS[req.contactMethod]}
                      </p>
                      <p className="text-xs text-[#4A4463] line-clamp-2">{req.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Support & Counseling Registration Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 bg-white rounded-2xl border border-[#E8E3F0] p-6 sm:p-8 space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display font-bold text-lg text-[#242038]">
                Biểu mẫu gửi yêu cầu hỗ trợ / đăng ký tham vấn cá nhân
              </h2>
              <p className="text-xs text-[#6B6585] mt-0.5">
                Cấp học hiện tại: {GRADE_LEVEL_CONFIG[gradeLevel].label}
              </p>
            </div>

            {!isStudent && (
              <button
                type="button"
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EDE8FF] text-[#3E2B85] text-xs font-semibold"
              >
                <UserCheck className="w-4 h-4" />
                <span>Đăng nhập tài khoản Học sinh</span>
              </button>
            )}
          </div>

          {/* Request Type Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRequestType('ho_tro')}
              className={`p-4 rounded-xl border text-left transition-colors ${
                requestType === 'ho_tro'
                  ? 'bg-[#EDE8FF] border-[#7C5CFC]'
                  : 'bg-[#FCFBF9] border-[#EFEBF7]'
              }`}
            >
              <div className="font-display font-semibold text-sm text-[#242038]">
                Gửi yêu cầu hỗ trợ / hỏi đáp
              </div>
              <p className="text-xs text-[#5A5475] mt-1">
                Nhắn chia sẻ ngắn để cán bộ tâm lý phản hồi hoặc tư vấn bước đầu.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setRequestType('tham_van_ca_nhan')}
              className={`p-4 rounded-xl border text-left transition-colors ${
                requestType === 'tham_van_ca_nhan'
                  ? 'bg-[#EDE8FF] border-[#7C5CFC]'
                  : 'bg-[#FCFBF9] border-[#EFEBF7]'
              }`}
            >
              <div className="font-display font-semibold text-sm text-[#242038]">
                Đăng ký tham vấn tâm lý cá nhân
              </div>
              <p className="text-xs text-[#5A5475] mt-1">
                Đăng ký để chuyên viên liên hệ sắp xếp buổi trò chuyện riêng 1-1.
              </p>
            </button>
          </div>

          {/* Topic Selection */}
          <div className="space-y-2">
            <label className="block font-display font-semibold text-sm text-[#242038]">
              Nội dung bạn cần hỗ trợ
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(SUPPORT_TOPIC_LABELS) as [SupportTopic, string][]).map(
                ([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTopic(key)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors ${
                      topic === key
                        ? 'bg-[#6B4CE6] text-white border-[#6B4CE6]'
                        : 'bg-[#FCFBF9] text-[#5A5475] border-[#E8E3F0] hover:bg-[#F6F3FB]'
                    }`}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Contact Method & Class */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="support-class"
                className="block text-xs font-semibold text-[#242038] mb-1.5"
              >
                Lớp của bạn
              </label>
              <input
                id="support-class"
                type="text"
                required
                value={classLabel}
                onChange={(e) => setClassLabel(e.target.value)}
                placeholder="Ví dụ: Lớp 8A1"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E3DCF8] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]"
              />
            </div>

            <div>
              <label
                htmlFor="support-method"
                className="block text-xs font-semibold text-[#242038] mb-1.5"
              >
                Hình thức liên hệ mong muốn
              </label>
              <select
                id="support-method"
                value={contactMethod}
                onChange={(e) => setContactMethod(e.target.value as ContactMethod)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E3DCF8] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]"
              >
                {(Object.entries(CONTACT_METHOD_LABELS) as [ContactMethod, string][]).map(
                  ([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="support-contact-detail"
              className="block text-xs font-semibold text-[#242038] mb-1.5"
            >
              Thông tin để Phòng Tâm lý liên hệ lại (khung giờ rảnh, tài khoản Teams hoặc SĐT)
            </label>
            <input
              id="support-contact-detail"
              type="text"
              required
              value={contactDetail}
              onChange={(e) => setContactDetail(e.target.value)}
              placeholder="Ví dụ: Giờ ra chơi sáng thứ 5 hoặc email/Teams học đường..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E3DCF8] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]"
            />
          </div>

          <div>
            <label
              htmlFor="support-description"
              className="block text-xs font-semibold text-[#242038] mb-1.5"
            >
              Điều bạn muốn chia sẻ hoặc mong muốn hỗ trợ
            </label>
            <textarea
              id="support-description"
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Bạn có thể viết ngắn gọn điều đang làm bạn băn khoăn để chuyên viên hiểu trước khi liên hệ..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E3DCF8] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#FEECEB] text-[#8D282C] text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {submittedMsg && (
            <div className="p-3.5 rounded-xl bg-[#E5F7F0] text-[#155E47] text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{submittedMsg}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-xs text-[#6B6585]">
              Thông tin chỉ được xem bởi Cán bộ Phòng Tâm lý học đường.
            </span>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-[#6B4CE6] text-white text-sm font-semibold hover:bg-[#5A3BD6] disabled:opacity-60"
            >
              {isStudent
                ? submitting
                  ? 'Đang gửi...'
                  : 'Gửi yêu cầu kết nối'
                : 'Đăng nhập Học sinh để gửi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
