import type { Metadata, Viewport } from 'next'
// import { Inter } from 'next/font/google'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './globals.css'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'
import FetchTimeoutGuard from '@/components/FetchTimeoutGuard'

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Best Certified Home Inspectors Inspection Services USA',
  description: 'Our reliable home inspectors deliver accurate reports, and trusted service for buyers, sellers, and others.',
  generator: 'v0.app',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#006795',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased font-sans">
        <FetchTimeoutGuard />
        <ServiceWorkerRegister />
        {children}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  )
}
