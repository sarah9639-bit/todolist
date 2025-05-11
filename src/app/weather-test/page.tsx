'use client';

import Weather from '../components/Weather';
import Link from 'next/link';

export default function WeatherTestPage() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-8">Weather Component Test</h1>
      
      <div className="w-full max-w-md">
        <Weather />
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg text-sm max-w-md">
        <h2 className="font-semibold mb-2">사용 방법:</h2>
        <p>이 컴포넌트는 브라우저의 위치 정보 접근 권한을 요청합니다.</p>
        <p className="mt-2">실제 사용을 위해서는 <code className="bg-gray-100 px-1">src/app/api/config.ts</code> 파일에서 OpenWeatherMap API 키를 설정해야 합니다:</p>
        <code className="block mt-2 p-2 bg-gray-100 rounded overflow-x-auto">
          export const WEATHER_API_KEY = '여기에_발급받은_API_키를_입력하세요';
        </code>
        
        <h3 className="font-semibold mt-4 mb-2">API 키 획득 방법:</h3>
        <ol className="list-decimal pl-5 space-y-1">
          <li><a href="https://home.openweathermap.org/users/sign_up" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenWeatherMap 회원가입</a></li>
          <li>로그인 후 'API keys' 탭으로 이동</li>
          <li>기본 API 키를 사용하거나 새 키 생성</li>
          <li>API 키를 복사하여 config.ts 파일에 붙여넣기</li>
        </ol>
        
        <p className="mt-4 text-xs text-gray-500">참고: API 키 활성화에는 최대 2시간이 소요될 수 있습니다.</p>
      </div>
      
      <Link href="/" className="mt-8 text-blue-600 hover:underline">
        홈으로 돌아가기
      </Link>
    </div>
  );
} 