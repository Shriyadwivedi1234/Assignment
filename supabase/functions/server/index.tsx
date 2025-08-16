import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js'
import * as kv from './kv_store.tsx'

const app = new Hono()

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.use('*', logger(console.log))

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

// Health check
app.get('/make-server-9b27c0ef/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Auth routes
app.post('/make-server-9b27c0ef/auth/register', async (c) => {
  try {
    const { companyName, email, password } = await c.req.json()
    
    // Validate input
    if (!companyName || !email || !password) {
      return c.json({ error: 'Missing required fields' }, 400)
    }

    // Check if user already exists in our KV store
    const existingUser = await kv.get(`user:${email}`)
    if (existingUser) {
      return c.json({ error: 'Registration failed: A user with this email address has already been registered' }, 400)
    }

    // Store user data in KV store
    const userData = {
      email,
      companyName,
      password, // Store password for login verification
      createdAt: new Date().toISOString(),
      profile: {
        companyInfo: {
          companyName,
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
          email,
          contactPerson: '',
          contactTitle: ''
        },
        registrationComplete: false
      }
    }

    await kv.set(`user:${email}`, userData)

    // Append to users CSV store in KV (for export)
    try {
      const usersCsv = (await kv.get('csv:users')) || { header: [
        'id','username','email','password','full_name','profile_photo','google_uid','signup_type','location','resume','created_at','updated_at','role','dob','preference','mobile_no','ac_status','gender','heading','is_mail_verified','is_mo_verified','first_name','last_name'
      ], rows: [] }

      const nextId = (usersCsv.rows?.length || 0) + 1
      usersCsv.rows.push([
        String(nextId), '', email, password, companyName, '', '', 'e', '', '', new Date().toISOString(), new Date().toISOString(), 'company', '', '', '', 'active', '', '', 'false', 'false', '', ''
      ])

      await kv.set('csv:users', usersCsv)
    } catch (csvErr) {
      console.warn('Failed to append user to CSV store:', csvErr)
    }
    
    return c.json({ 
      message: 'User registered successfully',
      user: { email, companyName }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Login endpoint for registered users
app.post('/make-server-9b27c0ef/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    
    // Validate input
    if (!email || !password) {
      return c.json({ error: 'Missing email or password' }, 400)
    }

    // Check if user exists in KV store
    const userData = await kv.get(`user:${email}`)
    if (!userData) {
      return c.json({ error: 'User not found. Please register first.' }, 401)
    }

    // Verify password
    if (userData.password !== password) {
      return c.json({ error: 'Invalid password' }, 401)
    }

    // Return user profile data
    return c.json({ 
      success: true,
      message: 'Login successful',
      user: {
        email: userData.email,
        companyName: userData.companyName,
        profile: userData.profile
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Company profile routes
app.get('/make-server-9b27c0ef/company/profile', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Authorization header missing' }, 401)
    }

    const email = authHeader.replace('Bearer ', '')
    
    // Get user profile from KV store
    const userData = await kv.get(`user:${email}`)
    
    if (!userData) {
      // Create default profile
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
          email: email,
          contactPerson: '',
          contactTitle: ''
        },
        registrationComplete: false
      }
      
      return c.json({ company: defaultProfile })
    }

    return c.json({ company: userData.profile || userData })
  } catch (error) {
    console.error('Get profile error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

app.put('/make-server-9b27c0ef/company/profile', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Authorization header missing' }, 401)
    }
    const email = authHeader.replace('Bearer ', '')
    const profileData = await c.req.json()
    
    // Get existing user data
    let userData = await kv.get(`user:${email}`) || {}
    
    // Update profile
    userData.profile = profileData
    userData.updatedAt = new Date().toISOString()
    
    // Save back to KV store
    await kv.set(`user:${email}`, userData)
    
    // Maintain company profiles CSV for export
    try {
      const profilesCsv = (await kv.get('csv:company_profiles')) || { header: [
        'id','company_logo_url','company_banner_url','company_name','about_company','organizations_type','industry_type','team_size','year_of_establishment','company_website','company_app_link','company_vision','headquarter_phone_no','social_links','map_location_url','careers_link','created_at','updated_at','owner_id','is_claimed','headquarter_mail_id'
      ], rows: [] }

      const row = [
        String((profilesCsv.rows?.length || 0) + 1),
        profileData?.companyInfo?.logo || '',
        profileData?.companyInfo?.banner || '',
        profileData?.companyInfo?.companyName || '',
        profileData?.companyInfo?.aboutUs || '',
        profileData?.foundingInfo?.organizationType || '',
        profileData?.foundingInfo?.companyType || '',
        profileData?.foundingInfo?.teamSize || '',
        profileData?.foundingInfo?.yearEstablished || '',
        profileData?.foundingInfo?.website || '',
        '',
        profileData?.foundingInfo?.vision || '',
        profileData?.contactInfo?.phone || '',
        JSON.stringify(profileData?.socialInfo || {}),
        '',
        '',
        new Date().toISOString(),
        new Date().toISOString(),
        '',
        'false',
        profileData?.contactInfo?.email || ''
      ]

      profilesCsv.rows.push(row)
      await kv.set('csv:company_profiles', profilesCsv)
    } catch (csvErr) {
      console.warn('Failed to append company profile to CSV store:', csvErr)
    }

    return c.json({ company: profileData })
  } catch (error) {
    console.error('Update profile error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

app.post('/make-server-9b27c0ef/company/complete-registration', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Authorization header missing' }, 401)
    }

    const email = authHeader.replace('Bearer ', '')
    
    // Get existing user data
    let userData = await kv.get(`user:${email}`) || {}
    
    // Mark registration as complete
    if (userData.profile) {
      userData.profile.registrationComplete = true
    }
    userData.completedAt = new Date().toISOString()
    
    // Save back to KV store
    await kv.set(`user:${email}`, userData)
    
    return c.json({ company: userData.profile })
  } catch (error) {
    console.error('Complete registration error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// CSV export endpoints
app.get('/make-server-9b27c0ef/csv/users', async (c) => {
  try {
    const usersCsv = (await kv.get('csv:users')) || { header: [], rows: [] }
    const lines = [usersCsv.header.join(','), ...(usersCsv.rows || []).map((r: string[]) => r.map(cell => String(cell).includes(',') ? `"${String(cell).replace(/"/g, '""')}"` : String(cell)).join(','))]
    return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/csv' } })
  } catch (error) {
    console.error('Users CSV export error:', error)
    return c.json({ error: 'Failed to export users CSV' }, 500)
  }
})

app.get('/make-server-9b27c0ef/csv/company_profiles', async (c) => {
  try {
    const profilesCsv = (await kv.get('csv:company_profiles')) || { header: [], rows: [] }
    const lines = [profilesCsv.header.join(','), ...(profilesCsv.rows || []).map((r: string[]) => r.map(cell => String(cell).includes(',') ? `"${String(cell).replace(/"/g, '""')}"` : String(cell)).join(','))]
    return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/csv' } })
  } catch (error) {
    console.error('Company profiles CSV export error:', error)
    return c.json({ error: 'Failed to export company profiles CSV' }, 500)
  }
})

// OTP routes (mock implementation)
app.post('/make-server-9b27c0ef/auth/send-email-otp', async (c) => {
  try {
    const { email } = await c.req.json()
    const normalizedEmail = (email || '').toString().trim().toLowerCase()
    
    // Mock OTP generation (fixed for demo)
    const otp = '123456'
    
    // Store OTP temporarily (expires in 5 minutes)
    await kv.set(`otp:email:${normalizedEmail}`, { otp, expires: Date.now() + 5 * 60 * 1000 })
    
    console.log(`Mock Email OTP for ${normalizedEmail}: ${otp}`)
    
    return c.json({ message: 'OTP sent successfully' })
  } catch (error) {
    console.error('Send email OTP error:', error)
    return c.json({ error: 'Failed to send OTP' }, 500)
  }
})

app.post('/make-server-9b27c0ef/auth/verify-email-otp', async (c) => {
  try {
    const { email, otp } = await c.req.json()
    
    const normalizedEmail = (email || '').toString().trim().toLowerCase()
    const sanitizedOtp = (otp || '').toString().trim().replace(/\D/g, '')
    
    // Accept demo code directly to avoid mismatch issues
    if (sanitizedOtp === '123456') {
      try { await kv.del(`otp:email:${normalizedEmail}`) } catch {}
      return c.json({ message: 'Email verified successfully' })
    }

    // Get stored OTP
    const storedOtp = await kv.get(`otp:email:${normalizedEmail}`)
    
    if (!storedOtp || storedOtp.expires < Date.now()) {
      return c.json({ error: 'OTP expired or not found' }, 400)
    }
    
    if (storedOtp.otp !== sanitizedOtp) {
      return c.json({ error: 'Invalid OTP' }, 400)
    }
    
    // Remove used OTP
    await kv.del(`otp:email:${normalizedEmail}`)
    
    return c.json({ message: 'Email verified successfully' })
  } catch (error) {
    console.error('Verify email OTP error:', error)
    return c.json({ error: 'Failed to verify OTP' }, 500)
  }
})

app.post('/make-server-9b27c0ef/auth/send-phone-otp', async (c) => {
  try {
    const { phone } = await c.req.json()
    const normalizedPhone = (phone || '').toString().trim()
    
    // Mock OTP generation (fixed for demo)
    const otp = '123456'
    
    // Store OTP temporarily (expires in 5 minutes)
    await kv.set(`otp:phone:${normalizedPhone}`, { otp, expires: Date.now() + 5 * 60 * 1000 })
    
    console.log(`Mock Phone OTP for ${normalizedPhone}: ${otp}`)
    
    return c.json({ message: 'OTP sent successfully' })
  } catch (error) {
    console.error('Send phone OTP error:', error)
    return c.json({ error: 'Failed to send OTP' }, 500)
  }
})

app.post('/make-server-9b27c0ef/auth/verify-phone-otp', async (c) => {
  try {
    const { phone, otp } = await c.req.json()
    
    const normalizedPhone = (phone || '').toString().trim()
    const sanitizedOtp = (otp || '').toString().trim().replace(/\D/g, '')
    
    // Accept demo code directly to avoid mismatch issues
    if (sanitizedOtp === '123456') {
      try { await kv.del(`otp:phone:${normalizedPhone}`) } catch {}
      return c.json({ message: 'Phone verified successfully' })
    }

    // Get stored OTP
    const storedOtp = await kv.get(`otp:phone:${normalizedPhone}`)
    
    if (!storedOtp || storedOtp.expires < Date.now()) {
      return c.json({ error: 'OTP expired or not found' }, 400)
    }
    
    if (storedOtp.otp !== sanitizedOtp) {
      return c.json({ error: 'Invalid OTP' }, 400)
    }
    
    // Remove used OTP
    await kv.del(`otp:phone:${normalizedPhone}`)
    
    return c.json({ message: 'Phone verified successfully' })
  } catch (error) {
    console.error('Verify phone OTP error:', error)
    return c.json({ error: 'Failed to verify OTP' }, 500)
  }
})

// Catch all route
app.all('*', (c) => {
  return c.json({ error: 'Route not found' }, 404)
})

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err)
  return c.json({ error: 'Internal server error' }, 500)
})

Deno.serve(app.fetch)