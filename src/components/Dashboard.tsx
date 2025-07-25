import { useState, useEffect } from 'react'
import { Activity, Zap, Calendar, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { blink } from '../blink/client'

export function Dashboard() {
  const [stats, setStats] = useState({
    totalWorkflows: 0,
    activeWorkflows: 0,
    totalRuns: 0,
    successRate: 0
  })
  const [recentRuns, setRecentRuns] = useState([])
  const [loading, setLoading] = useState(true)

  const loadDashboardData = async () => {
    try {
      const user = await blink.auth.me()
      
      // Load workflows
      const workflows = await blink.db.workflows.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      })

      // Load recent workflow runs
      const runs = await blink.db.workflowRuns.list({
        where: { userId: user.id },
        orderBy: { startedAt: 'desc' },
        limit: 10
      })

      const activeWorkflows = workflows.filter(w => w.status === 'active').length
      const successfulRuns = runs.filter(r => r.status === 'completed').length
      const successRate = runs.length > 0 ? (successfulRuns / runs.length) * 100 : 0

      setStats({
        totalWorkflows: workflows.length,
        activeWorkflows,
        totalRuns: runs.length,
        successRate: Math.round(successRate)
      })

      setRecentRuns(runs)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">Monitor your automation workflows and integrations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkflows}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeWorkflows} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRuns}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Requests</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              +12% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Workflow Runs</CardTitle>
          </CardHeader>
          <CardContent>
            {recentRuns.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Activity className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <p>No workflow runs yet</p>
                <p className="text-sm">Start by creating your first workflow</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentRuns.slice(0, 5).map((run: any) => (
                  <div key={run.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        run.status === 'completed' ? 'bg-green-500' : 
                        run.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <p className="font-medium text-sm">Workflow Run</p>
                        <p className="text-xs text-slate-500">
                          {new Date(run.startedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={run.status === 'completed' ? 'default' : 'destructive'}>
                      {run.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
                <Zap className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Create New Workflow</p>
                  <p className="text-sm text-blue-700">Build automation with AI</p>
                </div>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Connect Integration</p>
                  <p className="text-sm text-green-700">Add new app connection</p>
                </div>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
                <Clock className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">Schedule Task</p>
                  <p className="text-sm text-purple-700">Set up recurring automation</p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>AI Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">Weather Calendar Sync</h3>
              <p className="text-sm text-blue-700 mb-3">
                Automatically check weather and add reminders for rainy days
              </p>
              <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors">
                Create Workflow
              </button>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-900 mb-2">News Digest</h3>
              <p className="text-sm text-green-700 mb-3">
                Daily AI-curated news summary sent to your email
              </p>
              <button className="text-xs bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700 transition-colors">
                Create Workflow
              </button>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <h3 className="font-medium text-purple-900 mb-2">Smart Reminders</h3>
              <p className="text-sm text-purple-700 mb-3">
                AI analyzes your schedule and suggests optimal meeting times
              </p>
              <button className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full hover:bg-purple-700 transition-colors">
                Create Workflow
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}