import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { apiService } from '../services/api'

interface AuthPageProps {
  onLogin: () => void
  onRegister: (email: string) => void
}

export function AuthPage({ onLogin, onRegister }: AuthPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ 
    companyName: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await apiService.login(loginData.email, loginData.password)
      
      if (result.success) {
        onLogin()
      } else {
        setError(result.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match!')
      setIsLoading(false)
      return
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    try {
      const result = await apiService.register(
        registerData.companyName, 
        registerData.email, 
        registerData.password
      )
      
      if (result.success) {
        onRegister(registerData.email)
      } else {
        setError(result.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#01030f] relative overflow-hidden">
      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl flex flex-col items-center">
          {/* Header matching Figma design */}
          <div className="text-center mb-12">
            <h1 className="gradient-text text-7xl font-bold mb-4 tracking-tight">
              Company Portal
            </h1>
            <p className="text-[#acdfff] text-2xl mb-8 max-w-2xl">
              Your gateway to professional success
            </p>
          </div>

          {/* Card matching Figma design */}
          <div className="w-full max-w-lg">
            <Card className="glass-card shadow-2xl border border-white/20 rounded-[30px] overflow-hidden">
              <CardHeader className="text-center pb-6 pt-8">
                <CardTitle className="text-3xl font-semibold text-foreground mb-2">
                  Welcome back
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  <span className="font-semibold">Log in to your account</span>
                  <span className="font-light"> or create a new company profile</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                {error && (
                  <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">
                    {error}
                  </div>
                )}

                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-accent/50 rounded-[30px] p-1 mb-6">
                    <TabsTrigger 
                      value="login" 
                      className="rounded-[30px] data-[state=active]:bg-[#fff] data-[state=active]:text-black data-[state=active]:shadow-sm transition-all"
                    >
                      Log in
                    </TabsTrigger>
                    <TabsTrigger 
                      value="register" 
                      className="rounded-[30px] data-[state=active]:bg-[#fff] data-[state=active]:text-black data-[state=active]:shadow-sm transition-all"
                    >
                      Register
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="space-y-6">
                    <form onSubmit={handleLogin} className="space-y-6">
                      <div className="space-y-4">
                        <div className="relative">
                          <Input
                            type="email"
                            placeholder="Enter your Email or username"
                            value={loginData.email}
                            onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                            required
                            disabled={isLoading}
                            className="h-[53px] bg-[rgba(244,244,255,0.10)] border-0 rounded-[30px] px-6 placeholder:text-white/70 text-white"
                          />
                        </div>
                        
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={loginData.password}
                            onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                            required
                            disabled={isLoading}
                            className="h-[53px] bg-[rgba(244,244,255,0.10)] border-0 rounded-[30px] px-6 pr-12 placeholder:text-white/70 text-white"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-4 top-1/2 -translate-y-1/2 h-auto p-0 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-black/50" />
                            ) : (
                              <Eye className="h-4 w-4 text-black/50" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full h-[62px] bg-black hover:bg-black/80 text-white rounded-[30px] font-medium text-lg transition-all disabled:opacity-50 shadow-[0px_0px_20px_4px_inset_rgba(255,255,255,0.25)]" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Signing you in...
                          </>
                        ) : (
                          'Get Started'
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="register" className="space-y-6">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-4">
                        <Input
                          placeholder="Your Company Name"
                          value={registerData.companyName}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, companyName: e.target.value }))}
                          required
                          disabled={isLoading}
                          className="h-[53px] bg-[rgba(244,244,255,0.10)] border-0 rounded-[30px] px-6 placeholder:text-white/70 text-white"
                        />
                        
                        <Input
                          type="email"
                          placeholder="Business Email Address"
                          value={registerData.email}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                          required
                          disabled={isLoading}
                          className="h-[53px] bg-[rgba(244,244,255,0.10)] border-0 rounded-[30px] px-6 placeholder:text-white/70 text-white"
                        />
                        
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a secure password"
                            value={registerData.password}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                            required
                            disabled={isLoading}
                            minLength={6}
                            className="h-[53px] bg-[rgba(244,244,255,0.10)] border-0 rounded-[30px] px-6 pr-12 placeholder:text-white/70 text-white"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-4 top-1/2 -translate-y-1/2 h-auto p-0 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-black/50" />
                            ) : (
                              <Eye className="h-4 w-4 text-black/50" />
                            )}
                          </Button>
                        </div>
                        
                        <Input
                          type="password"
                          placeholder="Confirm your password"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          required
                          disabled={isLoading}
                          className="h-[53px] bg-[rgba(244,244,255,0.10)] border-0 rounded-[30px] px-6 placeholder:text-white/70 text-white"
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full h-[62px] bg-black hover:bg-black/80 text-white rounded-[30px] font-medium text-lg transition-all disabled:opacity-50 shadow-[0px_0px_20px_4px_inset_rgba(255,255,255,0.25)] mt-6" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Creating your account...
                          </>
                        ) : (
                          'Get Started'
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Footer Badge matching Figma */}
          <div className="mt-8">
            <div className="bg-black border border-white/50 rounded-full px-6 py-3">
              <p className="text-white text-base">
                Secure • Professional • Trusted by thousands of companies
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}