import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Download,
  FileEdit,
  Inbox,
  Lock,
  MessageSquare,
  Plus,
  ShieldAlert,
  Trash2,
  CheckCircle2,
  ClipboardList,
} from 'lucide-react';
import type {
  AdminOverviewData,
  AuditLogEntry,
  BuddyTalkStep,
  GradeLevel,
  LibraryFormat,
  LibraryResource,
  SafetyAlert,
  SupportRequest,
  UserProfile,
} from '../types/index.ts';
import {
  CONTACT_METHOD_LABELS,
  EMOTION_MAP,
  GRADE_LEVEL_CONFIG,
  LIBRARY_FORMAT_LABELS,
  SUPPORT_TOPIC_LABELS,
} from '../data/vibeData.ts';
import { apiFetch, getStoredToken } from '../lib/api.ts';

interface PsychologyDashboardProps {
  user: UserProfile | null;
  onOpenAuth: () => void;
}

type AdminTab = 'overview' | 'analytics' | 'support' | 'library' | 'buddytalk' | 'safety';

export function PsychologyDashboard({ user, onOpenAuth }: PsychologyDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [overview, setOverview] = useState<AdminOverviewData | null>(null);
  const [supportList, setSupportList] = useState<SupportRequest[]>([]);
  const [libraryList, setLibraryList] = useState<LibraryResource[]>([]);
  const [buddySteps, setBuddySteps] = useState<BuddyTalkStep[]>([]);
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // Support Filters
  const [gradeFilter, setGradeFilter] = useState<'all' | GradeLevel>('all');
  const [topicFilter, setTopicFilter] = useState<'all' | string>('all');
  const [dateFilter, setDateFilter] = useState('');

  // Library Create/Edit State
  const [libTitle, setLibTitle] = useState('');
  const [libGrade, setLibGrade] = useState<GradeLevel>('middle');
  const [libFormat, setLibFormat] = useState<LibraryFormat>('bai_viet');
  const [libTopic, setLibTopic] = useState('');
  const [libSummary, setLibSummary] = useState('');
  const [libFeedback, setLibFeedback] = useState('');
  const [buddySavedMsg, setBuddySavedMsg] = useState('');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) return;
    apiFetch<AdminOverviewData>('/api/admin/overview').then(setOverview).catch(() => {});
    apiFetch<{ items: SupportRequest[] }>('/api/support')
      .then((res) => setSupportList(res.items))
      .catch(() => {});
    apiFetch<{ items: LibraryResource[] }>('/api/library')
      .then((res) => setLibraryList(res.items))
      .catch(() => {});
    apiFetch<{ steps: BuddyTalkStep[] }>('/api/buddytalk/flows')
      .then((res) => setBuddySteps(res.steps))
      .catch(() => {});
    apiFetch<{ items: SafetyAlert[] }>('/api/admin/safety-alerts')
      .then((res) => setSafetyAlerts(res.items))
      .catch(() => {});
    apiFetch<{ items: AuditLogEntry[] }>('/api/admin/audit-logs')
      .then((res) => setAuditLogs(res.items))
      .catch(() => {});
  }, [isAdmin, activeTab]);

  const filteredSupport = useMemo(() => {
    return supportList.filter((s) => {
      if (gradeFilter !== 'all' && s.gradeLevel !== gradeFilter) return false;
      if (topicFilter !== 'all' && s.topic !== topicFilter) return false;
      if (dateFilter && !s.createdAt.startsWith(dateFilter)) return false;
      return true;
    });
  }, [supportList, gradeFilter, topicFilter, dateFilter]);

  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white rounded-2xl border border-[#E8E3F0] p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EDE8FF] text-[#462C9E] flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-display font-bold text-xl text-[#242038]">
            Khu vực dành riêng cho Cán bộ Phòng Tâm lý học đường
          </h1>
          <p className="text-sm text-[#5A5475] leading-relaxed">
            Trang quản trị chứa thông tin yêu cầu hỗ trợ, cảnh báo an toàn và thống kê tổng hợp. Vui lòng đăng nhập với tài khoản Phòng Tâm lý học đường để truy cập.
          </p>
          <button
            type="button"
            onClick={onOpenAuth}
            className="px-5 py-2.5 rounded-xl bg-[#6B4CE6] text-white text-sm font-semibold hover:bg-[#5A3BD6]"
          >
            Đăng nhập tài khoản Phòng Tâm lý (Demo)
          </button>
        </div>
      </div>
    );
  }

  async function handleUpdateSupportStatus(id: string, status: SupportRequest['status']) {
    const res = await apiFetch<{ item: SupportRequest }>(`/api/support/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    setSupportList((prev) => prev.map((item) => (item.id === id ? res.item : item)));
  }

  async function handleVerifySafetyAlert(id: string, status: SafetyAlert['status']) {
    const res = await apiFetch<{ alert: SafetyAlert }>(`/api/admin/safety-alerts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    setSafetyAlerts((prev) => prev.map((a) => (a.id === id ? res.alert : a)));
  }

  async function handleAddLibrary(e: React.FormEvent) {
    e.preventDefault();
    if (!libTitle.trim() || !libSummary.trim()) return;
    const res = await apiFetch<{ item: LibraryResource }>('/api/library', {
      method: 'POST',
      body: JSON.stringify({
        title: libTitle,
        gradeLevel: libGrade,
        format: libFormat,
        topic: libTopic || 'Kỹ năng tâm lý học đường',
        summary: libSummary,
        content: [libSummary],
      }),
    });
    setLibraryList((prev) => [res.item, ...prev]);
    setLibTitle('');
    setLibTopic('');
    setLibSummary('');
    setLibFeedback('Đã thêm học liệu mới vào Thư viện.');
    window.setTimeout(() => setLibFeedback(''), 3000);
  }

  async function handleDeleteLibrary(id: string) {
    await apiFetch(`/api/library/${id}`, { method: 'DELETE' });
    setLibraryList((prev) => prev.filter((item) => item.id !== id));
  }

  async function handleSaveBuddyFlows() {
    await apiFetch('/api/buddytalk/flows', {
      method: 'PUT',
      body: JSON.stringify({ steps: buddySteps }),
    });
    setBuddySavedMsg('Đã cập nhật kịch bản Buddy Talk.');
    window.setTimeout(() => setBuddySavedMsg(''), 3000);
  }

  async function handleExportCsv() {
    const token = getStoredToken();
    const res = await fetch('/api/admin/export-csv', {
      headers: token ? { 'x-vibe-token': token } : {},
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vibespace-thong-ke-cam-xuc.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  const tabs: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] =
    [
      { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
      { id: 'analytics', label: 'Thống kê cảm xúc', icon: ClipboardList },
      { id: 'support', label: 'Yêu cầu hỗ trợ', icon: Inbox },
      { id: 'library', label: 'Quản lý học liệu', icon: FileEdit },
      { id: 'buddytalk', label: 'Quản lý Buddy Talk', icon: MessageSquare },
      { id: 'safety', label: 'Cảnh báo an toàn & Nhật ký', icon: ShieldAlert },
    ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EFEBF7] pb-5">
        <div>
          <div className="text-xs font-medium text-[#5A3EE0]">
            Phân hệ 8 · Psychology Dashboard · Trường FPT Hà Nam
          </div>
          <h1 className="font-display font-bold text-2xl text-[#242038] mt-0.5">
            Trang quản trị Phòng Tâm lý học đường
          </h1>
        </div>
        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E3DCF8] text-xs font-semibold text-[#3E2B85] hover:bg-[#F6F3FB] whitespace-nowrap self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Xuất báo cáo thống kê CSV</span>
        </button>
      </div>

      {/* Explicit Demo Data Notice */}
      {overview?.containsDemoData && (
        <div className="p-3.5 rounded-xl bg-[#FEF6DF] border border-[#F6DF9C] text-xs text-[#694808]">
          <strong>Thông báo dữ liệu minh họa (Demo):</strong> Số liệu khởi tạo trên bảng điều khiển là dữ liệu mẫu phục vụ trải nghiệm tính năng, không phải dữ liệu học sinh thật. Hệ thống không tự động chẩn đoán hay kết luận tình trạng tâm lý cá nhân.
        </div>
      )}

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors border ${
                active
                  ? 'bg-[#6B4CE6] text-white border-[#6B4CE6]'
                  : 'bg-white text-[#5A5475] border-[#E8E3F0] hover:bg-[#F6F3FB]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.id === 'safety' && (overview?.pendingSafetyAlerts ?? 0) > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded bg-[#E56B6F] text-white text-[10px] tabular-nums">
                  {overview?.pendingSafetyAlerts}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && overview && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-2xl border border-[#E8E3F0] p-5">
              <div className="text-xs text-[#6B6585]">Tài khoản học sinh</div>
              <div className="font-mono font-bold text-2xl text-[#242038] mt-1 tabular-nums">
                {overview.totalStudentAccounts}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[#E8E3F0] p-5">
              <div className="text-xs text-[#6B6585]">Lượt check-in cảm xúc</div>
              <div className="font-mono font-bold text-2xl text-[#242038] mt-1 tabular-nums">
                {overview.totalCheckIns}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[#E8E3F0] p-5">
              <div className="text-xs text-[#6B6585]">Tổng yêu cầu hỗ trợ</div>
              <div className="font-mono font-bold text-2xl text-[#242038] mt-1 tabular-nums">
                {overview.totalSupportRequests}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[#E8E3F0] p-5">
              <div className="text-xs text-[#6B6585]">Đăng ký tham vấn</div>
              <div className="font-mono font-bold text-2xl text-[#5A3EE0] mt-1 tabular-nums">
                {overview.totalCounselingRegistrations}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[#E8E3F0] p-5">
              <div className="text-xs text-[#6B6585]">Cảnh báo chờ xác minh</div>
              <div className="font-mono font-bold text-2xl text-[#8D282C] mt-1 tabular-nums">
                {overview.pendingSafetyAlerts}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E3F0] p-6 space-y-4">
            <h2 className="font-display font-bold text-base text-[#242038]">
              Thống kê các nhóm cảm xúc được ghi nhận (Dữ liệu nhóm tổng hợp)
            </h2>
            <div className="space-y-3">
              {overview.emotionDistribution.map((row) => {
                const meta = EMOTION_MAP[row.emotion];
                const pct =
                  overview.totalCheckIns > 0
                    ? Math.round((row.count / overview.totalCheckIns) * 100)
                    : 0;
                return (
                  <div key={row.emotion} className="flex items-center gap-3">
                    <div className="w-24 text-xs font-medium text-[#242038] shrink-0">
                      {meta.label}
                    </div>
                    <div className="flex-1 h-3 bg-[#F4F0FA] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.max(pct, row.count > 0 ? 6 : 0)}%`,
                          backgroundColor: meta.accentHex,
                        }}
                      />
                    </div>
                    <div className="w-20 text-right text-xs font-mono text-[#5A5475] tabular-nums shrink-0">
                      {row.count} ({pct}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EMOTION ANALYTICS */}
      {activeTab === 'analytics' && overview && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E8E3F0] p-6 space-y-5">
            <div>
              <h2 className="font-display font-bold text-base text-[#242038]">
                Xu hướng cảm xúc nhóm trong 7 ngày gần nhất
              </h2>
              <p className="text-xs text-[#6B6585] mt-0.5">
                Phản ánh tổng hợp tần suất check-in tích cực (Vui vẻ, Bình yên) so với nhóm cảm xúc cần lưu tâm
              </p>
            </div>
            <div className="h-48 flex items-end gap-3 px-3 pt-6 pb-2 bg-[#FCFBF9] rounded-xl border border-[#F0ECF7]">
              {overview.dailyTrend.map((day) => {
                const totalHeight = Math.min(100, day.total * 24);
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
                    <div className="w-full max-w-[36px] flex flex-col justify-end rounded-t-lg overflow-hidden bg-[#EDE8FF]" style={{ height: `${Math.max(totalHeight, 10)}%` }}>
                      <div
                        className="w-full bg-[#38B28B]"
                        style={{
                          height: day.total > 0 ? `${(day.positive / day.total) * 100}%` : '0%',
                        }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-[#5A5475] tabular-nums">
                      {day.date}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-6 text-xs text-[#5A5475]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#38B28B] inline-block" />
                Nhóm tích cực / bình yên
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#EDE8FF] inline-block" />
                Nhóm cần chú ý / mệt mỏi
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E8E3F0] p-6 space-y-4">
            <h2 className="font-display font-bold text-base text-[#242038]">
              Thống kê theo cấp học
            </h2>
            <div className="space-y-3">
              {overview.gradeBreakdown.map((g) => (
                <div
                  key={g.gradeLevel}
                  className="p-4 rounded-xl bg-[#FCFBF9] border border-[#EFEBF7] flex items-center justify-between"
                >
                  <div>
                    <div className="font-display font-semibold text-sm text-[#242038]">
                      {GRADE_LEVEL_CONFIG[g.gradeLevel].label}
                    </div>
                    <div className="text-xs text-[#6B6585]">
                      {GRADE_LEVEL_CONFIG[g.gradeLevel].ageRange}
                    </div>
                  </div>
                  <div className="text-right text-xs space-y-0.5 tabular-nums">
                    <div className="font-semibold text-[#242038]">{g.checkIns} lượt check-in</div>
                    <div className="text-[#5A3EE0]">{g.supportRequests} yêu cầu hỗ trợ</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SUPPORT REQUESTS MANAGEMENT */}
      {activeTab === 'support' && (
        <div className="bg-white rounded-2xl border border-[#E8E3F0] p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display font-bold text-base text-[#242038]">
              Danh sách yêu cầu hỗ trợ & đăng ký tham vấn ({filteredSupport.length})
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value as 'all' | GradeLevel)}
                className="px-3 py-1.5 text-xs rounded-lg border border-[#E3DCF8] bg-[#FCFBF9]"
              >
                <option value="all">Tất cả cấp học</option>
                <option value="primary">Tiểu học</option>
                <option value="middle">THCS</option>
                <option value="high">THPT</option>
              </select>
              <select
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-[#E3DCF8] bg-[#FCFBF9]"
              >
                <option value="all">Tất cả nội dung</option>
                {Object.entries(SUPPORT_TOPIC_LABELS).map(([k, lbl]) => (
                  <option key={k} value={k}>
                    {lbl}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-[#E3DCF8] bg-[#FCFBF9]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#EFEBF7] text-[#6B6585]">
                  <th className="py-3 px-3 font-semibold">Học sinh / Lớp</th>
                  <th className="py-3 px-3 font-semibold">Loại & Chủ đề</th>
                  <th className="py-3 px-3 font-semibold">Thông tin liên hệ</th>
                  <th className="py-3 px-3 font-semibold">Nội dung chia sẻ</th>
                  <th className="py-3 px-3 font-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F0FA]">
                {filteredSupport.map((req) => (
                  <tr key={req.id} className="hover:bg-[#FAF8FF]">
                    <td className="py-3.5 px-3 align-top">
                      <div className="font-semibold text-[#242038]">{req.studentName}</div>
                      <div className="text-[#6B6585] mt-0.5">
                        {GRADE_LEVEL_CONFIG[req.gradeLevel].label} · {req.classLabel}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 align-top">
                      <div className="font-medium text-[#5A3EE0]">
                        {req.requestType === 'tham_van_ca_nhan'
                          ? 'Đăng ký tham vấn'
                          : 'Yêu cầu hỗ trợ'}
                      </div>
                      <div className="text-[#5A5475] mt-0.5">{SUPPORT_TOPIC_LABELS[req.topic]}</div>
                    </td>
                    <td className="py-3.5 px-3 align-top max-w-[220px]">
                      <div className="font-medium text-[#242038]">
                        {CONTACT_METHOD_LABELS[req.contactMethod]}
                      </div>
                      <div className="text-[#6B6585] mt-0.5">{req.contactDetail}</div>
                    </td>
                    <td className="py-3.5 px-3 align-top max-w-[260px] text-[#3D3759]">
                      {req.description}
                    </td>
                    <td className="py-3.5 px-3 align-top">
                      <select
                        value={req.status}
                        onChange={(e) =>
                          handleUpdateSupportStatus(
                            req.id,
                            e.target.value as SupportRequest['status']
                          )
                        }
                        className="px-2.5 py-1.5 rounded-lg border border-[#E3DCF8] bg-white text-xs font-medium text-[#242038]"
                      >
                        <option value="moi_tiep_nhan">Mới tiếp nhận</option>
                        <option value="dang_lien_he">Đang liên hệ</option>
                        <option value="da_ket_noi">Đã kết nối</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: LIBRARY MANAGEMENT */}
      {activeTab === 'library' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={handleAddLibrary}
            className="lg:col-span-5 bg-white rounded-2xl border border-[#E8E3F0] p-6 space-y-4"
          >
            <h2 className="font-display font-bold text-base text-[#242038] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#6B4CE6]" />
              <span>Thêm học liệu mới</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-[#242038] mb-1">Tiêu đề</label>
              <input
                type="text"
                required
                value={libTitle}
                onChange={(e) => setLibTitle(e.target.value)}
                placeholder="Tên bài viết / video / tình huống..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E3DCF8] bg-[#FCFBF9]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#242038] mb-1">Cấp học</label>
                <select
                  value={libGrade}
                  onChange={(e) => setLibGrade(e.target.value as GradeLevel)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E3DCF8] bg-[#FCFBF9]"
                >
                  <option value="primary">Tiểu học</option>
                  <option value="middle">THCS</option>
                  <option value="high">THPT</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#242038] mb-1">Hình thức</label>
                <select
                  value={libFormat}
                  onChange={(e) => setLibFormat(e.target.value as LibraryFormat)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E3DCF8] bg-[#FCFBF9]"
                >
                  {Object.entries(LIBRARY_FORMAT_LABELS).map(([k, lbl]) => (
                    <option key={k} value={k}>
                      {lbl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242038] mb-1">Chủ đề</label>
              <input
                type="text"
                value={libTopic}
                onChange={(e) => setLibTopic(e.target.value)}
                placeholder="Ví dụ: Quản lý căng thẳng"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E3DCF8] bg-[#FCFBF9]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242038] mb-1">Nội dung tóm tắt</label>
              <textarea
                rows={3}
                required
                value={libSummary}
                onChange={(e) => setLibSummary(e.target.value)}
                placeholder="Tóm tắt kiến thức cốt lõi cho học sinh..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E3DCF8] bg-[#FCFBF9]"
              />
            </div>

            {libFeedback && (
              <div className="text-xs font-medium text-[#155E47]">{libFeedback}</div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#6B4CE6] text-white text-sm font-semibold hover:bg-[#5A3BD6]"
            >
              Xuất bản học liệu
            </button>
          </form>

          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E8E3F0] p-6 space-y-4">
            <h2 className="font-display font-bold text-base text-[#242038]">
              Danh mục học liệu hiện có ({libraryList.length})
            </h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {libraryList.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-[#EFEBF7] bg-[#FCFBF9] flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="text-xs text-[#6B6585]">
                      {GRADE_LEVEL_CONFIG[item.gradeLevel].label} ·{' '}
                      {LIBRARY_FORMAT_LABELS[item.format]} · {item.topic}
                    </div>
                    <div className="font-display font-semibold text-sm text-[#242038]">
                      {item.title}
                    </div>
                    <p className="text-xs text-[#5A5475] line-clamp-2">{item.summary}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteLibrary(item.id)}
                    className="p-2 rounded-lg text-[#8E83A8] hover:text-[#8D282C] hover:bg-[#FEECEB]"
                    aria-label="Xóa học liệu"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: BUDDY TALK SCRIPT MANAGEMENT */}
      {activeTab === 'buddytalk' && (
        <div className="bg-white rounded-2xl border border-[#E8E3F0] p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display font-bold text-base text-[#242038]">
                Quản lý kịch bản & bộ câu hỏi Buddy Talk
              </h2>
              <p className="text-xs text-[#6B6585] mt-0.5">
                Chỉnh sửa câu hỏi gợi mở và lời phản hồi thấu cảm đã được chuyên viên kiểm duyệt
              </p>
            </div>
            <div className="flex items-center gap-3">
              {buddySavedMsg && (
                <span className="text-xs font-medium text-[#155E47] flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  {buddySavedMsg}
                </span>
              )}
              <button
                type="button"
                onClick={handleSaveBuddyFlows}
                className="px-4 py-2 rounded-xl bg-[#6B4CE6] text-white text-xs font-semibold hover:bg-[#5A3BD6]"
              >
                Lưu thay đổi kịch bản
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {buddySteps.map((step, sIdx) => (
              <div
                key={step.id}
                className="p-4 rounded-xl border border-[#EFEBF7] bg-[#FCFBF9] space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#5A3EE0]">
                    Bước {step.stepOrder}
                  </span>
                </div>
                <input
                  type="text"
                  value={step.question}
                  onChange={(e) =>
                    setBuddySteps((prev) =>
                      prev.map((s, idx) => (idx === sIdx ? { ...s, question: e.target.value } : s))
                    )
                  }
                  className="w-full px-3.5 py-2 text-sm font-medium rounded-lg border border-[#E3DCF8] bg-white"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {step.options.map((opt, oIdx) => (
                    <div key={opt.id} className="p-3 rounded-lg bg-white border border-[#EFEBF7] space-y-1.5">
                      <input
                        type="text"
                        value={opt.label}
                        onChange={(e) =>
                          setBuddySteps((prev) =>
                            prev.map((s, idx) =>
                              idx === sIdx
                                ? {
                                    ...s,
                                    options: s.options.map((o, j) =>
                                      j === oIdx ? { ...o, label: e.target.value } : o
                                    ),
                                  }
                                : s
                            )
                          )
                        }
                        className="w-full text-xs font-semibold text-[#242038] border-b border-[#F4F0FA] pb-1 focus:outline-none"
                      />
                      <textarea
                        rows={2}
                        value={opt.empathyReply}
                        onChange={(e) =>
                          setBuddySteps((prev) =>
                            prev.map((s, idx) =>
                              idx === sIdx
                                ? {
                                    ...s,
                                    options: s.options.map((o, j) =>
                                      j === oIdx ? { ...o, empathyReply: e.target.value } : o
                                    ),
                                  }
                                : s
                            )
                          )
                        }
                        className="w-full text-xs text-[#5A5475] resize-none focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SAFETY ALERTS & SENSITIVE DATA AUDIT LOG */}
      {activeTab === 'safety' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E8E3F0] p-6 space-y-4">
            <div className="space-y-1">
              <h2 className="font-display font-bold text-base text-[#8D282C] flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                <span>Cảnh báo an toàn học sinh cần cán bộ xác minh trực tiếp</span>
              </h2>
              <p className="text-xs text-[#5A5475]">
                Hệ thống ghi nhận các tín hiệu học sinh chủ động chia sẻ nguy cơ mất an toàn để ưu tiên hỗ trợ. Phần mềm không tự động chẩn đoán hoặc kết luận mức độ nguy cơ.
              </p>
            </div>

            <div className="space-y-3">
              {safetyAlerts.map((al) => (
                <div
                  key={al.id}
                  className="p-4 rounded-xl border border-[#F5C6C4] bg-[#FEECEB]/45 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-[#8D282C]">
                      {al.studentAlias} · {GRADE_LEVEL_CONFIG[al.gradeLevel].label} ·{' '}
                      {new Date(al.createdAt).toLocaleString('vi-VN')}
                    </div>
                    <div className="font-medium text-sm text-[#242038]">{al.triggerSummary}</div>
                    <p className="text-xs text-[#4A4463]">“{al.studentMessageExcerpt}”</p>
                    {al.verifiedBy && (
                      <div className="text-[11px] text-[#155E47]">
                        Xử lý bởi: {al.verifiedBy}
                      </div>
                    )}
                  </div>
                  <select
                    value={al.status}
                    onChange={(e) =>
                      handleVerifySafetyAlert(al.id, e.target.value as SafetyAlert['status'])
                    }
                    className="px-3 py-2 rounded-xl border border-[#E8C5C3] bg-white text-xs font-semibold text-[#242038] shrink-0"
                  >
                    <option value="can_xac_minh">Cần xác minh ngay</option>
                    <option value="dang_ho_tro">Đang tiếp cận hỗ trợ</option>
                    <option value="da_xac_minh">Đã xác minh an toàn</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Log */}
          <div className="bg-white rounded-2xl border border-[#E8E3F0] p-6 space-y-4">
            <div>
              <h2 className="font-display font-bold text-base text-[#242038]">
                Nhật ký ghi nhận truy cập dữ liệu nhạy cảm
              </h2>
              <p className="text-xs text-[#6B6585] mt-0.5">
                Mọi thao tác xem hoặc xuất dữ liệu hỗ trợ và cảnh báo an toàn đều được ghi nhận nhằm bảo đảm tuân thủ bảo vệ dữ liệu cá nhân.
              </p>
            </div>
            <div className="max-h-[260px] overflow-y-auto divide-y divide-[#F4F0FA] text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-[#242038]">{log.actorName}</span>{' '}
                    <span className="text-[#5A5475]">— {log.action}</span>
                  </div>
                  <span className="font-mono text-[#6B6585] tabular-nums">
                    {new Date(log.timestamp).toLocaleString('vi-VN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
