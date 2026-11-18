import React, { useEffect, useState } from 'react';
import { X, Shield, UserCheck, Lock, LogOut } from 'lucide-react';
import type { UserProfile } from '../types/index.ts';
import { apiFetch } from '../lib/api.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onAuthenticated: (token: string, user: UserProfile) => void;
  onLogout: () => void;
}

const ROLE_LABELS: Record<UserProfile['role'], string> = {
  student: 'Học sinh',
  parent: 'Phụ huynh',
  teacher: 'Giáo viên',
  admin: 'Phòng Tâm lý học đường',
};

export function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onAuthenticated,
  onLogout,
}: AuthModalProps) {
  const [demoAccounts, setDemoAccounts] = useState<UserProfile[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    apiFetch<{ accounts: UserProfile[] }>('/api/auth/demo-accounts')
      .then((res) => setDemoAccounts(res.accounts))
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleDemoLogin(userId: string) {
    setError('');
    setLoading(true);
    try {
      const res = await apiFetch<{ token: string; user: UserProfile }>('/api/auth/demo-login', {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
      onAuthenticated(res.token, res.user);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể đăng nhập.');
    } finally {
      setLoading(false);
    }
  }

  async function handleFormLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiFetch<{ token: string; user: UserProfile }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      onAuthenticated(res.token, res.user);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-[#242038]/40 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-[#E8E3F0] shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-[#F0ECF7] flex items-center justify-between">
          <div>
            <h2 id="auth-modal-title" className="font-display font-bold text-lg text-[#242038]">
              Tài khoản & Phân quyền VIBE SPACE
            </h2>
            <p className="text-xs text-[#6B6585] mt-0.5">
              Phiên bản demo với dữ liệu minh họa tách biệt cho từng nhóm người dùng
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#6B6585] hover:bg-[#F3EEFF]"
            aria-label="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {currentUser && (
            <div className="p-4 rounded-xl bg-[#F6F3FB] border border-[#E3DCF8] flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-[#5A5475]">
                  Đang đăng nhập · {ROLE_LABELS[currentUser.role]}
                </p>
                <p className="font-semibold text-[#242038] mt-0.5">{currentUser.displayName}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-white border border-[#E3DCF8] text-[#8D282C] hover:bg-[#FEECEB]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}

          {/* Quick Demo Role Switcher */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <UserCheck className="w-4 h-4 text-[#6B4CE6]" />
              <h3 className="font-display font-semibold text-sm text-[#242038]">
                Trải nghiệm nhanh theo vai trò (Tài khoản Demo minh họa)
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {demoAccounts.map((acc) => {
                const isSelected = currentUser?.id === acc.id;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    disabled={loading}
                    onClick={() => handleDemoLogin(acc.id)}
                    className={`p-3.5 rounded-xl border text-left transition-colors ${
                      isSelected
                        ? 'bg-[#EDE8FF] border-[#7C5CFC]'
                        : 'bg-[#FCFBF9] border-[#E8E3F0] hover:bg-[#F6F3FB] hover:border-[#CBBDFB]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-[#5A3EE0]">
                        {ROLE_LABELS[acc.role]}
                        {acc.classLabel ? ` · ${acc.classLabel}` : ''}
                      </span>
                      {acc.role === 'admin' && <Shield className="w-3.5 h-3.5 text-[#6B4CE6]" />}
                    </div>
                    <p className="font-semibold text-sm text-[#242038] mt-1">{acc.displayName}</p>
                    <p className="text-xs text-[#6B6585] mt-0.5">@{acc.username}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Standard Credential Login */}
          <form onSubmit={handleFormLogin} className="pt-4 border-t border-[#F0ECF7] space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#5A5475]" />
              <h3 className="font-display font-semibold text-sm text-[#242038]">
                Hoặc đăng nhập bằng tên tài khoản
              </h3>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[#FEECEB] text-[#8D282C] text-xs font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="vibe-username" className="block text-xs font-medium text-[#5A5475] mb-1">
                  Tên đăng nhập
                </label>
                <input
                  id="vibe-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="vd: minhan.tieuhoc"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E3DCF8] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]"
                />
              </div>
              <div>
                <label htmlFor="vibe-password" className="block text-xs font-medium text-[#5A5475] mb-1">
                  Mật khẩu (Demo: fpt@hanam2026)
                </label>
                <input
                  id="vibe-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E3DCF8] bg-[#FCFBF9] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-[11px] text-[#6B6585]">
                Nhật ký cảm xúc và trò chuyện riêng tư của học sinh được bảo mật theo phân quyền.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 text-sm font-medium rounded-xl bg-[#6B4CE6] text-white hover:bg-[#5A3BD6] disabled:opacity-60 whitespace-nowrap"
              >
                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
