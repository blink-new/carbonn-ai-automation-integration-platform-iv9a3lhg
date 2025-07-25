import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Textarea } from './ui/textarea'
import { ScrollArea } from './ui/scroll-area'
import { Badge } from './ui/badge'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Zap, 
  Calendar, 
  Mail, 
  FileText, 
  Database,
  Workflow,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  status?: 'sending' | 'sent' | 'error'
  actions?: Array<{
    type: string
    description: string
    status: 'pending' | 'completed' | 'failed'
    result?: any
  }>
}

interface Integration {
  id: string
  service_name: string
  service_type: string
  is_active: boolean
}

export const ProfessionalAIAssistant: React.FC = () => {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI automation assistant. I can help you create workflows, research information, and integrate with your connected services. Try asking me to:\n\n• Research information and add events to your calendar\n• Create documents in Google Drive\n• Send emails through Gmail\n• Analyze data and create reports\n• Set up automated workflows\n\nWhat would you like me to help you with today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadIntegrations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true)

      if (error) throw error
      setIntegrations(data || [])
    } catch (error) {
      console.error('Error loading integrations:', error)
    }
  }, [user?.id])

  useEffect(() => {
    if (user) {
      loadIntegrations()
    }
  }, [user, loadIntegrations])

  const callPerplexityAPI = async (prompt: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/perplexity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ prompt })
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error('Perplexity API error:', error)
      return 'I apologize, but I\'m having trouble processing your request right now. Please try again later.'
    }
  }

  const executeAction = async (action: string, parameters: any) => {
    // This would integrate with actual services
    // For now, we'll simulate the actions
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    switch (action) {
      case 'calendar_event':
        return { success: true, event_id: 'cal_' + Date.now() }
      case 'send_email':
        return { success: true, message_id: 'msg_' + Date.now() }
      case 'create_document':
        return { success: true, document_id: 'doc_' + Date.now() }
      case 'research':
        return { success: true, sources: ['source1', 'source2'] }
      default:
        return { success: false, error: 'Unknown action' }
    }
  }

  const parseActionsFromResponse = (response: string) => {
    const actions = []
    
    // Simple pattern matching for common actions
    if (response.toLowerCase().includes('calendar') || response.toLowerCase().includes('appointment')) {
      actions.push({
        type: 'calendar_event',
        description: 'Create calendar event',
        status: 'pending' as const
      })
    }
    
    if (response.toLowerCase().includes('email') || response.toLowerCase().includes('send')) {
      actions.push({
        type: 'send_email',
        description: 'Send email',
        status: 'pending' as const
      })
    }
    
    if (response.toLowerCase().includes('document') || response.toLowerCase().includes('file')) {
      actions.push({
        type: 'create_document',
        description: 'Create document',
        status: 'pending' as const
      })
    }

    return actions
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Get AI response
      const aiResponse = await callPerplexityAPI(input.trim())
      
      // Parse potential actions from the response
      const actions = parseActionsFromResponse(aiResponse)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        actions
      }

      setMessages(prev => [...prev, assistantMessage])

      // Execute actions if any
      if (actions.length > 0) {
        for (let i = 0; i < actions.length; i++) {
          const action = actions[i]
          
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessage.id 
              ? {
                  ...msg,
                  actions: msg.actions?.map((a, idx) => 
                    idx === i ? { ...a, status: 'pending' } : a
                  )
                }
              : msg
          ))

          try {
            const result = await executeAction(action.type, {})
            
            setMessages(prev => prev.map(msg => 
              msg.id === assistantMessage.id 
                ? {
                    ...msg,
                    actions: msg.actions?.map((a, idx) => 
                      idx === i 
                        ? { ...a, status: 'completed', result } 
                        : a
                    )
                  }
                : msg
            ))
          } catch (error) {
            setMessages(prev => prev.map(msg => 
              msg.id === assistantMessage.id 
                ? {
                    ...msg,
                    actions: msg.actions?.map((a, idx) => 
                      idx === i 
                        ? { ...a, status: 'failed', result: { error: error.message } } 
                        : a
                    )
                  }
                : msg
            ))
          }
        }
      }

    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'calendar_event': return <Calendar className="h-4 w-4" />
      case 'send_email': return <Mail className="h-4 w-4" />
      case 'create_document': return <FileText className="h-4 w-4" />
      case 'research': return <Database className="h-4 w-4" />
      default: return <Workflow className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-500" />
            AI Assistant
            <Badge variant="secondary" className="ml-auto">
              {integrations.length} integrations active
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : ''}`}>
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-100 text-slate-900'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    
                    {message.actions && message.actions.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.actions.map((action, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-white border rounded-lg text-sm"
                          >
                            {getActionIcon(action.type)}
                            <span className="flex-1">{action.description}</span>
                            {getStatusIcon(action.status)}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs text-slate-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-500 flex items-center justify-center flex-shrink-0 order-3">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-slate-100 rounded-lg p-3">
                    <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
          
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me to research information, create workflows, or integrate with your apps..."
                className="flex-1 min-h-[60px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                size="lg"
                className="px-6"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
              <Zap className="h-3 w-3" />
              Powered by advanced AI • Press Shift+Enter for new line
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}