import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Calendar } from '../ui/calendar'
import { 
  Search, 
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  Phone,
  Edit,
  Trash2,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

interface Interview {
  id: string
  candidateName: string
  candidateEmail: string
  position: string
  type: 'phone' | 'video' | 'in-person'
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
  date: string
  time: string
  duration: number
  location?: string
  interviewers: string[]
  notes?: string
  avatar?: string
}

const mockInterviews: Interview[] = [
  {
    id: '1',
    candidateName: 'Sarah Johnson',
    candidateEmail: 'sarah.johnson@email.com',
    position: 'Senior Software Engineer',
    type: 'video',
    status: 'scheduled',
    date: '2024-01-18',
    time: '14:00',
    duration: 60,
    interviewers: ['John Smith', 'Emily Davis'],
    notes: 'Technical interview focusing on React and system design'
  },
  {
    id: '2',
    candidateName: 'Michael Chen',
    candidateEmail: 'michael.chen@email.com',
    position: 'Product Manager',
    type: 'in-person',
    status: 'scheduled',
    date: '2024-01-19',
    time: '10:30',
    duration: 90,
    location: 'Conference Room A',
    interviewers: ['Alice Johnson', 'Bob Wilson'],
    notes: 'Product strategy and leadership discussion'
  },
  {
    id: '3',
    candidateName: 'Emily Rodriguez',
    candidateEmail: 'emily.rodriguez@email.com',
    position: 'UI/UX Designer',
    type: 'video',
    status: 'completed',
    date: '2024-01-15',
    time: '15:00',
    duration: 45,
    interviewers: ['Design Team'],
    notes: 'Portfolio review went well, strong design skills'
  },
  {
    id: '4',
    candidateName: 'David Park',
    candidateEmail: 'david.park@email.com',
    position: 'Marketing Specialist',
    type: 'phone',
    status: 'completed',
    date: '2024-01-12',
    time: '11:00',
    duration: 30,
    interviewers: ['Marketing Manager'],
    notes: 'Good cultural fit, experienced in digital marketing'
  },
  {
    id: '5',
    candidateName: 'Lisa Thompson',
    candidateEmail: 'lisa.thompson@email.com',
    position: 'Senior Software Engineer',
    type: 'video',
    status: 'no-show',
    date: '2024-01-14',
    time: '16:00',
    duration: 60,
    interviewers: ['Tech Lead'],
    notes: 'Candidate did not attend the scheduled interview'
  }
]

export function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'scheduled' | 'completed' | 'cancelled' | 'no-show'>('all')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || interview.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'no-show': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      case 'no-show': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />
      case 'phone': return <Phone className="h-4 w-4" />
      case 'in-person': return <MapPin className="h-4 w-4" />
      default: return <Video className="h-4 w-4" />
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timeStr: string) => {
    return new Date(`2024-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getStatusCount = (status: string) => {
    if (status === 'all') return interviews.length
    return interviews.filter(i => i.status === status).length
  }

  const todaysInterviews = interviews.filter(interview => {
    const today = new Date().toISOString().split('T')[0]
    return interview.date === today && interview.status === 'scheduled'
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Interviews</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track candidate interviews
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Interview
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Interviews</p>
                <p className="text-2xl font-bold">{todaysInterviews.length}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">{getStatusCount('scheduled')}</p>
              </div>
              <Clock className="h-8 w-8 text-chart-1" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{getStatusCount('completed')}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-chart-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Users className="h-8 w-8 text-chart-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle and Filters */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search interviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-80"
                />
              </div>
              <Tabs value={selectedStatus} onValueChange={(value: any) => setSelectedStatus(value)}>
                <TabsList className="grid grid-cols-5">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                  <TabsTrigger value="no-show">No Show</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
              <TabsList>
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {viewMode === 'list' ? (
        /* List View */
        <div className="grid gap-4">
          {filteredInterviews.map((interview) => (
            <Card key={interview.id} className="glass-card hover:bg-accent/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Interview Info */}
                  <div className="flex gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={interview.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {interview.candidateName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{interview.candidateName}</h3>
                          <p className="text-sm text-muted-foreground">{interview.position}</p>
                        </div>
                        <Badge className={getStatusColor(interview.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(interview.status)}
                            {interview.status}
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {formatDate(interview.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatTime(interview.time)} ({interview.duration}min)
                        </div>
                        <div className="flex items-center gap-1">
                          {getTypeIcon(interview.type)}
                          {interview.type}
                          {interview.location && ` - ${interview.location}`}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {interview.interviewers.join(', ')}
                        </div>
                      </div>
                      
                      {interview.notes && (
                        <p className="text-sm text-muted-foreground bg-muted/50 rounded p-2">
                          {interview.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-2 min-w-fit">
                    {interview.status === 'scheduled' && (
                      <>
                        {interview.type === 'video' && (
                          <Button size="sm" className="bg-primary hover:bg-primary/90 gap-2">
                            <Video className="h-4 w-4" />
                            Join Call
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="gap-2">
                          <Edit className="h-4 w-4" />
                          Reschedule
                        </Button>
                      </>
                    )}
                    {interview.status === 'completed' && (
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit className="h-4 w-4" />
                        Add Notes
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Calendar View */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="glass-card lg:col-span-1">
            <CardContent className="p-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border-0"
              />
            </CardContent>
          </Card>
          
          <Card className="glass-card lg:col-span-3">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Interviews for {selectedDate?.toDateString()}
              </h3>
              <div className="space-y-3">
                {interviews
                  .filter(interview => {
                    if (!selectedDate) return false
                    const interviewDate = new Date(interview.date)
                    return interviewDate.toDateString() === selectedDate.toDateString()
                  })
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((interview) => (
                    <div
                      key={interview.id}
                      className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="text-sm font-medium min-w-16">
                        {formatTime(interview.time)}
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={interview.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {interview.candidateName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{interview.candidateName}</p>
                        <p className="text-sm text-muted-foreground">{interview.position}</p>
                      </div>
                      <Badge className={getStatusColor(interview.status)}>
                        {interview.status}
                      </Badge>
                    </div>
                  ))}
                {interviews.filter(interview => {
                  if (!selectedDate) return false
                  const interviewDate = new Date(interview.date)
                  return interviewDate.toDateString() === selectedDate.toDateString()
                }).length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No interviews scheduled for this date
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {filteredInterviews.length === 0 && viewMode === 'list' && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No interviews found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Schedule your first interview to get started'
              }
            </p>
            {!searchTerm && selectedStatus === 'all' && (
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}