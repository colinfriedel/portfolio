import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Renamed project pages keep their old links working.
  async redirects() {
    return [{ source: "/projects/knob", destination: "/projects/volume-switch", permanent: true }];
  },
};

export default nextConfig;
