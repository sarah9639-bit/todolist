'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Weather from './Weather';
import Todo from './Todo';
import BilingualSentence from './BilingualSentence';

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { theme, setTheme } = useTheme();

  // 시간 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 시간 포맷팅 (HH:mm:ss)
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  // 날짜 포맷팅 (YYYY.MM.DD (요일))
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekDay = weekDays[date.getDay()];
    
    return `${year}.${month}.${day} (${weekDay})`;
  };

  // 테마 토글
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* 헤더 */}
      <header className="fixed top-0 left-0 w-full z-10 bg-white shadow-sm border-b border-slate-200 h-16 flex items-center">
        <div className="container mx-auto px-6 flex items-center justify-between h-full">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <span className="font-sans font-extrabold text-xl text-gray-900">Dashboard</span>
          </div>
          <button 
            onClick={toggleTheme}
            className="rounded-full px-5 py-2 text-base font-semibold hover:brightness-95 focus:ring-2 focus:ring-blue-400 transition-all"
            aria-label="테마 변경"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* 정보 섹션 (시계 + 날씨) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* 디지털 시계 */}
          <div className="bg-white shadow-md rounded-xl p-6 flex flex-col justify-center space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-4xl">🕒</span>
              <div>
                <div className="text-3xl font-bold text-gray-900">{formatTime(currentTime)}</div>
                <div className="text-lg text-gray-900">{formatDate(currentTime)}</div>
              </div>
            </div>
          </div>
          {/* 날씨 정보 */}
          <div className="bg-white shadow-md rounded-xl p-6 flex flex-col justify-center space-y-4">
            <Weather />
          </div>
        </div>
        
        {/* Todo 앱 */}
        <div className="mt-12">
          <Todo />
        </div>

        {/* Bilingual Sentence Generator */}
        <div className="mb-8">
          <BilingualSentence />
        </div>
      </div>
    </div>
  );
} 