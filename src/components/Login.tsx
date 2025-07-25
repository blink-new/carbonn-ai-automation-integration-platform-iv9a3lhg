import React from 'react'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bot, Zap, Globe, Shield, ArrowRight } from 'lucide-react'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function Login() {
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error) {
      console.error('Error logging in with Google:', error)
    }
  }

  const handleMicrosoftLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error) {
      console.error('Error logging in with Microsoft:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-white space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                carbonN
              </h1>
            </div>
            <p className="text-xl text-slate-300 leading-relaxed">
              AI-Powered Automation & Integration Platform
            </p>
            <p className="text-lg text-slate-400 leading-relaxed">
              Connect your apps, automate workflows, and let AI handle the heavy lifting. 
              No complex setup required - just sign in and start automating.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg backdrop-blur-sm">
              <Zap className="w-6 h-6 text-yellow-400" />
              <div>
                <h3 className="font-semibold text-white">Smart Automation</h3>
                <p className="text-sm text-slate-400">AI creates workflows for you</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg backdrop-blur-sm">
              <Globe className="w-6 h-6 text-green-400" />
              <div>
                <h3 className="font-semibold text-white">Deep Research</h3>
                <p className="text-sm text-slate-400">Web analysis & data extraction</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg backdrop-blur-sm">
              <Shield className="w-6 h-6 text-blue-400" />
              <div>
                <h3 className="font-semibold text-white">Secure OAuth</h3>
                <p className="text-sm text-slate-400">Safe app connections</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg backdrop-blur-sm">
              <Bot className="w-6 h-6 text-purple-400" />
              <div>
                <h3 className="font-semibold text-white">AI Assistant</h3>
                <p className="text-sm text-slate-400">Natural language automation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login */}
        <div className="flex justify-center lg:justify-end">
          <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold text-slate-800">
                Welcome to carbonN
              </CardTitle>
              <CardDescription className="text-slate-600">
                Sign in to start automating your workflows with AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleGoogleLogin}
                className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm"
                variant="outline"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <Button
                onClick={handleMicrosoftLogin}
                className="w-full h-12 bg-[#0078d4] hover:bg-[#106ebe] text-white"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
                </svg>
                Continue with Microsoft
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New to automation?</span>
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-slate-600">
                  🚀 No technical knowledge required
                </p>
                <p className="text-sm text-slate-600">
                  🔒 Your data stays secure with OAuth
                </p>
                <p className="text-sm text-slate-600">
                  ⚡ Start automating in under 2 minutes
                </p>
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm text-slate-500 pt-4">
                <span>Ready to automate?</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}