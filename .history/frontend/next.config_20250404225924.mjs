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
        // {
        //     protocol: 'https',
        //     hostname: 'via.placeholder.com',
        //     port: '',
        //     pathname: '/**',
        //   },
      ],
    },
  };
  
  export default nextConfig;