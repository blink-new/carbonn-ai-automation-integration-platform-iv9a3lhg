import { useState, useEffect } from 'react'
import { Plus, Play, Pause, Trash2, Edit, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { blink } from '../blink/client'

export function Workflows() {
  const [workflows, setWorkflows] = useState([])
  const [loading, setLoading] = useState(true)

  const loadWorkflows = async () => {
    try {
      const user = await blink.auth.me()
      const data = await blink.db.workflows.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      })
      setWorkflows(data)
    } catch (error) {
      console.error('Failed to load workflows:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWorkflows()
  }, [])

  const createSampleWorkflow = async () => {
    try {
      const user = await blink.auth.me()
      const workflow = await blink.db.workflows.create({
        id: `workflow_${Date.now()}`,
        userId: user.id,
        name: 'Weather Calendar Sync',
        description: 'Check weather daily and add calendar reminders for rainy days',
        triggerType: 'schedule',
        triggerConfig: JSON.stringify({ schedule: 'daily', time: '08:00' }),
        actions: JSON.stringify([
          { type: 'weather_check', location: 'current' },
          { type: 'calendar_event', condition: 'if_rain' }
        ]),
        status: 'active'
      })
      setWorkflows(prev => [workflow, ...prev])
    } catch (error) {
      console.error('Failed to create workflow:', error)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Workflows</h1>
          <p className="text-slate-600 mt-2">Automate your tasks with AI-powered workflows</p>
        </div>
        <Button onClick={createSampleWorkflow} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Workflows Grid */}
      {workflows.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Zap className="mx-auto h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No workflows yet</h3>
            <p className="text-slate-600 mb-6">Create your first automation workflow to get started</p>
            <Button onClick={createSampleWorkflow} className="bg-blue-600 hover:bg-blue-700">
              <Plus size={16} className="mr-2" />
              Create Your First Workflow
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((workflow: any) => (
            <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    <p className="text-sm text-slate-600 mt-1">{workflow.description}</p>
                  </div>
                  <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                    {workflow.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Trigger</p>
                    <p className="text-sm text-slate-600 capitalize">{workflow.triggerType}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-slate-700">Actions</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {JSON.parse(workflow.actions || '[]').map((action: any, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {action.type.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        {workflow.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit size={14} />
                      </Button>
                    </div>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Workflow Templates */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Workflow Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="border-dashed border-2 hover:border-blue-300 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-2">Daily News Digest</h3>
              <p className="text-sm text-slate-600">AI curates and emails daily news summary</p>
            </CardContent>
          </Card>
          
          <Card className="border-dashed border-2 hover:border-green-300 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-2">Smart Calendar Sync</h3>
              <p className="text-sm text-slate-600">Sync events across multiple calendar apps</p>
            </CardContent>
          </Card>
          
          <Card className="border-dashed border-2 hover:border-purple-300 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-2">Social Media Monitor</h3>
              <p className="text-sm text-slate-600">Track mentions and auto-respond</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}