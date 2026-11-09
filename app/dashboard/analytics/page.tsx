"use client"

import { useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "react-toastify"
import { Users, Search, Mail, Briefcase, Calendar, CheckCircle2, XCircle, Info, ChevronRight, ShieldCheck, AlertCircle } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
  properties: string[]
  status: "Active" | "Inactive"
  joinDate: string
}

export default function OthersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  // Mock data - non-inspector users from signup
  const users: User[] = [
    {
      id: "USR-001",
      name: "Sarah Mitchell",
      email: "sarah.mitchell@example.com",
      role: "Property Manager",
      properties: ["Sunset Apartments", "River Heights", "Oakwood Towers"],
      status: "Active",
      joinDate: "2024-01-15",
    },
    {
      id: "USR-002",
      name: "Michael Chen",
      email: "michael.chen@example.com",
      role: "Property Manager",
      properties: ["Courthouse Apartments", "Calhoun Homes"],
      status: "Active",
      joinDate: "2024-02-10",
    },
    {
      id: "USR-003",
      name: "Emma Johnson",
      email: "emma.johnson@example.com",
      role: "Supervisor",
      properties: ["STEPHEN'S PARK APA", "Demure St-Hilaire"],
      status: "Active",
      joinDate: "2024-01-20",
    },
    {
      id: "USR-004",
      name: "David Martinez",
      email: "david.martinez@example.com",
      role: "Coordinator",
      properties: ["Sunset Apartments"],
      status: "Inactive",
      joinDate: "2023-12-05",
    },
    {
      id: "USR-005",
      name: "Jessica Lee",
      email: "jessica.lee@example.com",
      role: "Property Manager",
      properties: ["River Heights", "Oakwood Towers", "Courthouse Apartments"],
      status: "Active",
      joinDate: "2024-01-08",
    },
  ]

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = !roleFilter || user.role === roleFilter
    const matchesStatus = !statusFilter || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleViewDetails = (userId: string) => {
    toast.info(`Viewing details for user ${userId}`, { position: "top-right" })
  }

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      "Property Manager": "bg-teal-50 text-teal-700 border-teal-200/60",
      "Supervisor": "bg-violet-50 text-violet-700 border-violet-200/60",
      "Coordinator": "bg-sky-50 text-sky-700 border-sky-200/60",
    }
    return colors[role] || "bg-slate-50 text-slate-700 border-slate-200/60"
  }

  const getStatusBadge = (status: string) => {
    return status === "Active" ? (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Active
      </span>
    ) : (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1">
        <XCircle className="w-3.5 h-3.5" />
        Inactive
      </span>
    )
  }

  const uniqueRoles = [...new Set(users.map(u => u.role))]

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 text-slate-900 font-lexend space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Users className="w-6 h-6 text-teal-600" />
                Others (Non-Inspector Users)
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
                View all non-inspector users (Property Managers, Supervisors, Coordinators) and their associated properties.
              </p>
            </div>
          </div>

          {/* Filters */}
          <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Search className="w-4 h-4 text-teal-600" />
              <h2 className="text-sm font-black text-[#0E7490] uppercase tracking-wider">Search Filters</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-2 space-y-1">
                <label className="text-xs font-black text-[#0E7490] uppercase tracking-wider">
                  Search by Name or Email
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <div className="space-y-1">
                <label className="text-xs font-black text-[#0E7490] uppercase tracking-wider">Role</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
                >
                  <option value="">All Roles</option>
                  {uniqueRoles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="space-y-1">
                <label className="text-xs font-black text-[#0E7490] uppercase tracking-wider">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-medium text-slate-800 transition-all"
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Users List */}
          <div className="space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <Card key={user.id} className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* User Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">{user.name}</h3>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Role and Status Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-0.5 border rounded-full text-xs font-bold flex items-center gap-1 ${getRoleColor(user.role)}`}>
                          <Briefcase className="w-3.5 h-3.5" />
                          {user.role}
                        </span>
                        {getStatusBadge(user.status)}
                        <span className="px-2.5 py-0.5 border border-slate-200/60 bg-slate-50 text-slate-500 rounded-full text-xs font-bold flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Joined {user.joinDate}
                        </span>
                      </div>

                      {/* Associated Properties */}
                      <div className="pt-2">
                        <p className="text-xs font-black text-[#0E7490] uppercase tracking-wider mb-2">
                          Associated Properties ({user.properties.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {user.properties.map((property, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-lg bg-teal-50/50 border border-teal-100/50 text-teal-700 text-xs font-bold"
                            >
                              {property}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col justify-end lg:w-auto mt-2 lg:mt-0">
                      <Button
                        onClick={() => handleViewDetails(user.id)}
                        className="w-full lg:w-auto bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm border-0 transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-teal-600/10"
                      >
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-12 text-center max-w-lg mx-auto">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-700 font-bold text-lg">No users found</p>
                <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
              </Card>
            )}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-[#0E7490] uppercase tracking-wider mb-1">Total Users</p>
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{users.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-600">
                <Users className="w-6 h-6" />
              </div>
            </Card>
            <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-[#0E7490] uppercase tracking-wider mb-1">Active Users</p>
                <p className="text-3xl font-extrabold text-emerald-600 tracking-tight">
                  {users.filter(u => u.status === "Active").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </Card>
            <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-[#0E7490] uppercase tracking-wider mb-1">Inactive Users</p>
                <p className="text-3xl font-extrabold text-slate-500 tracking-tight">
                  {users.filter(u => u.status === "Inactive").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-400">
                <AlertCircle className="w-6 h-6" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

