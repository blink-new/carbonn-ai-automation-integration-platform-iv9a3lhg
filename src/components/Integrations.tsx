import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { 
  Search, 
  Plus, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Zap,
  Shield,
  Clock,
  Users
} from 'lucide-react'
import { User } from '@supabase/supabase-js'

interface IntegrationsProps {
  user: User
}

interface Integration {
  id: string
  name: string
  description: string
  category: string
  icon: string
  connected: boolean
  status: 'active' | 'inactive' | 'error'
  lastSync?: string
  workflows?: number
  color: string
}

export default function Integrations({ user }: IntegrationsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const integrations: Integration[] = [
    // Google Services
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Send and manage emails automatically',
      category: 'google',
      icon: '📧',
      connected: true,
      status: 'active',
      lastSync: '2 minutes ago',
      workflows: 5,
      color: 'bg-red-500'
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Create and manage calendar events',
      category: 'google',
      icon: '📅',
      connected: true,
      status: 'active',
      lastSync: '5 minutes ago',
      workflows: 3,
      color: 'bg-blue-500'
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      description: 'Store and organize files automatically',
      category: 'google',
      icon: '📁',
      connected: true,
      status: 'active',
      lastSync: '1 hour ago',
      workflows: 2,
      color: 'bg-green-500'
    },
    {
      id: 'google-sheets',
      name: 'Google Sheets',
      description: 'Create and update spreadsheets',
      category: 'google',
      icon: '📊',
      connected: false,
      status: 'inactive',
      color: 'bg-green-600'
    },
    {
      id: 'google-docs',
      name: 'Google Docs',
      description: 'Generate and edit documents',
      category: 'google',
      icon: '📝',
      connected: false,
      status: 'inactive',
      color: 'bg-blue-600'
    },

    // Microsoft Services
    {
      id: 'outlook',
      name: 'Outlook',
      description: 'Microsoft email and calendar integration',
      category: 'microsoft',
      icon: '📮',
      connected: true,
      status: 'active',
      lastSync: '10 minutes ago',
      workflows: 2,
      color: 'bg-blue-700'
    },
    {
      id: 'onedrive',
      name: 'OneDrive',
      description: 'Microsoft cloud storage solution',
      category: 'microsoft',
      icon: '☁️',
      connected: false,
      status: 'inactive',
      color: 'bg-blue-600'
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      description: 'Send messages and manage team communication',
      category: 'microsoft',
      icon: '👥',
      connected: false,
      status: 'inactive',
      color: 'bg-purple-600'
    },
    {
      id: 'sharepoint',
      name: 'SharePoint',
      description: 'Collaborate and share documents',
      category: 'microsoft',
      icon: '🔗',
      connected: false,
      status: 'inactive',
      color: 'bg-blue-800'
    },

    // Other Popular Services
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team communication and notifications',
      category: 'communication',
      icon: '💬',
      connected: true,
      status: 'active',
      lastSync: '3 minutes ago',
      workflows: 4,
      color: 'bg-purple-500'
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Create and manage workspace content',
      category: 'productivity',
      icon: '📋',
      connected: false,
      status: 'inactive',
      color: 'bg-gray-800'
    },
    {
      id: 'trello',
      name: 'Trello',
      description: 'Project management and task tracking',
      category: 'productivity',
      icon: '📌',
      connected: false,
      status: 'inactive',
      color: 'bg-blue-500'
    },
    {
      id: 'airtable',
      name: 'Airtable',
      description: 'Database and spreadsheet hybrid',
      category: 'productivity',
      icon: '🗃️',
      connected: false,
      status: 'inactive',
      color: 'bg-yellow-500'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Integrations', count: integrations.length },
    { id: 'google', name: 'Google', count: integrations.filter(i => i.category === 'google').length },
    { id: 'microsoft', name: 'Microsoft', count: integrations.filter(i => i.category === 'microsoft').length },
    { id: 'communication', name: 'Communication', count: integrations.filter(i => i.category === 'communication').length },
    { id: 'productivity', name: 'Productivity', count: integrations.filter(i => i.category === 'productivity').length }
  ]

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const connectedCount = integrations.filter(i => i.connected).length
  const totalWorkflows = integrations.reduce((sum, i) => sum + (i.workflows || 0), 0)

  const handleConnect = async (integrationId: string) => {
    // In a real implementation, this would trigger OAuth flow
    console.log(`Connecting to ${integrationId}`)
    // Simulate OAuth redirect
    alert(`OAuth connection for ${integrationId} would be initiated here. In the full implementation, this would redirect to the service's OAuth page.`)
  }

  const handleDisconnect = async (integrationId: string) => {
    console.log(`Disconnecting from ${integrationId}`)
    alert(`${integrationId} would be disconnected here.`)
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Integrations</h1>
          <p className="text-slate-600 mt-1">
            Connect your favorite apps and services to automate workflows
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="px-3 py-1">
            {connectedCount} Connected
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            {totalWorkflows} Active Workflows
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Connected Apps</p>
                <p className="text-3xl font-bold text-slate-800">{connectedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Available Apps</p>
                <p className="text-3xl font-bold text-slate-800">{integrations.length}</p>
              </div>
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active Workflows</p>
                <p className="text-3xl font-bold text-slate-800">{totalWorkflows}</p>
              </div>
              <Settings className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Last Sync</p>
                <p className="text-lg font-bold text-slate-800">2 min ago</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => (
          <Card key={integration.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${integration.color} rounded-xl flex items-center justify-center text-2xl`}>
                    {integration.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <Badge 
                      variant={integration.connected ? "default" : "secondary"}
                      className="mt-1"
                    >
                      {integration.connected ? 'Connected' : 'Available'}
                    </Badge>
                  </div>
                </div>
                {integration.status === 'active' && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                {integration.status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 text-sm">{integration.description}</p>
              
              {integration.connected && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Last sync:</span>
                    <span className="font-medium">{integration.lastSync}</span>
                  </div>
                  {integration.workflows && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Active workflows:</span>
                      <span className="font-medium">{integration.workflows}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex space-x-2">
                {integration.connected ? (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleDisconnect(integration.id)}
                    >
                      Disconnect
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                  </>
                ) : (
                  <Button 
                    className="w-full" 
                    size="sm"
                    onClick={() => handleConnect(integration.id)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No integrations found</h3>
          <p className="text-slate-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* OAuth Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-2">Secure OAuth Authentication</h3>
              <p className="text-blue-800 text-sm mb-3">
                All integrations use industry-standard OAuth 2.0 for secure authentication. 
                Your credentials are never stored on our servers - we only receive permission tokens.
              </p>
              <div className="flex items-center space-x-4 text-sm text-blue-700">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>Bank-level security</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>Trusted by 10,000+ users</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ExternalLink className="w-4 h-4" />
                  <span>Revoke access anytime</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}