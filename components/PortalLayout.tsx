"use client"

import { ReactNode, useEffect, useState } from "react"
import DashboardLayout from "./DashboardLayout"
import ManagementDashboardLayout from "./ManagementDashboardLayout"
import OtherDashboardLayout from "./OtherDashboardLayout"

interface PortalLayoutProps {
  children: ReactNode
}

const MANAGEMENT_ROLES = ["management", "property-manager", "supervisor"]

/**
 * Renders whichever portal chrome matches the signed-in user's role.
 *
 * The NSPIRE inspection screens are identical for inspectors, management and
 * other users, so they live at a single route rather than being copied per
 * portal. This wrapper keeps each user inside their own navigation while they
 * share that one implementation.
 */
export default function PortalLayout({ children }: PortalLayoutProps) {
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user")
      setRole(stored ? JSON.parse(stored)?.role ?? "inspector" : "inspector")
    } catch {
      setRole("inspector")
    }
  }, [])

  // Until the role is known, render the children bare rather than flashing the
  // wrong portal's sidebar and then swapping it out.
  if (role === null) return <>{children}</>

  if (MANAGEMENT_ROLES.includes(role)) {
    return <ManagementDashboardLayout>{children}</ManagementDashboardLayout>
  }

  if (role === "other") {
    return <OtherDashboardLayout>{children}</OtherDashboardLayout>
  }

  return <DashboardLayout>{children}</DashboardLayout>
}
