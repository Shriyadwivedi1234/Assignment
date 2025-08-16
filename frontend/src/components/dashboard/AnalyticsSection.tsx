import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Briefcase, 
  Clock, 
  Target,
  Calendar,
  MapPin
} from 'lucide-react'

const applicationData = [
  { month: 'Jan', applications: 45, hired: 8 },
  { month: 'Feb', applications: 52, hired: 12 },
  { month: 'Mar', applications: 48, hired: 9 },
  { month: 'Apr', applications: 61, hired: 15 },
  { month: 'May', applications: 55, hired: 11 },
  { month: 'Jun', applications: 67, hired: 18 }
]

const sourceData = [
  { name: 'LinkedIn', value: 35, color: '#92f4ff' },
  { name: 'Company Website', value: 28, color: '#950ff5' },
  { name: 'Job Boards', value: 20, color: '#acdfff' },
  { name: 'Referrals', value: 17, color: '#ced4ff' }
]

const departmentData = [
  { department: 'Engineering', openings: 8, applications: 145 },
  { department: 'Product', openings: 3, applications: 89 },
  { department: 'Design', openings: 2, applications: 67 },
  { department: 'Marketing', openings: 4, applications: 112 },
  { department: 'Sales', openings: 5, applications: 93 }
]

const performanceData = [
  { week: 'W1', views: 234, applications: 45, interviews: 12 },
  { week: 'W2', views: 289, applications: 52, interviews: 15 },
  { week: 'W3', views: 245, applications: 38, interviews: 9 },
  { week: 'W4', views: 312, applications: 61, interviews: 18 }
]

export function AnalyticsSection() {
  const totalApplications = applicationData.reduce((sum, item) => sum + item.applications, 0)
  const totalHired = applicationData.reduce((sum, item) => sum + item.hired, 0)
  const hireRate = Math.round((totalHired / totalApplications) * 100)

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Application Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+23%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">↗ 12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hire Rate</CardTitle>
            <Target className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hireRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">↗ 5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time to Hire</CardTitle>
            <Clock className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18 days</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">↘ 2 days</span> improvement
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interview Show Rate</CardTitle>
            <Calendar className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">↗ 3%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Over Time */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Applications & Hires Trend</CardTitle>
            <p className="text-sm text-muted-foreground">
              Monthly application volume and successful hires
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={applicationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(206, 212, 255, 0.1)" />
                <XAxis dataKey="month" stroke="#acdfff" />
                <YAxis stroke="#acdfff" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(206, 212, 255, 0.1)', 
                    border: '1px solid rgba(206, 212, 255, 0.2)',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="applications" 
                  stackId="1" 
                  stroke="#92f4ff" 
                  fill="rgba(146, 244, 255, 0.3)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="hired" 
                  stackId="2" 
                  stroke="#950ff5" 
                  fill="rgba(149, 15, 245, 0.3)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Application Sources */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Application Sources</CardTitle>
            <p className="text-sm text-muted-foreground">
              Where your best candidates are coming from
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(206, 212, 255, 0.1)', 
                    border: '1px solid rgba(206, 212, 255, 0.2)',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 mt-4">
              {sourceData.map((source, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: source.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {source.name} ({source.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Department Insights</CardTitle>
            <p className="text-sm text-muted-foreground">
              Application volume by department
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(206, 212, 255, 0.1)" />
                <XAxis type="number" stroke="#acdfff" />
                <YAxis 
                  type="category" 
                  dataKey="department" 
                  stroke="#acdfff"
                  width={100}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(206, 212, 255, 0.1)', 
                    border: '1px solid rgba(206, 212, 255, 0.2)',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="applications" fill="#92f4ff" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Weekly Performance</CardTitle>
            <p className="text-sm text-muted-foreground">
              Job views, applications, and interview conversion
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(206, 212, 255, 0.1)" />
                <XAxis dataKey="week" stroke="#acdfff" />
                <YAxis stroke="#acdfff" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(206, 212, 255, 0.1)', 
                    border: '1px solid rgba(206, 212, 255, 0.2)',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#92f4ff" 
                  strokeWidth={3}
                  dot={{ fill: '#92f4ff', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="#950ff5" 
                  strokeWidth={3}
                  dot={{ fill: '#950ff5', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="interviews" 
                  stroke="#acdfff" 
                  strokeWidth={3}
                  dot={{ fill: '#acdfff', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Jobs */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Top Performing Jobs</CardTitle>
          <p className="text-sm text-muted-foreground">
            Jobs with the highest application rates this month
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { title: 'Senior Software Engineer', department: 'Engineering', applications: 67, views: 892, location: 'Remote' },
              { title: 'Product Manager', department: 'Product', applications: 45, views: 634, location: 'San Francisco' },
              { title: 'UI/UX Designer', department: 'Design', applications: 38, views: 521, location: 'New York' },
              { title: 'Marketing Manager', department: 'Marketing', applications: 33, views: 467, location: 'Austin' }
            ].map((job, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                    <div>
                      <h4 className="font-semibold">{job.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-chart-1">{job.applications}</div>
                    <div className="text-xs text-muted-foreground">Applications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-chart-2">{job.views}</div>
                    <div className="text-xs text-muted-foreground">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-chart-3">{Math.round((job.applications / job.views) * 100)}%</div>
                    <div className="text-xs text-muted-foreground">Conversion</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}