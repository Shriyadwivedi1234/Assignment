import React from 'react'
import { Building2, Sparkles } from 'lucide-react'

export function LoadingScreen() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20" />
      
      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="text-center space-y-8">
          {/* Enhanced Logo */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-30 animate-pulse" />
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-full shadow-2xl">
              <Building2 className="h-12 w-12 text-white animate-bounce" />
            </div>
          </div>
          
          {/* Loading Text */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Company Portal
            </h1>
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
              <p className="text-lg text-muted-foreground">Loading your dashboard...</p>
            </div>
          </div>
          
          {/* Enhanced Loading Animation */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
              <div className="w-3 h-3 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
            
            {/* Progress bar */}
            <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse loading-progress" />
            </div>
          </div>
          
          {/* Loading status */}
          <p className="text-sm text-muted-foreground animate-pulse">
            Preparing your professional experience...
          </p>
        </div>
      </div>
      
      <style>
        {`
          .loading-progress {
            animation: loading-progress 2s ease-in-out infinite;
          }
          
          @keyframes loading-progress {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
          }
        `}
      </style>
    </div>
  )
}