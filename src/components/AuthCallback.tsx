import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Loader2 } from 'lucide-react'

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          navigate('/login')
          return
        }

        if (data.session) {
          navigate('/')
        } else {
          navigate('/login')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        navigate('/login')
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
        <p className="text-white">Completing sign in...</p>
      </div>
    </div>
  )
}