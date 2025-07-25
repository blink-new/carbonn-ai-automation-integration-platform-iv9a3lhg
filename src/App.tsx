import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Toaster } from '@/components/ui/toaster'
import Login from '@/components/Login'
import Dashboard from '@/components/Dashboard'
import Sidebar from '@/components/Sidebar'
import Workflows from '@/components/Workflows'
import Integrations from '@/components/Integrations'
import AIAssistant from '@/components/AIAssistant'
import Analytics from '@/components/Analytics'
import { User } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading carbonN...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <Login />
        <Toaster />
      </>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} />
      case 'workflows':
        return <Workflows user={user} />
      case 'integrations':
        return <Integrations user={user} />
      case 'ai-assistant':
        return <AIAssistant user={user} />
      case 'analytics':
        return <Analytics user={user} />
      default:
        return <Dashboard user={user} />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        user={user} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onSignOut={() => supabase.auth.signOut()}
      />
      <main className="flex-1 ml-64">
        {renderContent()}
      </main>
      <Toaster />
    </div>
  )
}

export default App