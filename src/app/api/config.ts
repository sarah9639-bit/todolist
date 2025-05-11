// OpenWeatherMap API 키 설정
// 환경 변수를 통해서만 API 키를 제공합니다
export const getWeatherApiKey = (): string => {
  // 환경 변수가 설정되어 있다면 해당 값 사용
  if (process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY) {
    return process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
  }
  
  // 환경 변수가 없는 경우 빈 문자열 반환 또는 오류 메시지 설정
  console.warn('WARNING: NEXT_PUBLIC_OPENWEATHERMAP_API_KEY environment variable is not set.');
  return '';
}; 