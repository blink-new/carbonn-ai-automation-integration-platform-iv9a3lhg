import React from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Bot, 
  LayoutDashboard, 
  Workflow, 
  Puzzle, 
  MessageSquare, 
  BarChart3, 
  LogOut,
  Zap,
  Settings
} from 'lucide-react'
import { User } from '@supabase/supabase-js'

interface SidebarProps {
  user: User
  activeTab: string
  setActiveTab: (tab: string) => void
  onSignOut: () => void
}

export default function Sidebar({ user, activeTab, setActiveTab, onSignOut }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workflows', label: 'Workflows', icon: Workflow },
    { id: 'integrations', label: 'Integrations', icon: Puzzle },
    { id: 'ai-assistant', label: 'AI Assistant', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">carbonN</h1>
            <p className="text-xs text-slate-500">AI Automation Platform</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">
              {user.user_metadata?.full_name || 'User'}
            </p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            Pro
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start h-11 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
              {item.id === 'workflows' && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  3
                </Badge>
              )}
              {item.id === 'integrations' && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  12
                </Badge>
              )}
            </Button>
          )
        })}
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-slate-200 space-y-2">
        <Button 
          variant="outline" 
          className="w-full justify-start h-10 text-slate-600 hover:text-slate-800"
        >
          <Zap className="w-4 h-4 mr-3" />
          Quick Automation
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start h-10 text-slate-600 hover:text-slate-800"
        >
          <Settings className="w-4 h-4 mr-3" />
          Settings
        </Button>
      </div>

      {/* Sign Out */}
      <div className="p-4 border-t border-slate-200">
        <Button
          variant="ghost"
          className="w-full justify-start h-10 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onSignOut}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}