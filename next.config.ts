import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/resume/Mamun_Reja_Resume.pdf",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0, must-revalidate",
          },
          {
            key: "Content-Disposition",
            value: 'attachment; filename="Mamun_Reja_Resume.pdf"',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
