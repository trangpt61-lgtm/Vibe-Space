import React, { useState } from 'react';
import { Menu, X, User, ShieldCheck, LogOut } from 'lucide-react';
import type { ActiveModule, GradeLevel, UserProfile } from '../types/index.ts';
import { VibeSpaceLogo } from './VibeIcons.tsx';

interface NavbarProps {
  activeModule: ActiveModule;
  onNavigate: (mod: ActiveModule) => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  gradeLevel: GradeLevel;
  onChangeGradeLevel: (g: GradeLevel) => void;
}

export function Navbar({
  activeModule,
  onNavigate,
  user,
  onOpenAuth,
  onLogout,
  gradeLevel,
  onChangeGradeLevel,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const primaryLinks: { id: ActiveModule; label: string }[] = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'my-feelings', label: 'Cảm xúc' },
    { id: 'calm-corner', label: 'Góc bình yên' },
    { id: 'buddy-talk', label: 'Buddy Talk' },
    {
      id: user?.role === 'admin' ? 'admin-dashboard' : 'library',
      label: user?.role === 'admin' ? 'Quản trị Tâm lý' : 'Thư viện',
    },
  ];

  const allModules: { id: ActiveModule; label: string; adminOnly?: boolean }[] = [
    { id: 'my-feelings', label: 'My Feelings' },
    { id: 'calm-corner', label: 'Calm Corner' },
    { id: 'buddy-talk', label: 'Buddy Talk' },
    { id: 'emotion-diary', label: 'Nhật ký cảm xúc' },
    { id: 'get-support', label: 'Kết nối hỗ trợ' },
    { id: 'library', label: 'Thư viện tâm lý' },
    { id: 'parent-teacher', label: 'Phụ huynh & GV' },
    { id: 'admin-dashboard', label: 'Phòng Tâm lý', adminOnly: true },
  ];

  return (
    <div className="sticky top-0 z-40 bg-[#FCFBF9]/95 backdrop-blur-sm border-b border-[#E8E3F0]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Title (single line, no extra tags) */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFC] rounded-lg px-1 py-1"
        >
          <VibeSpaceLogo className="w-8 h-8 shrink-0" />
          <span className="font-display font-bold text-lg tracking-tight text-[#242038]">
            VIBE SPACE
          </span>
        </button>

        {/* Zone 2: 5 concise single-line text links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5A5475]">
          {primaryLinks.map((link) => {
            const isActive = activeModule === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => onNavigate(link.id)}
                className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFC] ${
                  isActive
                    ? 'text-[#5A3EE0] border-[#7C5CFC] font-semibold'
                    : 'border-transparent hover:text-[#242038] hover:border-[#D3C9F8]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <button
              type="button"
              onClick={onOpenAuth}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-[#EDE8FF] text-[#3E2B85] hover:bg-[#E1D8FE] transition-colors whitespace-nowrap shrink-0"
              title="Đổi vai trò hoặc xem tài khoản"
            >
              {user.role === 'admin' ? (
                <ShieldCheck className="w-4 h-4 shrink-0" />
              ) : (
                <User className="w-4 h-4 shrink-0" />
              )}
              <span className="max-w-[160px] truncate">{user.displayName}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-[#6B4CE6] text-white hover:bg-[#5A3BD6] transition-colors whitespace-nowrap shrink-0"
            >
              <User className="w-4 h-4 shrink-0" />
              <span>Đăng nhập</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl text-[#3E2B85] hover:bg-[#F3EEFF]"
            aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Workspace Quick Strip below header on desktop when navigating inside modules */}
      {activeModule !== 'home' && (
        <div className="hidden md:block border-t border-[#F0ECF7] bg-[#F8F6FC]">
          <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-1 overflow-x-auto">
              {allModules
                .filter((m) => !m.adminOnly || user?.role === 'admin')
                .map((mod) => {
                  const active = activeModule === mod.id;
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => onNavigate(mod.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                        active
                          ? 'bg-white text-[#5A3EE0] shadow-xs border border-[#E3DCF8]'
                          : 'text-[#5A5475] hover:text-[#242038] hover:bg-white/60'
                      }`}
                    >
                      {mod.label}
                    </button>
                  );
                })}
            </div>

            <div className="flex items-center gap-1.5 shrink-0 bg-white/80 p-1 rounded-lg border border-[#E8E3F0]">
              <span className="text-[11px] text-[#6B6585] px-1.5 whitespace-nowrap">Cấp học:</span>
              {(['primary', 'middle', 'high'] as GradeLevel[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => onChangeGradeLevel(g)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    gradeLevel === g
                      ? 'bg-[#6B4CE6] text-white'
                      : 'text-[#5A5475] hover:bg-[#F3EEFF]'
                  }`}
                >
                  {g === 'primary' ? 'Tiểu học' : g === 'middle' ? 'THCS' : 'THPT'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E8E3F0] bg-white px-4 py-4 space-y-4">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#F0ECF7]">
            <span className="text-xs font-medium text-[#5A5475]">Cấp học hiển thị:</span>
            <div className="flex items-center gap-1">
              {(['primary', 'middle', 'high'] as GradeLevel[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => onChangeGradeLevel(g)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md ${
                    gradeLevel === g
                      ? 'bg-[#6B4CE6] text-white'
                      : 'bg-[#F6F3FB] text-[#5A5475]'
                  }`}
                >
                  {g === 'primary' ? 'Tiểu học' : g === 'middle' ? 'THCS' : 'THPT'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onNavigate('home');
                setMobileOpen(false);
              }}
              className={`px-3 py-2.5 text-left text-sm rounded-xl font-medium ${
                activeModule === 'home' ? 'bg-[#EDE8FF] text-[#3E2B85]' : 'bg-[#F8F6FC] text-[#3D3759]'
              }`}
            >
              Trang chủ
            </button>
            {allModules
              .filter((m) => !m.adminOnly || user?.role === 'admin')
              .map((mod) => (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => {
                    onNavigate(mod.id);
                    setMobileOpen(false);
                  }}
                  className={`px-3 py-2.5 text-left text-sm rounded-xl font-medium ${
                    activeModule === mod.id
                      ? 'bg-[#EDE8FF] text-[#3E2B85]'
                      : 'bg-[#F8F6FC] text-[#3D3759]'
                  }`}
                >
                  {mod.label}
                </button>
              ))}
          </div>

          <div className="pt-2 border-t border-[#F0ECF7] flex items-center justify-between gap-2">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onOpenAuth();
                    setMobileOpen(false);
                  }}
                  className="text-sm font-medium text-[#3E2B85] truncate"
                >
                  {user.displayName}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    setMobileOpen(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#8D282C] bg-[#FEECEB] rounded-lg"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng xuất</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onOpenAuth();
                  setMobileOpen(false);
                }}
                className="w-full py-2.5 text-sm font-medium text-white bg-[#6B4CE6] rounded-xl"
              >
                Đăng nhập / Chọn vai trò Demo
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
