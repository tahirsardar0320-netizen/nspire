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
        {/*
          Capped and stacked deliberately. Saving several inspection items in a
          row queued a toast each, and with no limit they filled the screen top
          to bottom — on a phone that covered "Add Deficiency" and "Submit"
          entirely, so the inspection could not be continued at all. It looked
          like the app had frozen; in fact every control was simply behind the
          notifications. One at a time, and dismissable by tapping.
        */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          limit={1}
          stacked
          hideProgressBar={false}
          newestOnTop
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
