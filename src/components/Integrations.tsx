import { useState, useEffect } from 'react'
import { Plus, CheckCircle, AlertCircle, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { blink } from '../blink/client'

const availableIntegrations = [
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Sync events and create calendar appointments',
    icon: '📅',
    category: 'Productivity',
    connected: false
  },
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Send emails and manage inbox',
    icon: '📧',
    category: 'Communication',
    connected: false
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send messages and notifications',
    icon: '💬',
    category: 'Communication',
    connected: false
  },
  {
    id: 'weather-api',
    name: 'Weather API',
    description: 'Get current weather and forecasts',
    icon: '🌤️',
    category: 'Data',
    connected: true
  },
  {
    id: 'news-api',
    name: 'News API',
    description: 'Fetch latest news and articles',
    icon: '📰',
    category: 'Data',
    connected: true
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    description: 'Post tweets and monitor mentions',
    icon: '🐦',
    category: 'Social',
    connected: false
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Create and update pages and databases',
    icon: '📝',
    category: 'Productivity',
    connected: false
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Manage repositories and issues',
    icon: '🐙',
    category: 'Development',
    connected: false
  }
]

export function Integrations() {
  const [integrations, setIntegrations] = useState(availableIntegrations)
  const [connectedIntegrations, setConnectedIntegrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Productivity', 'Communication', 'Data', 'Social', 'Development']

  const loadConnectedIntegrations = async () => {
    try {
      const user = await blink.auth.me()
      const data = await blink.db.integrations.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      })
      setConnectedIntegrations(data)
      
      // Update integration status
      setIntegrations(prev => prev.map(integration => ({
        ...integration,
        connected: data.some((conn: any) => conn.type === integration.id)
      })))
    } catch (error) {
      console.error('Failed to load integrations:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConnectedIntegrations()
  }, [])

  const connectIntegration = async (integration: any) => {
    try {
      const user = await blink.auth.me()
      await blink.db.integrations.create({
        id: `integration_${Date.now()}`,
        userId: user.id,
        name: integration.name,
        type: integration.id,
        config: JSON.stringify({ connected: true }),
        status: 'connected'
      })
      
      setIntegrations(prev => prev.map(int => 
        int.id === integration.id ? { ...int, connected: true } : int
      ))
      
      await loadConnectedIntegrations()
    } catch (error) {
      console.error('Failed to connect integration:', error)
    }
  }

  const filteredIntegrations = selectedCategory === 'All' 
    ? integrations 
    : integrations.filter(int => int.category === selectedCategory)

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-slate-200 rounded-lg"></div>
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
        <h1 className="text-3xl font-bold text-slate-900">Integrations</h1>
        <p className="text-slate-600 mt-2">Connect your favorite apps and services</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Connected</p>
                <p className="text-2xl font-bold text-green-600">
                  {integrations.filter(int => int.connected).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Available</p>
                <p className="text-2xl font-bold text-blue-600">
                  {integrations.filter(int => !int.connected).length}
                </p>
              </div>
              <Plus className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Categories</p>
                <p className="text-2xl font-bold text-purple-600">{categories.length - 1}</p>
              </div>
              <Settings className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => (
          <Card key={integration.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{integration.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {integration.category}
                    </Badge>
                  </div>
                </div>
                {integration.connected ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-slate-400" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">{integration.description}</p>
              
              <div className="flex justify-between items-center">
                <Badge variant={integration.connected ? 'default' : 'secondary'}>
                  {integration.connected ? 'Connected' : 'Available'}
                </Badge>
                
                {integration.connected ? (
                  <Button size="sm" variant="outline">
                    <Settings size={14} className="mr-1" />
                    Configure
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={() => connectIntegration(integration)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus size={14} className="mr-1" />
                    Connect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Popular Workflows */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Popular Integration Workflows</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-blue-200">
                    📅
                  </div>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-blue-200">
                    🌤️
                  </div>
                </div>
                <h3 className="font-medium text-blue-900">Weather + Calendar</h3>
              </div>
              <p className="text-sm text-blue-700 mb-4">
                Automatically add weather alerts to your calendar when rain is forecasted
              </p>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Create Workflow
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-green-200">
                    📰
                  </div>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-green-200">
                    📧
                  </div>
                </div>
                <h3 className="font-medium text-green-900">News + Email</h3>
              </div>
              <p className="text-sm text-green-700 mb-4">
                Daily AI-curated news digest sent to your email every morning
              </p>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Create Workflow
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}