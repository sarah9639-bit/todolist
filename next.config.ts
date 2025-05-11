import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  eslint: {
    // 빌드 시 ESLint 검사를 비활성화합니다
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
