"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

/**
 * The management copy of the property list has been folded into the shared one
 * at /dashboard/my-inspection, which PortalLayout renders inside the management
 * sidebar. The Other portal already points its Properties item there too.
 */
export default function ManagementMyPropertiesRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dashboard/my-inspection")
  }, [router])

  return null
}
