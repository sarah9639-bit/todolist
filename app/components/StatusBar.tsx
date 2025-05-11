'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Weather from './Weather';

export default function StatusBar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { theme } = useTheme();

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

  return (
    <div className={`fixed top-0 left-0 w-full shadow-md z-10 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-blue-600 text-white'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-2 sm:mb-0">
            <span className="font-medium text-sm sm:text-base mr-3">
              {formatDate(currentTime)}
            </span>
            <span className="mx-2 hidden sm:inline">|</span>
            <span className="font-medium text-sm sm:text-base">
              ⏰ {formatTime(currentTime)}
            </span>
          </div>
          <div className="w-full sm:w-auto sm:max-w-xs">
            <Weather />
          </div>
        </div>
      </div>
    </div>
  );
} 