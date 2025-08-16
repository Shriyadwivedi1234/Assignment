import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Mail, Phone, ArrowLeft, Loader2, Shield, CheckCircle } from 'lucide-react'
import { apiService } from '../services/api'

interface VerificationPageProps {
  email: string
  onVerificationComplete: () => void
  onBack: () => void
}

export function VerificationPage({ email, onVerificationComplete, onBack }: VerificationPageProps) {
  const [emailOtp, setEmailOtp] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneOtp, setPhoneOtp] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [emailOtpSent, setEmailOtpSent] = useState(false)
  const [phoneOtpSent, setPhoneOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  React.useEffect(() => {
    handleSendEmailOtp()
  }, [])

  const handleSendEmailOtp = async () => {
    setIsLoading(true)
    setError('')

    try {
      const result = await apiService.sendEmailOtp(email)
      
      if (result.success) {
        setEmailOtpSent(true)
      } else {
        setError(result.error || 'Failed to send email OTP')
      }
    } catch (error) {
      console.error('Send email OTP error:', error)
      setError('Failed to send email OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const sanitized = (emailOtp || '').toString().trim().replace(/\D/g, '')
      if (sanitized === '123456') {
        setEmailVerified(true)
        setIsLoading(false)
        return
      }
      const result = await apiService.verifyEmailOtp(email, emailOtp)
      
      if (result.success) {
        setEmailVerified(true)
      } else {
        setError(result.error || 'Invalid OTP')
      }
    } catch (error) {
      console.error('Email verification error:', error)
      setError('Email verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendPhoneOtp = async () => {
    if (phoneNumber.length < 10) {
      setError('Please enter a valid phone number')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await apiService.sendPhoneOtp(phoneNumber)
      
      if (result.success) {
        setPhoneOtpSent(true)
      } else {
        setError(result.error || 'Failed to send phone OTP')
      }
    } catch (error) {
      console.error('Send phone OTP error:', error)
      setError('Failed to send phone OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const sanitized = (phoneOtp || '').toString().trim().replace(/\D/g, '')
      if (sanitized === '123456') {
        setPhoneVerified(true)
        setIsLoading(false)
        return
      }
      const result = await apiService.verifyPhoneOtp(phoneNumber, phoneOtp)
      
      if (result.success) {
        setPhoneVerified(true)
      } else {
        setError(result.error || 'Invalid OTP')
      }
    } catch (error) {
      console.error('Phone verification error:', error)
      setError('Phone verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinue = () => {
    if (emailVerified && phoneVerified) {
      onVerificationComplete()
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-blue-950/20 to-purple-950/20" />
      
      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-6 hover:bg-gray-800/50 backdrop-blur-sm text-foreground"
            disabled={isLoading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {/* Enhanced Card */}
          <Card className="backdrop-blur-xl bg-card/80 border-border shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 rounded-full blur-lg opacity-30" />
                  <div className="relative bg-gradient-to-r from-green-600 to-blue-600 p-3 rounded-full">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Secure Verification</CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Please verify your email and phone number to secure your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-6 p-4 bg-red-950/30 border border-red-800/30 text-red-400 text-sm rounded-lg backdrop-blur-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                    {error}
                  </div>
                </div>
              )}

              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted/50 backdrop-blur-sm">
                  <TabsTrigger value="email" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Mail className="h-4 w-4" />
                    Email
                    {emailVerified && <CheckCircle className="h-3 w-3 text-green-500" />}
                  </TabsTrigger>
                  <TabsTrigger value="phone" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Phone className="h-4 w-4" />
                    Phone
                    {phoneVerified && <CheckCircle className="h-3 w-3 text-green-500" />}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="email" className="space-y-6 mt-6">
                  <div className="p-4 bg-blue-950/30 rounded-lg border border-blue-800/30">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 text-blue-400 mr-2" />
                      <span className="text-blue-300">
                        Verification code sent to <strong className="font-medium">{email}</strong>
                      </span>
                    </div>
                  </div>
                  
                  {!emailVerified ? (
                    <form onSubmit={handleEmailVerification} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="email-otp" className="text-sm font-medium text-foreground">
                          Email Verification Code
                        </Label>
                        <Input
                          id="email-otp"
                          placeholder="Enter 6-digit code"
                          value={emailOtp}
                          onChange={(e) => setEmailOtp(e.target.value)}
                          maxLength={6}
                          required
                          disabled={isLoading}
                          className="text-center text-lg tracking-widest bg-muted/50 backdrop-blur-sm border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground"
                        />
                        <div className="text-xs text-center p-3 bg-yellow-950/30 rounded-lg border border-yellow-800/30">
                          <span className="text-yellow-300">
                            💡 Demo: Use <strong>123456</strong> as verification code
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          type="submit" 
                          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            'Verify Email'
                          )}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleSendEmailOtp}
                          disabled={isLoading}
                          className="backdrop-blur-sm border-border text-foreground hover:bg-muted"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4" />
                          ) : (
                            'Resend Code'
                          )}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center py-8">
                      <div className="relative mb-4">
                        <div className="absolute inset-0 bg-green-500 rounded-full blur-lg opacity-20" />
                        <div className="relative bg-green-500 p-3 rounded-full w-fit mx-auto">
                          <CheckCircle className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-green-400 mb-2">
                        Email Verified Successfully! 🎉
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Your email address has been confirmed
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="phone" className="space-y-6 mt-6">
                  {!phoneOtpSent ? (
                    <div className="space-y-6">
                      <div className="p-4 bg-purple-950/30 rounded-lg border border-purple-800/30">
                        <div className="flex items-center text-sm text-purple-300">
                          <Phone className="h-4 w-4 mr-2" />
                          Secure your account with phone verification
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                          disabled={isLoading}
                          className="bg-muted/50 backdrop-blur-sm border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground"
                        />
                      </div>
                      
                      <Button 
                        onClick={handleSendPhoneOtp} 
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          'Send SMS Code'
                        )}
                      </Button>
                    </div>
                  ) : !phoneVerified ? (
                    <form onSubmit={handlePhoneVerification} className="space-y-6">
                      <div className="p-4 bg-purple-950/30 rounded-lg border border-purple-800/30">
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 text-purple-400 mr-2" />
                          <span className="text-purple-300">
                            SMS sent to <strong className="font-medium">{phoneNumber}</strong>
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone-otp" className="text-sm font-medium text-foreground">
                          SMS Verification Code
                        </Label>
                        <Input
                          id="phone-otp"
                          placeholder="Enter 6-digit code"
                          value={phoneOtp}
                          onChange={(e) => setPhoneOtp(e.target.value)}
                          maxLength={6}
                          required
                          disabled={isLoading}
                          className="text-center text-lg tracking-widest bg-muted/50 backdrop-blur-sm border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground"
                        />
                        <div className="text-xs text-center p-3 bg-yellow-950/30 rounded-lg border border-yellow-800/30">
                          <span className="text-yellow-300">
                            💡 Demo: Use <strong>123456</strong> as verification code
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          type="submit" 
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            'Verify Phone'
                          )}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleSendPhoneOtp}
                          disabled={isLoading}
                          className="backdrop-blur-sm border-border text-foreground hover:bg-muted"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4" />
                          ) : (
                            'Resend Code'
                          )}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center py-8">
                      <div className="relative mb-4">
                        <div className="absolute inset-0 bg-green-500 rounded-full blur-lg opacity-20" />
                        <div className="relative bg-green-500 p-3 rounded-full w-fit mx-auto">
                          <CheckCircle className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-green-400 mb-2">
                        Phone Verified Successfully! 🎉
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Your phone number has been confirmed
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {emailVerified && phoneVerified && (
                <div className="mt-8 space-y-4">
                  <div className="p-4 bg-gradient-to-r from-green-950/30 to-blue-950/30 rounded-lg border border-green-800/30">
                    <div className="flex items-center justify-center text-sm text-green-300">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Both email and phone verified successfully!
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleContinue} 
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-6 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Continue to Profile Setup →
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}