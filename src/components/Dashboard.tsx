import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Activity, 
  Zap, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  Settings,
  Plus,
  BarChart3,
  Globe,
  Bot,
  Calendar,
  Mail,
  FileText
} from 'lucide-react'
import { User } from '@supabase/supabase-js'

interface DashboardProps {
  user: User
}

export default function Dashboard({ user }: DashboardProps) {
  const [stats, setStats] = useState({
    activeWorkflows: 12,
    totalExecutions: 1847,
    successRate: 98.2,
    integrations: 8,
    savedHours: 156
  })

  const [recentActivity] = useState([
    {
      id: 1,
      type: 'workflow',
      title: 'Email Newsletter Automation',
      status: 'completed',
      timestamp: '2 minutes ago',
      icon: Mail
    },
    {
      id: 2,
      type: 'research',
      title: 'AI Trends Research',
      status: 'running',
      timestamp: '5 minutes ago',
      icon: Globe
    },
    {
      id: 3,
      type: 'calendar',
      title: 'Meeting Scheduled',
      status: 'completed',
      timestamp: '12 minutes ago',
      icon: Calendar
    },
    {
      id: 4,
      type: 'document',
      title: 'Report Generated',
      status: 'completed',
      timestamp: '1 hour ago',
      icon: FileText
    }
  ])

  const [activeWorkflows] = useState([
    {
      id: 1,
      name: 'Social Media Automation',
      status: 'active',
      executions: 245,
      successRate: 99.2,
      lastRun: '5 min ago'
    },
    {
      id: 2,
      name: 'Lead Generation Pipeline',
      status: 'active',
      executions: 89,
      successRate: 97.8,
      lastRun: '12 min ago'
    },
    {
      id: 3,
      name: 'Data Backup Sync',
      status: 'paused',
      executions: 156,
      successRate: 100,
      lastRun: '2 hours ago'
    }
  ])

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome back, {user.user_metadata?.full_name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-slate-600 mt-1">
            Your automation platform is running smoothly. Here's what's happening.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Active Workflows</p>
                <p className="text-3xl font-bold">{stats.activeWorkflows}</p>
              </div>
              <Zap className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Executions</p>
                <p className="text-3xl font-bold text-slate-800">{stats.totalExecutions.toLocaleString()}</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Success Rate</p>
                <p className="text-3xl font-bold text-slate-800">{stats.successRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Integrations</p>
                <p className="text-3xl font-bold text-slate-800">{stats.integrations}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Hours Saved</p>
                <p className="text-3xl font-bold text-slate-800">{stats.savedHours}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Workflows */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span>Active Workflows</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeWorkflows.map((workflow) => (
                <div key={workflow.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-slate-800">{workflow.name}</h3>
                      <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                        {workflow.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600">
                      <span>{workflow.executions} executions</span>
                      <span>{workflow.successRate}% success</span>
                      <span>Last run: {workflow.lastRun}</span>
                    </div>
                    <Progress value={workflow.successRate} className="mt-2 h-2" />
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button size="sm" variant="outline">
                      {workflow.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-600" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon
              return (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      activity.status === 'completed' ? 'text-green-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{activity.title}</p>
                    <p className="text-sm text-slate-600">{activity.timestamp}</p>
                  </div>
                  {activity.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-purple-600" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Globe className="w-6 h-6 text-blue-600" />
              <span className="text-sm">Research & Analyze</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Calendar className="w-6 h-6 text-green-600" />
              <span className="text-sm">Schedule Events</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Mail className="w-6 h-6 text-orange-600" />
              <span className="text-sm">Send Emails</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              <span className="text-sm">Generate Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}