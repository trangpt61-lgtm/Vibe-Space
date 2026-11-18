import React, { useEffect, useState } from 'react';
import type { ActiveModule, GradeLevel, UserProfile } from './types/index.ts';
import { apiFetch, getStoredToken, setStoredToken } from './lib/api.ts';
import { Navbar } from './components/Navbar.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { HomePage } from './components/HomePage.tsx';
import { MyFeelings } from './components/MyFeelings.tsx';
import { CalmCorner } from './components/CalmCorner.tsx';
import { BuddyTalk } from './components/BuddyTalk.tsx';
import { EmotionDiary } from './components/EmotionDiary.tsx';
import { GetSupport } from './components/GetSupport.tsx';
import { PsychologyLibrary } from './components/PsychologyLibrary.tsx';
import { ParentTeacherCorner } from './components/ParentTeacherCorner.tsx';
import { PsychologyDashboard } from './components/PsychologyDashboard.tsx';

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('home');
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>('middle');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;
    apiFetch<{ user: UserProfile }>('/api/auth/me')
      .then((res) => {
        if (res.user) {
          setUser(res.user);
          if (res.user.gradeLevel) {
            setGradeLevel(res.user.gradeLevel);
          }
        }
      })
      .catch(() => {
        setStoredToken(null);
      });
  }, []);

  function handleAuthenticated(token: string, nextUser: UserProfile) {
    setStoredToken(token);
    setUser(nextUser);
    if (nextUser.gradeLevel) {
      setGradeLevel(nextUser.gradeLevel);
    }
    if (nextUser.role === 'admin') {
      setActiveModule('admin-dashboard');
    } else if (nextUser.role === 'parent' || nextUser.role === 'teacher') {
      setActiveModule('parent-teacher');
    }
  }

  async function handleLogout() {
    await apiFetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    setStoredToken(null);
    setUser(null);
    if (activeModule === 'admin-dashboard') {
      setActiveModule('home');
    }
  }

  function handleNavigate(mod: ActiveModule) {
    setActiveModule(mod);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFBF9] text-[#242038]">
      <Navbar
        activeModule={activeModule}
        onNavigate={handleNavigate}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        gradeLevel={gradeLevel}
        onChangeGradeLevel={setGradeLevel}
      />

      <main className="flex-1">
        {activeModule === 'home' && (
          <HomePage
            gradeLevel={gradeLevel}
            onChangeGradeLevel={setGradeLevel}
            onNavigate={handleNavigate}
            user={user}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}
        {activeModule === 'my-feelings' && (
          <MyFeelings
            gradeLevel={gradeLevel}
            user={user}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}
        {activeModule === 'calm-corner' && <CalmCorner gradeLevel={gradeLevel} />}
        {activeModule === 'buddy-talk' && (
          <BuddyTalk
            gradeLevel={gradeLevel}
            user={user}
            onNavigate={handleNavigate}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}
        {activeModule === 'emotion-diary' && (
          <EmotionDiary
            gradeLevel={gradeLevel}
            user={user}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}
        {activeModule === 'get-support' && (
          <GetSupport
            gradeLevel={gradeLevel}
            user={user}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}
        {activeModule === 'library' && (
          <PsychologyLibrary
            gradeLevel={gradeLevel}
            onChangeGradeLevel={setGradeLevel}
          />
        )}
        {activeModule === 'parent-teacher' && (
          <ParentTeacherCorner user={user} onNavigate={handleNavigate} />
        )}
        {activeModule === 'admin-dashboard' && (
          <PsychologyDashboard
            user={user}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}
      </main>

      <footer className="border-t border-[#EFEBF7] bg-white py-6 px-4 sm:px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B6585]">
          <div>
            <span className="font-display font-semibold text-[#242038]">
              VIBE SPACE – Không gian cảm xúc
            </span>{' '}
            · Trường Tiểu học, THCS & THPT FPT Hà Nam
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => handleNavigate('get-support')}
              className="hover:text-[#5A3EE0]"
            >
              Kết nối Phòng Tâm lý
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('parent-teacher')}
              className="hover:text-[#5A3EE0]"
            >
              Góc Phụ huynh & Giáo viên
            </button>
            <span>Đường dây nóng Bảo vệ Trẻ em: 111</span>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={user}
        onAuthenticated={handleAuthenticated}
        onLogout={handleLogout}
      />
    </div>
  );
}
