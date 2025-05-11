'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { getWeatherApiKey } from '../api/config';

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  icon: string;
  loading: boolean;
  error: string | null;
}

// 도시 이름 영문->한글 매핑
const cityNameMap: Record<string, string> = {
  'Seoul': '서울',
  'Incheon': '인천',
  'Busan': '부산',
  'Daegu': '대구',
  'Daejeon': '대전',
  'Gwangju': '광주',
  'Suwon-si': '수원',
  'Seongnam-si': '성남',
  'Goyang-si': '고양',
  'Bucheon-si': '부천',
  'Ansan-si': '안산',
  'Anyang-si': '안양',
  'Ulsan': '울산',
  'Sejong': '세종',
  'Yongin': '용인',
  'Changwon': '창원',
  'Gunpo': '군포',
  'Gunpo-si': '군포',
  'Jeju City': '제주',
  'Jeju-si': '제주',
  'Pyeongtaek': '평택',
  'Cheonan': '천안',
  'Hwaseong': '화성',
  'Pohang': '포항',
  'Cheongju': '청주',
  'Gimhae': '김해',
  'Namyangju': '남양주',
  'Gangneung': '강릉',
  'Chuncheon': '춘천',
  'Siheung': '시흥',
  'Gyeongju': '경주',
  'Chungju': '충주',
  'Guri': '구리',
  'Jeonju': '전주',
  'Mokpo': '목포',
  'Yangsan': '양산',
  'Gyeongsan': '경산',
  'Wonju': '원주',
  'Iksan': '익산',
  'Suncheon': '순천',
  'Asan': '아산',
  'Gwangmyeong': '광명'
};

// 한글 도시 이름 가져오기
const getKoreanCityName = (englishName: string): string => {
  // -si, -gu 등의 접미사 제거
  const baseName = englishName.split('-')[0].trim();
  // 매핑에서 찾기
  return cityNameMap[englishName] || cityNameMap[baseName] || englishName;
};

// 날씨 설명 개선
const improveWeatherDescription = (description: string): string => {
  const descriptionMap: Record<string, string> = {
    '맑음': '맑음',
    '구름 조금': '구름 조금',
    '구름': '구름',
    '흐림': '흐림',
    '온흐림': '흐림',
    '실 비': '가벼운 비',
    '소나기': '소나기',
    '비': '비',
    '강한 비': '강한 비',
    '폭우': '폭우',
    '천둥 번개': '천둥 번개',
    '안개': '안개',
    '박무': '안개',
    '눈': '눈',
    '강설': '강설',
    '진눈깨비': '진눈깨비',
    '온구름': '구름 많음',
    '구름많음': '구름 많음',
    '약간의 구름': '구름 조금',
    '약한 비': '가벼운 비',
    '부분적 구름': '구름 조금',
    '대체로 흐림': '흐림',
    '흐린 하늘': '흐림'
  };

  return descriptionMap[description] || description;
};

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData>({
    city: '',
    temperature: 0,
    description: '',
    icon: '',
    loading: true,
    error: null
  });
  const { theme } = useTheme();

  // fetchWeatherData를 useCallback으로 감싸서 의존성 문제 해결
  const fetchWeatherData = useCallback(async (lat: number, lon: number) => {
    try {
      // config.ts에서 API 키 가져오기
      const apiKey = getWeatherApiKey();
      
      // API 키가 유효한지 확인
      if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        setWeather(prev => ({
          ...prev,
          loading: false,
          error: 'API 키가 설정되지 않았습니다. .env.local 파일이나 config.ts 파일에서 API 키를 확인해주세요.',
        }));
        return;
      }
      
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=kr`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('날씨 정보를 가져오는데 실패했습니다.');
      }
      
      const data = await response.json();
      
      // 도시 이름을 한글로 변환
      const koreanCityName = getKoreanCityName(data.name);
      // 날씨 설명 개선
      const improvedDescription = improveWeatherDescription(data.weather[0].description);
      
      setWeather({
        city: koreanCityName,
        temperature: Math.round(data.main.temp),
        description: improvedDescription,
        icon: getWeatherIcon(data.weather[0].icon),
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('날씨 데이터 가져오기 오류:', error);
      setWeather(prev => ({
        ...prev,
        loading: false,
        error: '날씨 정보를 가져오는데 실패했습니다.',
      }));
    }
  }, []);

  useEffect(() => {
    // 사용자의 위치 정보 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setWeather(prev => ({
            ...prev,
            loading: false,
            error: '위치 정보를 가져올 수 없습니다. 기본 위치로 대체합니다.',
          }));
          // 기본 위치로 서울 사용
          fetchWeatherData(37.5665, 126.9780);
        }
      );
    } else {
      setWeather(prev => ({
        ...prev,
        loading: false,
        error: '이 브라우저는 위치 정보를 지원하지 않습니다. 기본 위치로 대체합니다.',
      }));
      // 기본 위치로 서울 사용
      fetchWeatherData(37.5665, 126.9780);
    }
  }, [fetchWeatherData]); // fetchWeatherData 의존성 추가

  // 날씨 아이콘 코드에 따른 이모지 매핑
  const getWeatherIcon = (iconCode: string) => {
    const iconMap: Record<string, string> = {
      '01d': '☀️', // 맑음 (낮)
      '01n': '🌙', // 맑음 (밤)
      '02d': '🌤️', // 구름 조금 (낮)
      '02n': '☁️', // 구름 조금 (밤)
      '03d': '☁️', // 구름 많음
      '03n': '☁️',
      '04d': '☁️', // 흐림
      '04n': '☁️',
      '09d': '🌧️', // 소나기
      '09n': '🌧️',
      '10d': '🌦️', // 비 (낮)
      '10n': '🌧️', // 비 (밤)
      '11d': '⛈️', // 천둥번개
      '11n': '⛈️',
      '13d': '❄️', // 눈
      '13n': '❄️',
      '50d': '🌫️', // 안개
      '50n': '🌫️'
    };

    return iconMap[iconCode] || '🌡️';
  };

  // 로딩 중 표시
  if (weather.loading) {
    return (
      <div className={`rounded-lg p-4 shadow-md flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
      }`}>
        <div className="animate-pulse flex space-x-4 items-center">
          <div className="rounded-full bg-gray-300 h-12 w-12"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // 오류 표시
  if (weather.error) {
    return (
      <div className={`rounded-lg p-4 shadow-md ${
        theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
      }`}>
        <div className="flex items-center">
          <span className="text-2xl mr-3">❓</span>
          <div>
            <p className="font-medium">날씨 정보 불가</p>
            <p className="text-sm opacity-80">{weather.error}</p>
          </div>
        </div>
      </div>
    );
  }

  // 날씨 정보 표시
  return (
    <div className={`transition-all duration-300 ${
      theme === 'dark' ? 'text-white' : 'text-gray-800'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-5xl mr-4">{weather.icon}</span>
          <div>
            <h3 className="font-bold text-2xl">{weather.city}</h3>
            <p className="text-base opacity-80">{weather.description}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold">{weather.temperature}°C</span>
        </div>
      </div>
    </div>
  );
} 