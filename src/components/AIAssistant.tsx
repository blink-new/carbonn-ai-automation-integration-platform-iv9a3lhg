import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Search, 
  Calendar,
  Mail,
  FileText,
  Zap,
  Globe,
  Brain,
  Settings
} from 'lucide-react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { createClient } from '@blinkdotnew/sdk'

const blink = createClient({
  projectId: 'carbonn-ai-automation-integration-platform-iv9a3lhg',
  authRequired: true
})

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: {
    action?: string
    result?: any
    research?: any
  }
}

interface AIAssistantProps {
  user: SupabaseUser
}

export default function AIAssistant({ user }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hi ${user.user_metadata?.full_name || 'there'}! I'm your AI automation assistant. I can help you:\n\n🔍 **Deep Research Mode** - Analyze websites, extract data, and gather insights\n📅 **Smart Scheduling** - Research and add events to your calendar\n📧 **Email Automation** - Send intelligent emails based on research\n📄 **Document Generation** - Create files and push them to your apps\n⚡ **Workflow Creation** - Build automations from natural language\n\nTry asking me something like:\n• "Research the latest AI trends and create a summary document"\n• "Find upcoming tech conferences and add them to my calendar"\n• "Analyze this website and send me a detailed report"`,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [deepResearchMode, setDeepResearchMode] = useState(true)
  const [customApiKey, setCustomApiKey] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Analyze the user's request to determine what action to take
      const analysisPrompt = `Analyze this user request and determine what actions to take: "${input}"\n\nAvailable actions:\n1. RESEARCH - Use web search to gather information\n2. CALENDAR - Add events to calendar\n3. EMAIL - Send emails\n4. DOCUMENT - Create/generate documents\n5. WORKFLOW - Create automation workflows\n6. GENERAL - General conversation\n\nRespond with the primary action and any specific details needed.`

      const { text: analysis } = await blink.ai.generateText({
        prompt: analysisPrompt,
        model: 'gpt-4o-mini'
      })

      let response = ''
      const metadata: any = {}

      // Perform deep research if enabled and research is needed
      if (deepResearchMode && (analysis.toLowerCase().includes('research') || input.toLowerCase().includes('research') || input.toLowerCase().includes('find') || input.toLowerCase().includes('analyze'))) {
        try {
          // Extract search query from user input
          const searchQuery = input.replace(/research|find|analyze|about|on/gi, '').trim()
          
          const searchResults = await blink.data.search(searchQuery, {
            type: 'web',
            limit: 5
          })

          metadata.research = searchResults

          // Generate comprehensive response based on research
          const researchPrompt = `Based on this web search data: ${JSON.stringify(searchResults)}\n\nUser asked: "${input}"\n\nProvide a comprehensive, helpful response that:\n1. Summarizes key findings\n2. Provides actionable insights\n3. Suggests next steps\n4. Offers to create documents or calendar events if relevant\n\nBe conversational and helpful.`

          const { text } = await blink.ai.generateText({
            prompt: researchPrompt,
            search: true,
            model: 'gpt-4o-mini'
          })

          response = text
          metadata.action = 'research'

        } catch (error) {
          console.error('Research error:', error)
          response = "I encountered an issue with the research. Let me provide a general response instead."
        }
      }

      // Handle calendar requests
      if (analysis.toLowerCase().includes('calendar') || input.toLowerCase().includes('calendar') || input.toLowerCase().includes('schedule') || input.toLowerCase().includes('add to calendar')) {
        try {
          // Extract event details using AI
          const eventPrompt = `Extract event details from: "${input}"\n\nReturn JSON with: title, date, time, duration, description`
          
          const { object: eventDetails } = await blink.ai.generateObject({
            prompt: eventPrompt,
            schema: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                date: { type: 'string' },
                time: { type: 'string' },
                duration: { type: 'string' },
                description: { type: 'string' }
              }
            }
          })

          metadata.action = 'calendar'
          metadata.result = eventDetails
          response += `\n\n📅 **Calendar Event Created:**\n• **Title:** ${eventDetails.title}\n• **Date:** ${eventDetails.date}\n• **Time:** ${eventDetails.time}\n• **Duration:** ${eventDetails.duration}\n\n*Note: In a full implementation, this would be added to your connected calendar app.*`

        } catch (error) {
          console.error('Calendar error:', error)
        }
      }

      // Handle document generation
      if (analysis.toLowerCase().includes('document') || input.toLowerCase().includes('create') || input.toLowerCase().includes('generate') || input.toLowerCase().includes('write')) {
        try {
          const docPrompt = `Create a document based on: "${input}"\n\nIf research data is available, use it: ${metadata.research ? JSON.stringify(metadata.research) : 'No research data'}\n\nGenerate appropriate content.`
          
          const { text: documentContent } = await blink.ai.generateText({
            prompt: docPrompt,
            model: 'gpt-4o-mini'
          })

          metadata.action = 'document'
          metadata.result = documentContent
          response += `\n\n📄 **Document Generated:**\n\n${documentContent}\n\n*Note: In a full implementation, this would be saved to your connected document app (Google Docs, OneDrive, etc.)*`

        } catch (error) {
          console.error('Document error:', error)
        }
      }

      // If no specific action was taken, provide a general AI response
      if (!response) {
        const { text } = await blink.ai.generateText({
          prompt: `User said: "${input}"\n\nProvide a helpful response as an AI automation assistant. Be conversational and suggest how I can help with automation, research, or workflow creation.`,
          model: 'gpt-4o-mini'
        })
        response = text
        metadata.action = 'general'
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        metadata
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('AI Assistant error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again or rephrase your question.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickActions = [
    { label: 'Research AI trends', icon: Search, prompt: 'Research the latest AI and automation trends for 2024' },
    { label: 'Schedule meeting', icon: Calendar, prompt: 'Help me schedule a team meeting for next week' },
    { label: 'Generate report', icon: FileText, prompt: 'Create a weekly productivity report based on my recent activities' },
    { label: 'Email summary', icon: Mail, prompt: 'Draft an email summarizing our project progress' }
  ]

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">AI Assistant</h1>
              <p className="text-slate-600">Your intelligent automation companion</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="deep-research" className="text-sm font-medium">Deep Research</Label>
              <Switch
                id="deep-research"
                checked={deepResearchMode}
                onCheckedChange={setDeepResearchMode}
              />
            </div>
            <Badge variant={deepResearchMode ? "default" : "secondary"} className="flex items-center space-x-1">
              <Globe className="w-3 h-3" />
              <span>{deepResearchMode ? 'Research ON' : 'Research OFF'}</span>
            </Badge>
          </div>
        </div>

        {/* Custom API Key Input */}
        {deepResearchMode && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Settings className="w-4 h-4 text-blue-600" />
              <Label className="text-sm font-medium text-blue-800">Custom Research API (Optional)</Label>
            </div>
            <Input
              placeholder="Enter your custom API key for enhanced research capabilities"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              className="bg-white"
            />
            <p className="text-xs text-blue-600 mt-1">
              Leave empty to use built-in research. Add your own API key for unlimited deep research.
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="flex space-x-2 overflow-x-auto">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 whitespace-nowrap"
                onClick={() => setInput(action.prompt)}
              >
                <Icon className="w-4 h-4" />
                <span>{action.label}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex space-x-3 max-w-4xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' 
                  ? 'bg-blue-600' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div className={`rounded-2xl p-4 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-800'
              }`}>
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.metadata?.action && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <Badge variant="secondary" className="text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      Action: {message.metadata.action}
                    </Badge>
                  </div>
                )}
                <div className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex space-x-3 max-w-4xl">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-slate-600 text-sm">
                    {deepResearchMode ? 'Researching and analyzing...' : 'Thinking...'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-slate-200 p-4">
        <div className="flex space-x-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me to research, automate, or create something..."
            className="flex-1 min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="px-6 h-[60px] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <div className="flex items-center space-x-2">
            {deepResearchMode && (
              <Badge variant="outline" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Deep Research Active
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}