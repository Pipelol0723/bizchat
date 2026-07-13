/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // Nota: el widget está pensado para embeberse en sitios de clientes, así
          // que NO se usa X-Frame-Options: DENY (rompería el embed). Si en algún
          // despliegue el sitio NO debe embeberse, agregar aquí frame-ancestors.
        ],
      },
    ]
  },
}

export default nextConfig
