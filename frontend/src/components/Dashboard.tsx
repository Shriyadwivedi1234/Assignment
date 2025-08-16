import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Separator } from './ui/separator'
import { 
  Building2, 
  Users, 
  Settings, 
  Bell, 
  Search,
  Plus,
  BarChart3,
  FileText,
  MessageSquare,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  MapPin,
  Globe,
  Star,
  Eye,
  Activity,
  ArrowLeft,
  UserCheck,
  PieChart,
  Target
} from 'lucide-react'
// ImageWithFallback component removed - using regular img tags instead
import { ThemeToggle } from './ThemeToggle'
import { JobsPage } from './dashboard/JobsPage'
import { CandidatesPage } from './dashboard/CandidatesPage'
import { MessagesPage } from './dashboard/MessagesPage'
import { InterviewsPage } from './dashboard/InterviewsPage'
import { AnalyticsSection } from './dashboard/AnalyticsSection'
import { TeamManagement } from './dashboard/TeamManagement'
import { ReportsPage } from './dashboard/ReportsPage'

interface DashboardProps {
  companyData: any
  onOpenSettings: () => void
  onLogout: () => void
}

type DashboardPage = 'overview' | 'jobs' | 'candidates' | 'messages' | 'interviews' | 'analytics' | 'team' | 'reports'

export function Dashboard({ companyData, onOpenSettings, onLogout }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState<DashboardPage>('overview')

  const stats = [
    { 
      label: 'Active Jobs', 
      value: '12', 
      change: '+3',
      trend: 'up',
      icon: FileText,
      colorClass: 'text-blue-600 dark:text-blue-400',
      page: 'jobs' as DashboardPage
    },
    { 
      label: 'Applications', 
      value: '127', 
      change: '+23',
      trend: 'up',
      icon: Users,
      colorClass: 'text-green-600 dark:text-green-400',
      page: 'candidates' as DashboardPage
    },
    { 
      label: 'Interviews', 
      value: '8', 
      change: '+2',
      trend: 'up',
      icon: Calendar,
      colorClass: 'text-purple-600 dark:text-purple-400',
      page: 'interviews' as DashboardPage
    },
    { 
      label: 'Messages', 
      value: '24', 
      change: '+5',
      trend: 'up',
      icon: MessageSquare,
      colorClass: 'text-orange-600 dark:text-orange-400',
      page: 'messages' as DashboardPage
    }
  ]

  const activities = [
    {
      type: 'application',
      title: 'New application received',
      description: 'Software Engineer position',
      time: '2 minutes ago',
      status: 'new'
    },
    {
      type: 'interview',
      title: 'Interview scheduled',
      description: 'Tomorrow at 2:00 PM',
      time: '1 hour ago',
      status: 'scheduled'
    },
    {
      type: 'profile',
      title: 'Profile viewed',
      description: 'Your profile was viewed 5 times today',
      time: '3 hours ago',
      status: 'info'
    },
    {
      type: 'job',
      title: 'Job posting approved',
      description: 'UI/UX Designer position is now live',
      time: '5 hours ago',
      status: 'approved'
    },
    {
      type: 'team',
      title: 'New team member added',
      description: 'Sarah Johnson joined the Engineering team',
      time: '1 day ago',
      status: 'team'
    }
  ]

  const renderPageContent = () => {
    switch (currentPage) {
      case 'jobs':
        return <JobsPage />
      case 'candidates':
        return <CandidatesPage />
      case 'messages':
        return <MessagesPage />
      case 'interviews':
        return <InterviewsPage />
      case 'analytics':
        return <AnalyticsSection />
      case 'team':
        return <TeamManagement />
      case 'reports':
        return <ReportsPage />
      default:
        return renderOverview()
    }
  }

  const renderOverview = () => (
    <>
      {/* Welcome Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold gradient-text">
            Welcome back, {companyData?.companyInfo?.companyName || 'Company'}! 👋
          </h2>
          <p className="text-lg text-muted-foreground mt-1">
            Here's what's happening with your company today
          </p>
          <div className="flex items-center mt-2 space-x-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Activity className="h-4 w-4 mr-1 text-green-500" />
              All systems operational
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Eye className="h-4 w-4 mr-1 text-blue-500" />
              Profile viewed 23 times today
            </div>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
          <Plus className="h-4 w-4 mr-2" />
          Post New Job
        </Button>
      </div>

      {/* Enhanced Stats Cards - Now Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat) => (
          <Card 
            key={stat.label} 
            className="glass-card hover:bg-accent/50 transition-all duration-200 group cursor-pointer"
            onClick={() => setCurrentPage(stat.page)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className="p-2 rounded-lg bg-muted group-hover:scale-110 transition-transform duration-200">
                <stat.icon className={`h-4 w-4 ${stat.colorClass}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.trend === 'up' ? '+12% from last month' : 'No change from last month'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card 
          className="glass-card hover:bg-accent/50 transition-colors cursor-pointer"
          onClick={() => setCurrentPage('analytics')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base">Analytics Dashboard</CardTitle>
              <CardDescription>View detailed metrics and insights</CardDescription>
            </div>
            <BarChart3 className="h-8 w-8 text-primary" />
          </CardHeader>
        </Card>

        <Card 
          className="glass-card hover:bg-accent/50 transition-colors cursor-pointer"
          onClick={() => setCurrentPage('team')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base">Team Management</CardTitle>
              <CardDescription>Manage your company team</CardDescription>
            </div>
            <UserCheck className="h-8 w-8 text-chart-1" />
          </CardHeader>
        </Card>

        <Card 
          className="glass-card hover:bg-accent/50 transition-colors cursor-pointer"
          onClick={() => setCurrentPage('reports')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base">Reports & Export</CardTitle>
              <CardDescription>Generate business reports</CardDescription>
            </div>
            <PieChart className="h-8 w-8 text-chart-2" />
          </CardHeader>
        </Card>
      </div>

      {/* Enhanced Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Profile Card */}
        <Card className="glass-card overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Company Profile
                  <Star className="h-4 w-4 text-yellow-500" />
                </CardTitle>
                <CardDescription>
                  Your company information overview
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={onOpenSettings}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {companyData?.companyInfo?.banner && (
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={companyData.companyInfo.banner}
                  alt="Company Banner"
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}
            
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 ring-4 ring-primary/20 shadow-lg">
                <AvatarImage src={companyData?.companyInfo?.logo} />
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg">
                  {companyData?.companyInfo?.companyName?.charAt(0) || 'C'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-bold text-lg">
                  {companyData?.companyInfo?.companyName || 'Company Name'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {companyData?.foundingInfo?.companyType || 'Technology Company'}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    {companyData?.foundingInfo?.teamSize || 'Team Size'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Est. {companyData?.foundingInfo?.yearEstablished || 'Year'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-3">
              {companyData?.companyInfo?.aboutUs || 'Company description will appear here. Add your company details in the settings to make your profile more attractive to potential candidates.'}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {companyData?.contactInfo?.city || 'Location'}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Globe className="h-4 w-4 mr-1" />
                {companyData?.foundingInfo?.website ? 'Website' : 'No website'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates and notifications
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors duration-200">
                  <div className={`w-2 h-2 rounded-full mt-2 animate-pulse ${
                    activity.status === 'new' ? 'bg-green-500' :
                    activity.status === 'scheduled' ? 'bg-blue-500' :
                    activity.status === 'info' ? 'bg-yellow-500' :
                    activity.status === 'team' ? 'bg-purple-500' :
                    'bg-primary'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                  <Badge 
                    variant={activity.status === 'new' ? 'default' : 'secondary'} 
                    className="text-xs"
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20">
              View all activities
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )

  const getPageTitle = () => {
    switch (currentPage) {
      case 'jobs': return 'Jobs'
      case 'candidates': return 'Candidates'
      case 'messages': return 'Messages'
      case 'interviews': return 'Interviews'
      case 'analytics': return 'Analytics'
      case 'team': return 'Team'
      case 'reports': return 'Reports'
      default: return 'Dashboard'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <header className="glass-card border-b sticky top-0 z-50">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            {currentPage !== 'overview' && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setCurrentPage('overview')}
                className="mr-2 hover:bg-accent"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-sm opacity-30" />
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Building2 className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-lg gradient-text">
                {getPageTitle()}
              </h1>
              <p className="text-xs text-muted-foreground">Professional Dashboard</p>
            </div>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="hover:bg-accent">
                <Search className="h-4 w-4" />
              </Button>
              <div className="relative">
                <Button variant="ghost" size="sm" className="hover:bg-accent">
                  <Bell className="h-4 w-4" />
                </Button>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </div>
            </div>
            <ThemeToggle />
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                <AvatarImage src={companyData?.companyInfo?.logo} />
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm">
                  {companyData?.companyInfo?.companyName?.charAt(0) || 'C'}
                </AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" onClick={onLogout} className="hidden md:flex hover:bg-destructive/10 hover:text-destructive">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Enhanced Sidebar with New Pages */}
        <aside className="w-64 h-[calc(100vh-4rem)] glass-card border-r">
          <nav className="p-4 space-y-2">
            <Button 
              variant={currentPage === 'overview' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setCurrentPage('overview')}
            >
              <BarChart3 className="h-4 w-4 mr-3" />
              Dashboard
              {currentPage === 'overview' && <Badge variant="secondary" className="ml-auto">Live</Badge>}
            </Button>
            
            <Separator className="my-2" />
            <p className="text-xs font-medium text-muted-foreground px-2 py-1">RECRUITMENT</p>
            
            <Button 
              variant={currentPage === 'jobs' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setCurrentPage('jobs')}
            >
              <FileText className="h-4 w-4 mr-3" />
              Jobs
              <Badge variant="outline" className="ml-auto">12</Badge>
            </Button>
            <Button 
              variant={currentPage === 'candidates' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setCurrentPage('candidates')}
            >
              <Users className="h-4 w-4 mr-3" />
              Candidates
              <Badge variant="outline" className="ml-auto">127</Badge>
            </Button>
            <Button 
              variant={currentPage === 'interviews' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setCurrentPage('interviews')}
            >
              <Calendar className="h-4 w-4 mr-3" />
              Interviews
            </Button>
            
            <Separator className="my-2" />
            <p className="text-xs font-medium text-muted-foreground px-2 py-1">COMMUNICATION</p>
            
            <Button 
              variant={currentPage === 'messages' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setCurrentPage('messages')}
            >
              <MessageSquare className="h-4 w-4 mr-3" />
              Messages
              <div className="ml-auto w-2 h-2 bg-green-500 rounded-full" />
            </Button>
            
            <Separator className="my-2" />
            <p className="text-xs font-medium text-muted-foreground px-2 py-1">ANALYTICS</p>
            
            <Button 
              variant={currentPage === 'analytics' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setCurrentPage('analytics')}
            >
              <TrendingUp className="h-4 w-4 mr-3" />
              Analytics
            </Button>
            <Button 
              variant={currentPage === 'reports' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setCurrentPage('reports')}
            >
              <PieChart className="h-4 w-4 mr-3" />
              Reports
            </Button>
            
            <Separator className="my-2" />
            <p className="text-xs font-medium text-muted-foreground px-2 py-1">MANAGEMENT</p>
            
            <Button 
              variant={currentPage === 'team' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setCurrentPage('team')}
            >
              <UserCheck className="h-4 w-4 mr-3" />
              Team
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start hover:bg-accent"
              onClick={onOpenSettings}
            >
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </Button>
          </nav>
        </aside>

        {/* Enhanced Main Content */}
        <main className="flex-1 p-6">
          {renderPageContent()}
        </main>
      </div>
    </div>
  )
}