"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { Bell, Info, CheckCircle2, AlertTriangle, XCircle, Trash2, Check, CheckCheck } from "lucide-react"

interface Notification {
  _id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  createdAt: string
  link?: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      const mockNotifications: Notification[] = [
        {
          _id: '1',
          title: 'Inspection Scheduled',
          message: 'Your inspection for Sunset Apartments Unit 101 has been scheduled for January 5, 2026.',
          type: 'info',
          isRead: false,
          createdAt: new Date().toISOString(),
          link: '/dashboard/my-inspection'
        },
        {
          _id: '2',
          title: 'Inspection Complete',
          message: 'Inspection for River Heights Unit 205 has been completed successfully.',
          type: 'success',
          isRead: false,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          _id: '3',
          title: 'Action Required',
          message: 'Follow-up required for Courthouse Apartments Unit 312. Please review the findings.',
          type: 'warning',
          isRead: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          link: '/dashboard/my-inspection'
        },
        {
          _id: '4',
          title: 'System Update',
          message: 'NSPIRE inspection criteria have been updated. Please review the new guidelines.',
          type: 'info',
          isRead: true,
          createdAt: new Date(Date.now() - 172800000).toISOString()
        },
        {
          _id: '5',
          title: 'Report Generated',
          message: 'Your weekly inspection report has been generated and is ready for download.',
          type: 'success',
          isRead: true,
          createdAt: new Date(Date.now() - 259200000).toISOString()
        }
      ]
      setNotifications(mockNotifications)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n._id === id ? { ...n, isRead: true } : n)
    )
    toast.success('Marked as read', { position: 'top-right' })
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    toast.success('All notifications marked as read', { position: 'top-right' })
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n._id !== id))
    toast.success('Notification deleted', { position: 'top-right' })
  }

  const clearAll = () => {
    setNotifications([])
    toast.success('All notifications cleared', { position: 'top-right' })
  }

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return { bg: 'bg-emerald-50/50 hover:bg-emerald-50', border: 'border-l-emerald-500 border border-slate-200/80', icon: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-700 border border-emerald-100' }
      case 'warning':
        return { bg: 'bg-amber-50/50 hover:bg-amber-50', border: 'border-l-amber-500 border border-slate-200/80', icon: 'text-amber-600', badge: 'bg-amber-50 text-amber-700 border border-amber-100' }
      case 'error':
        return { bg: 'bg-rose-50/50 hover:bg-rose-50', border: 'border-l-rose-500 border border-slate-200/80', icon: 'text-rose-600', badge: 'bg-rose-50 text-rose-700 border border-rose-100' }
      default:
        return { bg: 'bg-sky-50/50 hover:bg-sky-50', border: 'border-l-sky-500 border border-slate-200/80', icon: 'text-sky-600', badge: 'bg-sky-50 text-sky-700 border border-sky-100' }
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />
      case 'error':
        return <XCircle className="w-5 h-5" />
      default:
        return <Info className="w-5 h-5" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead
    if (filter === 'read') return n.isRead
    return true
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 text-slate-900 font-lexend space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Bell className="w-6 h-6 text-teal-600" />
                Notifications
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
                {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              {unreadCount > 0 && (
                <Button
                  onClick={markAllAsRead}
                  variant="outline"
                  className="flex-1 sm:flex-initial bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <CheckCheck className="w-4 h-4 text-teal-600" />
                  Mark all as read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  onClick={clearAll}
                  variant="outline"
                  className="flex-1 sm:flex-initial bg-white border border-rose-200 hover:border-rose-300 hover:bg-rose-50 text-rose-600 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                  Clear all
                </Button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 bg-white p-1.5 border border-slate-200/80 rounded-2xl shadow-sm w-max">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                filter === 'all' 
                  ? 'bg-teal-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                filter === 'unread' 
                  ? 'bg-teal-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                filter === 'read' 
                  ? 'bg-teal-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              Read ({notifications.length - unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center text-slate-500 font-medium">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent mx-auto mb-3"></div>
                Loading notifications...
              </div>
            ) : filteredNotifications.length === 0 ? (
              <Card className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-4">
                  <Bell className="w-8 h-8" />
                </div>
                <p className="text-slate-700 font-extrabold text-lg">No notifications</p>
                <p className="text-slate-400 text-xs mt-1">
                  {filter === 'unread' ? "You are completely caught up!" : "No notifications to display"}
                </p>
              </Card>
            ) : (
              filteredNotifications.map((notification) => {
                const styles = getTypeStyles(notification.type)
                return (
                  <Card 
                    key={notification._id}
                    className={`p-5 rounded-2xl border-l-4 ${styles.border} ${styles.bg} ${
                      !notification.isRead ? 'ring-1 ring-teal-500/10' : ''
                    } transition-all hover:shadow-md`}
                  >
                    <div className="flex gap-4">
                      <div className={`flex-shrink-0 ${styles.icon} mt-0.5`}>
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-extrabold text-slate-900 tracking-tight text-sm">
                                {notification.title}
                              </h3>
                              {!notification.isRead && (
                                <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-teal-500 text-white animate-pulse">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                              {notification.message}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold pt-1">
                              {formatDate(notification.createdAt)}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification._id)}
                                className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200 text-slate-500 hover:text-teal-600 shadow-sm"
                                title="Mark as read"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification._id)}
                              className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200 text-slate-500 hover:text-rose-500 shadow-sm"
                              title="Delete notification"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
