import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  Trash2, 
  Copy,
  Search,
  Filter,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  Bot,
  ArrowRight,
  Calendar,
  Mail,
  FileText,
  Globe
} from 'lucide-react'
import { User } from '@supabase/supabase-js'

interface WorkflowsProps {
  user: User
}

interface Workflow {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'error'
  trigger: string
  actions: string[]
  executions: number
  successRate: number
  lastRun: string
  created: string
  category: string
}

export default function Workflows({ user }: WorkflowsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newWorkflowName, setNewWorkflowName] = useState('')
  const [newWorkflowDescription, setNewWorkflowDescription] = useState('')

  const workflows: Workflow[] = [
    {
      id: '1',
      name: 'Email Newsletter Automation',
      description: 'Automatically send weekly newsletters to subscribers',
      status: 'active',
      trigger: 'Schedule: Every Monday 9:00 AM',
      actions: ['Fetch content from CMS', 'Generate newsletter', 'Send via Gmail'],
      executions: 24,
      successRate: 100,
      lastRun: '2 hours ago',
      created: '2 weeks ago',
      category: 'email'
    },
    {
      id: '2',
      name: 'Lead Generation Pipeline',
      description: 'Research prospects and add them to CRM automatically',
      status: 'active',
      trigger: 'New form submission',
      actions: ['Research company info', 'Enrich contact data', 'Add to CRM', 'Send welcome email'],
      executions: 156,
      successRate: 94.2,
      lastRun: '15 minutes ago',
      created: '1 month ago',
      category: 'sales'
    },
    {
      id: '3',
      name: 'Social Media Content Creator',
      description: 'Generate and schedule social media posts based on trending topics',
      status: 'active',
      trigger: 'Daily at 8:00 AM',
      actions: ['Research trending topics', 'Generate post content', 'Create images', 'Schedule posts'],
      executions: 89,
      successRate: 97.8,
      lastRun: '1 hour ago',
      created: '3 weeks ago',
      category: 'social'
    },
    {
      id: '4',
      name: 'Meeting Notes Generator',
      description: 'Automatically create and distribute meeting summaries',
      status: 'paused',
      trigger: 'Calendar event ends',
      actions: ['Transcribe recording', 'Generate summary', 'Extract action items', 'Send to attendees'],
      executions: 45,
      successRate: 88.9,
      lastRun: '2 days ago',
      created: '1 week ago',
      category: 'productivity'
    },
    {
      id: '5',
      name: 'Expense Report Automation',
      description: 'Process receipts and create expense reports automatically',
      status: 'error',
      trigger: 'Email with receipt attachment',
      actions: ['Extract receipt data', 'Categorize expense', 'Add to spreadsheet', 'Submit for approval'],
      executions: 12,
      successRate: 75.0,
      lastRun: '1 day ago',
      created: '5 days ago',
      category: 'finance'
    }
  ]

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || workflow.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    all: workflows.length,
    active: workflows.filter(w => w.status === 'active').length,
    paused: workflows.filter(w => w.status === 'paused').length,
    error: workflows.filter(w => w.status === 'error').length
  }

  const handleCreateWorkflow = () => {
    if (!newWorkflowName.trim()) return
    
    // In a real implementation, this would create the workflow
    console.log('Creating workflow:', { name: newWorkflowName, description: newWorkflowDescription })
    setIsCreateDialogOpen(false)
    setNewWorkflowName('')
    setNewWorkflowDescription('')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-600" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'email':
        return <Mail className="w-4 h-4" />
      case 'sales':
        return <Zap className="w-4 h-4" />
      case 'social':
        return <Globe className="w-4 h-4" />
      case 'productivity':
        return <Calendar className="w-4 h-4" />
      case 'finance':
        return <FileText className="w-4 h-4" />
      default:
        return <Bot className="w-4 h-4" />
    }
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Workflows</h1>
          <p className="text-slate-600 mt-1">
            Create and manage your automation workflows
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
              <Plus className="w-4 h-4 mr-2" />
              New Workflow
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Workflow</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Workflow Name
                </label>
                <Input
                  placeholder="e.g., Email Newsletter Automation"
                  value={newWorkflowName}
                  onChange={(e) => setNewWorkflowName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Description
                </label>
                <Textarea
                  placeholder="Describe what this workflow does..."
                  value={newWorkflowDescription}
                  onChange={(e) => setNewWorkflowDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleCreateWorkflow}
                  disabled={!newWorkflowName.trim()}
                >
                  Create Workflow
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Workflows</p>
                <p className="text-3xl font-bold text-slate-800">{workflows.length}</p>
              </div>
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active</p>
                <p className="text-3xl font-bold text-green-600">{statusCounts.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Executions</p>
                <p className="text-3xl font-bold text-slate-800">
                  {workflows.reduce((sum, w) => sum + w.executions, 0)}
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Avg Success Rate</p>
                <p className="text-3xl font-bold text-slate-800">
                  {Math.round(workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length)}%
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex space-x-2">
          {Object.entries(statusCounts).map(([status, count]) => (
            <Button
              key={status}
              variant={selectedStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(status)}
              className="capitalize"
            >
              {status} ({count})
            </Button>
          ))}
        </div>
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredWorkflows.map((workflow) => (
          <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                    {getCategoryIcon(workflow.category)}
                    <span className="text-white text-sm">
                      {getCategoryIcon(workflow.category)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    <p className="text-slate-600 text-sm mt-1">{workflow.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(workflow.status)}
                  <Badge className={getStatusColor(workflow.status)}>
                    {workflow.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Trigger */}
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">Trigger</span>
                </div>
                <p className="text-sm text-slate-600">{workflow.trigger}</p>
              </div>

              {/* Actions */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <ArrowRight className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-slate-700">Actions</span>
                </div>
                <div className="space-y-1">
                  {workflow.actions.map((action, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-200">
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-800">{workflow.executions}</p>
                  <p className="text-xs text-slate-600">Executions</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">{workflow.successRate}%</p>
                  <p className="text-xs text-slate-600">Success Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-800">{workflow.lastRun}</p>
                  <p className="text-xs text-slate-600">Last Run</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  {workflow.status === 'active' ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </>
                  )}
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkflows.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No workflows found</h3>
          <p className="text-slate-600 mb-4">Try adjusting your search or filter criteria</p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Workflow
          </Button>
        </div>
      )}

      {/* AI Workflow Builder Hint */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-purple-900 mb-2">AI-Powered Workflow Creation</h3>
              <p className="text-purple-800 text-sm mb-3">
                Describe what you want to automate in plain English, and our AI will create the workflow for you. 
                Try the AI Assistant to get started!
              </p>
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Bot className="w-4 h-4 mr-2" />
                Try AI Assistant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}