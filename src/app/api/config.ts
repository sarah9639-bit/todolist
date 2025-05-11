// OpenWeatherMap API 키 설정
// 실제 배포 시에는 환경 변수로 대체하거나 보안 서비스를 사용하세요
// 여기에 백업용 API 키를 설정할 수 있습니다 (개발용)
export const WEATHER_API_KEY = '1a64541e8c8eff007f63cbd4b105aba8';

// API 키를 안전하게 가져오는 함수
export const getWeatherApiKey = (): string => {
  // 환경 변수가 설정되어 있다면 해당 값 사용
  if (process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY) {
    return process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
  }
  
  // 환경 변수가 없다면 하드코딩된 값 사용 (개발 환경에서만 사용)
  return WEATHER_API_KEY;
}; 