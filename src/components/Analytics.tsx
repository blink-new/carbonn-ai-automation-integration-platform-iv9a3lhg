import { useState, useEffect } from 'react'
import { TrendingUp, Activity, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'

export function Analytics() {
  const [timeRange, setTimeRange] = useState('7d')
  
  // Mock analytics data
  const analyticsData = {
    totalExecutions: 247,
    successRate: 94.3,
    avgExecutionTime: 2.4,
    errorRate: 5.7,
    topWorkflows: [
      { name: 'Weather Calendar Sync', executions: 45, successRate: 98 },
      { name: 'Daily News Digest', executions: 38, successRate: 92 },
      { name: 'Social Media Monitor', executions: 32, successRate: 89 }
    ],
    recentErrors: [
      { workflow: 'Weather Calendar Sync', error: 'API rate limit exceeded', time: '2 hours ago' },
      { workflow: 'Email Automation', error: 'Invalid email address', time: '5 hours ago' }
    ],
    executionTrend: [
      { day: 'Mon', executions: 32, success: 30 },
      { day: 'Tue', executions: 45, success: 43 },
      { day: 'Wed', executions: 38, success: 36 },
      { day: 'Thu', executions: 52, success: 49 },
      { day: 'Fri', executions: 41, success: 39 },
      { day: 'Sat', executions: 28, success: 26 },
      { day: 'Sun', executions: 35, success: 33 }
    ]
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-600 mt-2">Monitor workflow performance and insights</p>
        </div>
        <div className="flex space-x-2">
          {['24h', '7d', '30d', '90d'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalExecutions}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analyticsData.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Execution Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.avgExecutionTime}s</div>
            <p className="text-xs text-muted-foreground">
              -0.3s from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{analyticsData.errorRate}%</div>
            <p className="text-xs text-muted-foreground">
              -1.2% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Execution Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Execution Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.executionTrend.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 text-sm font-medium text-slate-600">{day.day}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(day.executions / 60) * 100}%` }}
                          />
                        </div>
                        <div className="w-32 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${(day.success / day.executions) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600">
                    {day.success}/{day.executions}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-sm text-slate-600">Total Executions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="text-sm text-slate-600">Successful</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Workflows */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topWorkflows.map((workflow, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{workflow.name}</p>
                      <p className="text-xs text-slate-500">{workflow.executions} executions</p>
                    </div>
                  </div>
                  <Badge variant={workflow.successRate > 95 ? 'default' : 'secondary'}>
                    {workflow.successRate}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Errors */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Errors</CardTitle>
        </CardHeader>
        <CardContent>
          {analyticsData.recentErrors.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <CheckCircle className="mx-auto h-12 w-12 text-green-300 mb-4" />
              <p>No recent errors</p>
              <p className="text-sm">All workflows are running smoothly</p>
            </div>
          ) : (
            <div className="space-y-4">
              {analyticsData.recentErrors.map((error, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-red-900">{error.workflow}</p>
                    <p className="text-sm text-red-700">{error.error}</p>
                    <p className="text-xs text-red-600 mt-1">{error.time}</p>
                  </div>
                  <button className="text-xs bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 transition-colors">
                    Retry
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-green-900">Optimization Tip</h3>
              </div>
              <p className="text-sm text-green-700">
                Your Weather Calendar Sync workflow has a 98% success rate. Consider using it as a template for other workflows.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-blue-900">Speed Improvement</h3>
              </div>
              <p className="text-sm text-blue-700">
                Average execution time decreased by 0.3s this week. API optimizations are working well.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="h-5 w-5 text-purple-600" />
                <h3 className="font-medium text-purple-900">Usage Pattern</h3>
              </div>
              <p className="text-sm text-purple-700">
                Peak usage occurs on weekdays between 8-10 AM. Consider scheduling maintenance outside these hours.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}