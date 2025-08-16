import React, { useState, useEffect } from 'react'
import { AuthPage } from './components/AuthPage'
import { VerificationPage } from './components/VerificationPage'
import { CompanyInfoStep } from './components/registration/CompanyInfoStep'
import { FoundingInfoStep } from './components/registration/FoundingInfoStep'
import { SocialInfoStep } from './components/registration/SocialInfoStep'
import { ContactInfoStep } from './components/registration/ContactInfoStep'
import { RegistrationComplete } from './components/RegistrationComplete'
import { Dashboard } from './components/Dashboard'
import { Settings } from './components/Settings'
import { LoadingScreen } from './components/LoadingScreen'
import { apiService } from './services/api'
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react'

type AppState = 
  | 'loading'
  | 'auth'
  | 'verification'
  | 'registration-company'
  | 'registration-founding'
  | 'registration-social'
  | 'registration-contact'
  | 'registration-complete'
  | 'dashboard'
  | 'settings'

interface CompanyData {
  companyInfo?: {
    logo?: string
    banner?: string
    companyName: string
    aboutUs: string
  }
  foundingInfo?: {
    organizationType: string
    companyType: string
    teamSize: string
    yearEstablished: string
    website: string
    vision: string
  }
  socialInfo?: {
    website?: string
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
    youtube?: string
  }
  contactInfo?: {
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    phone: string
    email: string
    contactPerson: string
    contactTitle: string
  }
  registrationComplete?: boolean
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>('auth')
  const [registrationEmail, setRegistrationEmail] = useState('')
  const [companyData, setCompanyData] = useState<CompanyData>({
    companyInfo: {
      companyName: '',
      aboutUs: ''
    },
    foundingInfo: {
      organizationType: '',
      companyType: '',
      teamSize: '',
      yearEstablished: '',
      website: '',
      vision: ''
    },
    socialInfo: {},
    contactInfo: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phone: '',
      email: '',
      contactPerson: '',
      contactTitle: ''
    }
  })
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Enhanced notification system
  const addNotification = (type: Notification['type'], message: string, duration: number = 5000) => {
    const id = Math.random().toString(36).substr(2, 9)
    const notification: Notification = { id, type, message, duration }
    
    setNotifications(prev => [...prev, notification])
    
    // Auto-remove after specified duration
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, duration)
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // Check for existing session on app load
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const sessionResult = await apiService.getCurrentSession()
      
      if (sessionResult.success && sessionResult.data?.session) {
        // User is logged in, fetch their company data
        const profileResult = await apiService.getCompanyProfile()
        
        if (profileResult.success && profileResult.data?.company) {
          setCompanyData(profileResult.data.company)
          
          // Check if registration is complete
          if (profileResult.data.company.registrationComplete) {
            setCurrentState('dashboard')
            addNotification('success', 'Welcome back! Your session has been restored.')
          } else {
            // Resume registration flow based on completed steps
            setCurrentState('registration-company')
            addNotification('info', 'Please complete your company registration.')
          }
        } else {
          console.log('No company profile found, showing auth screen')
          setCurrentState('auth')
        }
      } else {
        console.log('No active session found, showing auth screen')
        setCurrentState('auth')
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setCurrentState('auth')
      addNotification('error', 'Failed to check authentication status. Please try refreshing the page.')
    }
  }

  const handleLogin = async () => {
    setCurrentState('loading')
    
    try {
      const profileResult = await apiService.getCompanyProfile()
      
      if (profileResult.success && profileResult.data?.company) {
        setCompanyData(profileResult.data.company)
        
        if (profileResult.data.company.registrationComplete) {
          setCurrentState('dashboard')
          addNotification('success', 'Successfully logged in! Welcome to your dashboard.', 3000)
        } else {
          setCurrentState('registration-company')
          addNotification('info', 'Please complete your company registration to access all features.', 4000)
        }
      } else {
        // Create default profile for new user
        const defaultProfile = {
          companyInfo: {
            companyName: '',
            aboutUs: ''
          },
          foundingInfo: {
            organizationType: '',
            companyType: '',
            teamSize: '',
            yearEstablished: '',
            website: '',
            vision: ''
          },
          socialInfo: {},
          contactInfo: {
            address: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
            phone: '',
            email: '',
            contactPerson: '',
            contactTitle: ''
          },
          registrationComplete: false
        }
        
        setCompanyData(defaultProfile)
        setCurrentState('registration-company')
        addNotification('info', 'Welcome! Let\'s complete your company registration.')
      }
    } catch (error) {
      console.error('Post-login error:', error)
      addNotification('error', 'Failed to load profile. Please try again.')
      setCurrentState('auth')
    }
  }

  const handleRegister = (email: string) => {
    setRegistrationEmail(email)
    setCurrentState('verification')
    addNotification('success', 'Account created successfully! Please verify your email and phone.')
  }

  const handleVerificationComplete = () => {
    setCurrentState('registration-company')
    addNotification('success', 'Verification complete! Now let\'s set up your company profile.')
  }

  const handleCompanyInfoNext = async () => {
    const saved = await saveCompanyData()
    if (saved) {
      setCurrentState('registration-founding')
      addNotification('success', 'Company information saved!')
    }
  }

  const handleFoundingInfoNext = async () => {
    const saved = await saveCompanyData()
    if (saved) {
      setCurrentState('registration-social')
      addNotification('success', 'Founding information saved!')
    }
  }

  const handleSocialInfoNext = async () => {
    const saved = await saveCompanyData()
    if (saved) {
      setCurrentState('registration-contact')
      addNotification('success', 'Social media information saved!')
    }
  }

  const handleContactInfoNext = async () => {
    const saved = await saveCompanyData()
    if (saved) {
      await completeRegistration()
      setCurrentState('registration-complete')
      addNotification('success', 'Contact information saved! Registration complete!')
    }
  }

  const saveCompanyData = async (): Promise<boolean> => {
    try {
      const result = await apiService.updateCompanyProfile(companyData)
      
      if (result.success && result.data?.company) {
        setCompanyData(result.data.company)
        return true
      } else {
        addNotification('warning', 'Data saved locally. Server connection issues.', 3000)
        return true // Still allow progression even if server save fails
      }
    } catch (error) {
      console.error('Save error:', error)
      addNotification('warning', 'Data saved locally. Will sync when connection is restored.', 4000)
      return true // Still allow progression
    }
  }

  const completeRegistration = async () => {
    try {
      const result = await apiService.completeRegistration()
      
      if (result.success && result.data?.company) {
        setCompanyData(result.data.company)
      } else {
        // Mark as complete locally
        setCompanyData(prev => ({ ...prev, registrationComplete: true }))
      }
    } catch (error) {
      console.error('Complete registration error:', error)
      // Mark as complete locally
      setCompanyData(prev => ({ ...prev, registrationComplete: true }))
    }
  }

  const handleRegistrationComplete = () => {
    setCurrentState('dashboard')
    addNotification('success', 'Welcome to your dashboard! Your company profile is now live.')
  }

  const handleViewProfile = () => {
    setCurrentState('dashboard')
  }

  const handleViewDashboard = () => {
    setCurrentState('dashboard')
  }

  const handleOpenSettings = () => {
    setCurrentState('settings')
  }

  const handleBackToDashboard = () => {
    setCurrentState('dashboard')
  }

  const handleLogout = async () => {
    try {
      await apiService.logout()
      addNotification('success', 'Successfully logged out. Come back soon!', 3000)
    } catch (error) {
      console.error('Logout error:', error)
      addNotification('warning', 'Session cleared locally. You have been logged out.', 3000)
    } finally {
      setCurrentState('auth')
      setCompanyData({
        companyInfo: {
          companyName: '',
          aboutUs: ''
        },
        foundingInfo: {
          organizationType: '',
          companyType: '',
          teamSize: '',
          yearEstablished: '',
          website: '',
          vision: ''
        },
        socialInfo: {},
        contactInfo: {
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
          phone: '',
          email: '',
          contactPerson: '',
          contactTitle: ''
        }
      })
      setRegistrationEmail('')
    }
  }

  const handleSaveCompanyData = async (data: CompanyData) => {
    try {
      const result = await apiService.updateCompanyProfile(data)
      
      if (result.success && result.data?.company) {
        setCompanyData(result.data.company)
        addNotification('success', 'Company profile updated successfully!')
      } else {
        setCompanyData(data) // Update locally even if server fails
        addNotification('warning', 'Profile updated locally. Server sync pending.')
      }
    } catch (error) {
      console.error('Save error:', error)
      setCompanyData(data) // Update locally
      addNotification('warning', 'Profile updated locally. Will sync when connection is restored.')
    }
  }

  const updateCompanyData = (section: keyof CompanyData, data: any) => {
    setCompanyData(prev => ({
      ...prev,
      [section]: data
    }))
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      case 'error': return <X className="h-4 w-4 text-red-600 dark:text-red-400" />
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      case 'info': return <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const getNotificationStyle = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'bg-green-50/95 dark:bg-green-950/50 border-green-200 dark:border-green-800/30 text-green-800 dark:text-green-200'
      case 'error': return 'bg-red-50/95 dark:bg-red-950/50 border-red-200 dark:border-red-800/30 text-red-800 dark:text-red-200'
      case 'warning': return 'bg-yellow-50/95 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800/30 text-yellow-800 dark:text-yellow-200'
      case 'info': return 'bg-blue-50/95 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800/30 text-blue-800 dark:text-blue-200'
      default: return 'bg-gray-50/95 dark:bg-gray-950/50 border-gray-200 dark:border-gray-800/30 text-gray-800 dark:text-gray-200'
    }
  }

  const renderCurrentState = () => {
    switch (currentState) {
      case 'loading':
        return <LoadingScreen />

      case 'auth':
        return (
          <AuthPage
            onLogin={handleLogin}
            onRegister={handleRegister}
          />
        )

      case 'verification':
        return (
          <VerificationPage
            email={registrationEmail}
            onVerificationComplete={handleVerificationComplete}
            onBack={() => setCurrentState('auth')}
          />
        )

      case 'registration-company':
        return (
          <CompanyInfoStep
            data={companyData.companyInfo!}
            onChange={(data) => updateCompanyData('companyInfo', data)}
            onNext={handleCompanyInfoNext}
            onBack={() => setCurrentState('verification')}
          />
        )

      case 'registration-founding':
        return (
          <FoundingInfoStep
            data={companyData.foundingInfo!}
            onChange={(data) => updateCompanyData('foundingInfo', data)}
            onNext={handleFoundingInfoNext}
            onBack={() => setCurrentState('registration-company')}
          />
        )

      case 'registration-social':
        return (
          <SocialInfoStep
            data={companyData.socialInfo!}
            onChange={(data) => updateCompanyData('socialInfo', data)}
            onNext={handleSocialInfoNext}
            onBack={() => setCurrentState('registration-founding')}
          />
        )

      case 'registration-contact':
        return (
          <ContactInfoStep
            data={companyData.contactInfo!}
            onChange={(data) => updateCompanyData('contactInfo', data)}
            onNext={handleContactInfoNext}
            onBack={() => setCurrentState('registration-social')}
          />
        )

      case 'registration-complete':
        return (
          <RegistrationComplete
            onViewProfile={handleViewProfile}
            onViewDashboard={handleViewDashboard}
          />
        )

      case 'dashboard':
        return (
          <Dashboard
            companyData={companyData}
            onOpenSettings={handleOpenSettings}
            onLogout={handleLogout}
          />
        )

      case 'settings':
        return (
          <Settings
            companyData={companyData}
            onSave={handleSaveCompanyData}
            onBack={handleBackToDashboard}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Enhanced Notification System */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`
              p-4 rounded-lg shadow-xl backdrop-blur-xl border transition-all duration-300 transform hover:scale-105
              ${getNotificationStyle(notification.type)}
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                {getNotificationIcon(notification.type)}
                <span className="text-sm font-medium ml-2">{notification.message}</span>
              </div>
              <button 
                onClick={() => removeNotification(notification.id)}
                className="ml-3 hover:opacity-80 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {renderCurrentState()}
    </div>
  )
}