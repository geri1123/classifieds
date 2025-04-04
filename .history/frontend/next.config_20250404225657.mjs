// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '8081',
          pathname: '/uploads/images/**',
        },
        {
            protocol: 'https',
            hostname: 'cdn.vectorstock.com/i/2000v/70/01/no-image-symbol-missing-available-icon-gallery-vector-42607001.avif',
            port: '',
            pathname: '/**',
          },
      ],
    },
  };
  
  export default nextConfig;