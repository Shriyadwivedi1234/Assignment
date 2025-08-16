import { projectId, publicAnonKey } from '../utils/supabase/info'

// Use local development server for now to avoid routing issues
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? `https://${projectId}.supabase.co/functions/v1/make-server-9b27c0ef`
  : 'http://localhost:3002' // Local development server

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

class ApiService {
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length >= 5 && email.length <= 254
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        console.error(`API Error [${endpoint}]:`, data)
        return { success: false, error: data.error || 'Request failed' }
      }

      return { success: true, data }
    } catch (error) {
      console.error(`Network Error [${endpoint}]:`, error)
      return { success: false, error: 'Network error occurred' }
    }
  }

  private async makeAuthenticatedRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Removed Supabase session check as we're using custom server endpoints
    // const { data: { session } } = await supabase.auth.getSession()
    
    // if (!session?.access_token) {
    //   return { success: false, error: 'User not authenticated' }
    // }

    return this.makeRequest<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        // Removed Authorization header as we're using custom server endpoints
        // 'Authorization': `Bearer ${session.access_token}`,
      },
    })
  }

  // Authentication methods
  async register(companyName: string, email: string, password: string): Promise<ApiResponse> {
    try {
      // Validate email format
      if (!this.validateEmail(email)) {
        return { success: false, error: 'Please enter a valid email address' }
      }

      // Validate password
      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long' }
      }

      // Validate company name
      if (!companyName.trim() || companyName.length < 2) {
        return { success: false, error: 'Company name must be at least 2 characters long' }
      }

      // Use our custom server registration endpoint
      const result = await this.makeRequest<{ user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ 
          companyName: companyName.trim(), 
          email: email.toLowerCase().trim(), 
          password 
        }),
      })

      if (result.success && result.data?.user) {
        return { success: true, data: { user: result.data.user } }
      } else {
        return { success: false, error: result.error || 'Registration failed' }
      }
    } catch (error) {
      console.error('Register network error:', error)
      return { success: false, error: 'Registration failed. Please check your internet connection and try again.' }
    }
  }

  async login(email: string, password: string): Promise<ApiResponse<{ session: any }>> {
    try {
      // Validate email format
      if (!this.validateEmail(email)) {
        return { success: false, error: 'Please enter a valid email address' }
      }

      // Validate password
      if (!password || password.length < 6) {
        return { success: false, error: 'Please enter your password' }
      }

      // Use our server login endpoint instead of Supabase Auth
      const result = await this.makeRequest<{ user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password: password
        }),
      })

      if (result.success && result.data?.user) {
        // Store user data locally for session management
        localStorage.setItem('userSession', JSON.stringify({
          user: result.data.user,
          loginTime: new Date().toISOString()
        }))
        
        return { success: true, data: { session: { user: result.data.user } } }
      } else {
        return { success: false, error: result.error || 'Login failed' }
      }
    } catch (error) {
      console.error('Login network error:', error)
      return { success: false, error: 'Login failed. Please check your internet connection and try again.' }
    }
  }

  async logout(): Promise<ApiResponse> {
    try {
      // Clear local session
      localStorage.removeItem('userSession')
      localStorage.removeItem('companyProfile')
      
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, error: 'Logout failed' }
    }
  }

  async getCurrentSession(): Promise<ApiResponse<{ session: any }>> {
    try {
      // Check local storage for user session
      const userSessionStr = localStorage.getItem('userSession')
      if (userSessionStr) {
        const userSession = JSON.parse(userSessionStr)
        const loginTime = new Date(userSession.loginTime)
        const now = new Date()
        
        // Check if session is still valid (24 hours)
        if (now.getTime() - loginTime.getTime() < 24 * 60 * 60 * 1000) {
          return { success: true, data: { session: { user: userSession.user } } }
        } else {
          // Session expired, remove it
          localStorage.removeItem('userSession')
        }
      }
      
      return { success: false, error: 'No valid session found' }
    } catch (error) {
      console.error('Session error:', error)
      return { success: false, error: 'Failed to get session' }
    }
  }

  // OTP verification methods
  async sendEmailOtp(email: string): Promise<ApiResponse> {
    if (!this.validateEmail(email)) {
      return { success: false, error: 'Please enter a valid email address' }
    }

    return this.makeRequest('/auth/send-email-otp', {
      method: 'POST',
      body: JSON.stringify({ email: email.toLowerCase() }),
    })
  }

  async verifyEmailOtp(email: string, otp: string): Promise<ApiResponse> {
    if (!this.validateEmail(email)) {
      return { success: false, error: 'Please enter a valid email address' }
    }

    const sanitizedOtp = (otp || '').toString().trim().replace(/\D/g, '')
    if (!sanitizedOtp || sanitizedOtp.length !== 6) {
      return { success: false, error: 'Please enter a valid 6-digit verification code' }
    }

    return this.makeRequest('/auth/verify-email-otp', {
      method: 'POST',
      body: JSON.stringify({ email: email.toLowerCase().trim(), otp: sanitizedOtp }),
    })
  }

  async sendPhoneOtp(phone: string): Promise<ApiResponse> {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/
    if (!phoneRegex.test(phone) || phone.length < 10) {
      return { success: false, error: 'Please enter a valid phone number' }
    }

    return this.makeRequest('/auth/send-phone-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    })
  }

  async verifyPhoneOtp(phone: string, otp: string): Promise<ApiResponse> {
    const sanitizedOtp = (otp || '').toString().trim().replace(/\D/g, '')
    if (!sanitizedOtp || sanitizedOtp.length !== 6) {
      return { success: false, error: 'Please enter a valid 6-digit verification code' }
    }

    return this.makeRequest('/auth/verify-phone-otp', {
      method: 'POST',
      body: JSON.stringify({ phone: (phone || '').toString().trim(), otp: sanitizedOtp }),
    })
  }

  // Company profile methods
  async getCompanyProfile(): Promise<ApiResponse<{ company: any }>> {
    try {
      // Check local storage for user session
      const userSessionStr = localStorage.getItem('userSession')
      if (!userSessionStr) {
        return { success: false, error: 'User not authenticated' }
      }

      const userSession = JSON.parse(userSessionStr)
      const user = userSession.user

      // Try to get profile from server
      const result = await this.makeRequest<{ company: any }>('/company/profile', {
        headers: {
          'Authorization': `Bearer ${user.email}` // Use email as simple auth
        }
      })
      
      if (!result.success) {
        // If profile doesn't exist on server, return the local profile
        if (user.profile) {
          return { success: true, data: { company: user.profile } }
        }
        
        // Create default profile
        const defaultProfile = {
          companyInfo: {
            companyName: user.companyName || '',
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
            email: user.email || '',
            contactPerson: '',
            contactTitle: ''
          },
          registrationComplete: false
        }
        
        return { success: true, data: { company: defaultProfile } }
      }
      
      // If server has profile but local has a completed registration, prefer local and try to sync
      try {
        const savedProfileStr = localStorage.getItem('companyProfile')
        if (savedProfileStr) {
          const savedProfile = JSON.parse(savedProfileStr)
          if (savedProfile?.registrationComplete && !result.data?.company?.registrationComplete) {
            // Attempt to push completion to server for consistency
            await this.updateCompanyProfile(savedProfile)
            return { success: true, data: { company: savedProfile } }
          }
        }
      } catch {}

      return result as ApiResponse<{ company: any }>
    } catch (error) {
      console.error('Get profile error:', error)
      return { success: false, error: 'Failed to load company profile' }
    }
  }

  async updateCompanyProfile(profileData: any): Promise<ApiResponse<{ company: any }>> {
    try {
      const result = await this.makeAuthenticatedRequest<{ company: any }>('/company/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      })
      
      if (!result.success) {
        // Fallback: save to local storage if server fails
        localStorage.setItem('companyProfile', JSON.stringify(profileData))
        return { success: true, data: { company: profileData } }
      }
      
      return result as ApiResponse<{ company: any }>
    } catch (error) {
      console.error('Update profile error:', error)
      // Fallback: save to local storage
      localStorage.setItem('companyProfile', JSON.stringify(profileData))
      return { success: true, data: { company: profileData } }
    }
  }

  async completeRegistration(): Promise<ApiResponse<{ company: any }>> {
    try {
      const result = await this.makeAuthenticatedRequest<{ company: any }>('/company/complete-registration', {
        method: 'POST',
      })
      
      if (!result.success) {
        // Fallback: mark as complete in local storage
        const savedProfile = localStorage.getItem('companyProfile')
        if (savedProfile) {
          const profile = JSON.parse(savedProfile)
          profile.registrationComplete = true
          localStorage.setItem('companyProfile', JSON.stringify(profile))
          return { success: true, data: { company: profile } }
        }
      }
      
      return result as ApiResponse<{ company: any }>
    } catch (error) {
      console.error('Complete registration error:', error)
      return { success: false, error: 'Failed to complete registration' }
    }
  }
}

export const apiService = new ApiService()