import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Activity, 
  Clock, 
  Zap,
  Users,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'
import { User } from '@supabase/supabase-js'

interface AnalyticsProps {
  user: User
}

export default function Analytics({ user }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState('7d')
  
  const timeRanges = [
    { id: '24h', label: 'Last 24 Hours' },
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: '90d', label: 'Last 90 Days' }
  ]

  const metrics = [
    {
      title: 'Total Executions',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Activity,
      color: 'text-blue-600'
    },
    {
      title: 'Success Rate',
      value: '98.2%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Active Workflows',
      value: '12',
      change: '+3',
      trend: 'up',
      icon: Zap,
      color: 'text-purple-600'
    },
    {
      title: 'Hours Saved',
      value: '156',
      change: '+24',
      trend: 'up',
      icon: Clock,
      color: 'text-orange-600'
    }
  ]

  const workflowPerformance = [
    { name: 'Email Newsletter', executions: 245, success: 99.2, errors: 2 },
    { name: 'Lead Generation', executions: 189, success: 94.7, errors: 10 },
    { name: 'Social Media', executions: 156, success: 97.4, errors: 4 },
    { name: 'Meeting Notes', executions: 89, success: 91.0, errors: 8 },
    { name: 'Data Backup', executions: 67, success: 100, errors: 0 }
  ]

  const recentErrors = [
    {
      workflow: 'Lead Generation Pipeline',
      error: 'API rate limit exceeded',
      time: '2 hours ago',
      status: 'resolved'
    },
    {
      workflow: 'Email Newsletter',
      error: 'Invalid email address format',
      time: '1 day ago',
      status: 'resolved'
    },
    {
      workflow: 'Meeting Notes Generator',
      error: 'Recording file not found',
      time: '2 days ago',
      status: 'pending'
    }
  ]

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Analytics</h1>
          <p className="text-slate-600 mt-1">
            Monitor your automation performance and insights
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex space-x-2">
            {timeRanges.map((range) => (
              <Button
                key={range.id}
                variant={timeRange === range.id ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range.id)}
              >
                {range.label}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">{metric.title}</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{metric.value}</p>
                    <div className="flex items-center mt-2">
                      {metric.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.change}
                      </span>
                      <span className="text-slate-500 text-sm ml-1">vs last period</span>
                    </div>
                  </div>
                  <Icon className={`w-8 h-8 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workflow Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Workflow Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {workflowPerformance.map((workflow, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">{workflow.name}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {workflow.executions} runs
                    </Badge>
                    <Badge 
                      variant={workflow.success >= 95 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {workflow.success}% success
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      workflow.success >= 95 ? 'bg-green-500' : 
                      workflow.success >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${workflow.success}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>{workflow.executions} total executions</span>
                  <span>{workflow.errors} errors</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Errors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-red-600" />
              <span>Recent Issues</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentErrors.map((error, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-800">{error.workflow}</h4>
                    <p className="text-sm text-slate-600 mt-1">{error.error}</p>
                    <p className="text-xs text-slate-500 mt-2">{error.time}</p>
                  </div>
                  <Badge 
                    variant={error.status === 'resolved' ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {error.status}
                  </Badge>
                </div>
              </div>
            ))}
            
            {recentErrors.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-medium text-slate-800 mb-1">All systems running smoothly!</h3>
                <p className="text-sm text-slate-600">No recent errors to report.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Execution Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span>Execution Timeline</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="font-medium text-slate-800 mb-1">Chart Coming Soon</h3>
              <p className="text-sm text-slate-600">
                Interactive execution timeline will be available in the next update
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800 mb-1">Peak Usage</h3>
            <p className="text-2xl font-bold text-blue-600">9-11 AM</p>
            <p className="text-sm text-slate-600">Most active time</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Zap className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800 mb-1">Most Used</h3>
            <p className="text-lg font-bold text-green-600">Email Automation</p>
            <p className="text-sm text-slate-600">Top workflow category</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800 mb-1">Avg Runtime</h3>
            <p className="text-2xl font-bold text-orange-600">2.3s</p>
            <p className="text-sm text-slate-600">Per execution</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}