"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

/**
 * Management used to have its own copy of the property dashboard, which drifted
 * into a different card layout and lost the inspection progress bars. Every
 * portal now shares the one implementation at /dashboard, where PortalLayout
 * supplies the management sidebar, so this route just forwards there.
 */
export default function ManagementDashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dashboard")
  }, [router])

  return null
}
