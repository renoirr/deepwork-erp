import type { NextConfig } from "next";

// GitHub Pages는 저장소 이름이 경로에 붙으므로(예: /deepwork-erp) 빌드 시 주입한다.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
};

export default nextConfig;
