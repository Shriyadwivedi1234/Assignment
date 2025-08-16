# Company Registration & Login System v2.0

A modern, responsive company registration and login system built with React 19, TypeScript, and Tailwind CSS. This application provides a comprehensive solution for company onboarding with multi-step registration, user authentication, and a feature-rich dashboard.

## 🎨 Design Features

- **Modern UI/UX**: Clean, professional interface following modern design principles
- **Responsive Design**: Mobile-first approach with full desktop compatibility
- **Dark/Light Theme**: Built-in theme switching with custom color palettes
- **Glass Morphism**: Beautiful glass card effects and modern visual elements
- **Consistent Design Language**: Unified design system across all components

## 🚀 Tech Stack

### Frontend
- **React 19**: Latest React with modern hooks and features
- **TypeScript**: Full type safety and better development experience
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Beautiful, customizable icons
- **Shadcn/ui**: High-quality, accessible UI components

### State Management & Data Fetching
- **Redux Toolkit**: Modern Redux with simplified state management
- **React Query**: Server state management and caching
- **Axios**: HTTP client for API requests

### Authentication & Backend
- **Supabase**: Backend-as-a-Service with authentication and database
- **Firebase**: Email/password and SMS OTP authentication
- **JWT**: Secure token-based authentication

### Additional Libraries
- **React Hook Form**: Performant forms with validation
- **React Phone Input**: International phone number input
- **React Toastify**: User notifications
- **React Responsive**: Mobile responsiveness utilities

## 🎯 Features

### User Management
- User registration with email verification
- SMS OTP verification for mobile numbers
- Secure login/logout functionality
- JWT-based authentication (90-day validity)

### Company Registration
- Multi-step registration process:
  1. Company Information (logo, banner, name, description)
  2. Founding Information (type, team size, year established)
  3. Social Media Links
  4. Contact Information
- Image upload support for company branding
- Form validation and error handling

### Dashboard
- Overview with key metrics and statistics
- Job management system
- Candidate tracking
- Interview scheduling
- Team management
- Analytics and reporting
- Messaging system

### Profile Management
- Company profile editing
- User settings and preferences
- Theme customization
- Responsive design for all devices

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- PostgreSQL database (for backend integration)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd company-registration-login-system
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Firebase Configuration (if using Firebase auth)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id

# API Configuration
VITE_API_BASE_URL=your_api_base_url
```

### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### 5. Build for Production
```bash
npm run build
# or
yarn build
```

## 🗄️ Database Integration

### PostgreSQL Setup
1. Install PostgreSQL 15+ on your system
2. Create a new database for the application
3. Run the provided database schema files
4. Update connection strings in your environment

### Database Schema
The application expects the following main tables:
- `users`: User authentication and profile data
- `company_profiles`: Company registration information
- `jobs`: Job postings and management
- `candidates`: Candidate applications and tracking
- `interviews`: Interview scheduling and management

## 🔧 Backend Integration

### API Endpoints
The application integrates with a Node.js/Express backend providing:
- User authentication and authorization
- Company profile management
- Job and candidate management
- File upload handling (Cloudinary integration)

### Authentication Flow
1. User registers with email/password
2. Firebase handles email verification
3. SMS OTP verification for mobile
4. JWT token generation for authenticated requests
5. Token stored in Redux and included in API headers

## 🎨 Customization

### Color Palette
The application uses a sophisticated color system with:
- **Light Theme**: Clean whites and subtle grays
- **Dark Theme**: Deep blues and cyan accents
- **Custom CSS Variables**: Easily modifiable design tokens

### Component Styling
- All components use Tailwind CSS classes
- Custom CSS variables for consistent theming
- Responsive breakpoints for mobile-first design

## 📱 Mobile Responsiveness

- Mobile-first design approach
- Responsive breakpoints for all screen sizes
- Touch-friendly interface elements
- Optimized layouts for mobile devices

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Secure HTTP headers
- CORS configuration
- Rate limiting support

## 🚀 Deployment

### Vercel/Netlify
1. Connect your repository
2. Set environment variables
3. Deploy automatically on push

### Docker
```bash
# Build the image
docker build -t company-registration-system .

# Run the container
docker run -p 3000:3000 company-registration-system
```

## 📝 Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run type-check`: TypeScript type checking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🔄 Updates

### Version 2.0 Changes
- Removed Figma asset dependencies
- Updated to React 19
- Enhanced TypeScript support
- Improved build configuration
- Added comprehensive documentation
- Enhanced mobile responsiveness

---

**Note**: This application is designed to be runnable in any environment (localhost, staging, production) with proper configuration. All Figma assets have been removed while maintaining the exact design and color palette specifications.
