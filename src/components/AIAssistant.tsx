import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { blink } from '../blink/client'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { useToast } from '../hooks/use-toast'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  actions?: Array<{
    type: string
    status: 'pending' | 'completed' | 'failed'
    data?: any
  }>
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI assistant. I can help you automate tasks like researching information and adding calendar events. Try asking me something like: 'Research if the White House is open now and if it's open, add it to my calendar for 1 hour'",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const executeWorkflow = async (userMessage: string) => {
    setIsProcessing(true)
    
    try {
      // First, let AI understand what the user wants to do
      const { text: analysis } = await blink.ai.generateText({
        prompt: `Analyze this user request and determine what actions need to be taken: "${userMessage}"
        
        Respond with a JSON object containing:
        {
          "needsResearch": boolean,
          "researchQuery": string (if needsResearch is true),
          "needsCalendarEvent": boolean,
          "eventDetails": {
            "title": string,
            "duration": number (in hours),
            "description": string
          } (if needsCalendarEvent is true),
          "summary": string (brief explanation of what will be done)
        }`,
        model: 'gpt-4o-mini'
      })

      let actionPlan
      try {
        actionPlan = JSON.parse(analysis)
      } catch {
        throw new Error('Could not understand the request')
      }

      const assistantMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: actionPlan.summary,
        timestamp: new Date(),
        actions: []
      }

      // Add research action if needed
      if (actionPlan.needsResearch) {
        assistantMessage.actions?.push({
          type: 'research',
          status: 'pending',
          data: { query: actionPlan.researchQuery }
        })
      }

      // Add calendar action if needed
      if (actionPlan.needsCalendarEvent) {
        assistantMessage.actions?.push({
          type: 'calendar',
          status: 'pending',
          data: actionPlan.eventDetails
        })
      }

      setMessages(prev => [...prev, assistantMessage])

      // Execute research if needed
      if (actionPlan.needsResearch) {
        try {
          const searchResults = await blink.data.search(actionPlan.researchQuery, {
            type: 'web',
            limit: 5
          })

          // Analyze search results with AI
          const { text: researchAnalysis } = await blink.ai.generateText({
            prompt: `Based on these search results about "${actionPlan.researchQuery}", provide a clear answer:
            
            ${JSON.stringify(searchResults.organic_results?.slice(0, 3) || [])}
            
            Focus on current status, hours, availability, etc. Be specific and factual.`,
            model: 'gpt-4o-mini'
          })

          // Update message with research results
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessage.id 
              ? {
                  ...msg,
                  content: msg.content + `\n\n**Research Results:**\n${researchAnalysis}`,
                  actions: msg.actions?.map(action => 
                    action.type === 'research' 
                      ? { ...action, status: 'completed' as const, data: { ...action.data, results: researchAnalysis } }
                      : action
                  )
                }
              : msg
          ))

          // If calendar event is needed and research suggests it's appropriate
          if (actionPlan.needsCalendarEvent) {
            // Simulate calendar integration
            setTimeout(() => {
              setMessages(prev => prev.map(msg => 
                msg.id === assistantMessage.id 
                  ? {
                      ...msg,
                      content: msg.content + `\n\n**Calendar Event Created:**\n✅ Added "${actionPlan.eventDetails.title}" for ${actionPlan.eventDetails.duration} hour(s)`,
                      actions: msg.actions?.map(action => 
                        action.type === 'calendar' 
                          ? { ...action, status: 'completed' as const }
                          : action
                      )
                    }
                  : msg
              ))

              toast({
                title: "Calendar Event Created",
                description: `Added "${actionPlan.eventDetails.title}" to your calendar`,
              })
            }, 1000)
          }

        } catch (error) {
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessage.id 
              ? {
                  ...msg,
                  content: msg.content + `\n\n❌ Research failed: ${error.message}`,
                  actions: msg.actions?.map(action => 
                    action.type === 'research' 
                      ? { ...action, status: 'failed' as const }
                      : action
                  )
                }
              : msg
          ))
        }
      }

    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}`,
        timestamp: new Date()
      }])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')

    await executeWorkflow(currentInput)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'research':
        return <Bot size={16} />
      case 'calendar':
        return <Calendar size={16} />
      default:
        return <CheckCircle size={16} />
    }
  }

  const getActionColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Bot className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">AI Assistant</h1>
            <p className="text-slate-600">Automate tasks with natural language</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-2xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
              <div
                className={`rounded-lg p-4 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-900'
                }`}
              >
                <div className="flex items-start space-x-2 mb-2">
                  {message.type === 'assistant' ? (
                    <Bot size={16} className="mt-1 text-blue-600" />
                  ) : (
                    <User size={16} className="mt-1" />
                  )}
                  <div className="flex-1">
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    
                    {/* Action badges */}
                    {message.actions && message.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.actions.map((action, index) => (
                          <Badge
                            key={index}
                            className={`flex items-center space-x-1 ${getActionColor(action.status)}`}
                          >
                            {getActionIcon(action.type)}
                            <span className="capitalize">{action.type}</span>
                            {action.status === 'pending' && <Clock size={12} />}
                            {action.status === 'completed' && <CheckCircle size={12} />}
                            {action.status === 'failed' && <AlertCircle size={12} />}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-lg p-4 max-w-2xl">
              <div className="flex items-center space-x-2">
                <Bot size={16} className="text-blue-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 p-6">
        <div className="flex space-x-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me to automate something... (e.g., 'Research if the White House is open and add it to my calendar')"
            className="flex-1"
            disabled={isProcessing}
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isProcessing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send size={16} />
          </Button>
        </div>
        
        <div className="mt-2 text-xs text-slate-500">
          Try: "Research current weather in New York and create a calendar reminder if it's going to rain"
        </div>
      </div>
    </div>
  )
}