import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { 
  Download, 
  FileText, 
  Calendar as CalendarIcon,
  Users, 
  Briefcase,
  TrendingUp,
  Filter,
  RefreshCw,
  PieChart,
  BarChart,
  FileSpreadsheet,
  Mail,
  Clock,
  Target
} from 'lucide-react'
import { format } from 'date-fns'

interface Report {
  id: string
  name: string
  description: string
  type: 'hiring' | 'performance' | 'analytics' | 'compliance'
  lastGenerated: string
  size: string
  status: 'ready' | 'generating' | 'scheduled'
  icon: React.ElementType
}

const availableReports: Report[] = [
  {
    id: '1',
    name: 'Hiring Pipeline Report',
    description: 'Complete overview of your hiring funnel, applications, and conversion rates',
    type: 'hiring',
    lastGenerated: '2024-01-15T10:30:00Z',
    size: '2.4 MB',
    status: 'ready',
    icon: Users
  },
  {
    id: '2',
    name: 'Job Performance Analytics',
    description: 'Detailed analysis of job posting performance, views, and application rates',
    type: 'performance',
    lastGenerated: '2024-01-14T15:20:00Z',
    size: '1.8 MB',
    status: 'ready',
    icon: TrendingUp
  },
  {
    id: '3',
    name: 'Candidate Source Report',
    description: 'Breakdown of where your best candidates are coming from',
    type: 'analytics',
    lastGenerated: '2024-01-13T09:45:00Z',
    size: '1.2 MB',
    status: 'ready',
    icon: PieChart
  },
  {
    id: '4',
    name: 'Interview Metrics',
    description: 'Interview scheduling, completion rates, and feedback analysis',
    type: 'performance',
    lastGenerated: '2024-01-12T14:10:00Z',
    size: '956 KB',
    status: 'ready',
    icon: CalendarIcon
  },
  {
    id: '5',
    name: 'Time-to-Hire Analysis',
    description: 'Average time from application to hire across all positions',
    type: 'analytics',
    lastGenerated: '2024-01-11T11:30:00Z',
    size: '743 KB',
    status: 'ready',
    icon: Clock
  },
  {
    id: '6',
    name: 'Diversity & Inclusion Report',
    description: 'Compliance report for diversity metrics and equal opportunity data',
    type: 'compliance',
    lastGenerated: '2024-01-10T16:00:00Z',
    size: '1.5 MB',
    status: 'ready',
    icon: Target
  }
]

export function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(availableReports)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(2024, 0, 1),
    to: new Date()
  })
  const [isGenerating, setIsGenerating] = useState<string | null>(null)

  const filteredReports = reports.filter(report => 
    selectedType === 'all' || report.type === selectedType
  )

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hiring': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'performance': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'analytics': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      case 'compliance': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'generating': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const handleGenerateReport = async (reportId: string) => {
    setIsGenerating(reportId)
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: 'ready', lastGenerated: new Date().toISOString() }
        : report
    ))
    
    setIsGenerating(null)
  }

  const handleDownloadReport = (report: Report, format: 'pdf' | 'excel' | 'csv') => {
    // Simulate download
    console.log(`Downloading ${report.name} in ${format} format`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Generate and export detailed reports about your hiring performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Mail className="h-4 w-4" />
            Schedule Reports
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Download className="h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available Reports</p>
                <p className="text-2xl font-bold">{reports.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ready to Download</p>
                <p className="text-2xl font-bold">{reports.filter(r => r.status === 'ready').length}</p>
              </div>
              <Download className="h-8 w-8 text-chart-1" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Generated This Month</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <BarChart className="h-8 w-8 text-chart-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Size</p>
                <p className="text-2xl font-bold">8.6 MB</p>
              </div>
              <FileSpreadsheet className="h-8 w-8 text-chart-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Report Types</SelectItem>
                  <SelectItem value="hiring">Hiring Reports</SelectItem>
                  <SelectItem value="performance">Performance Reports</SelectItem>
                  <SelectItem value="analytics">Analytics Reports</SelectItem>
                  <SelectItem value="compliance">Compliance Reports</SelectItem>
                </SelectContent>
              </Select>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2 justify-start text-left font-normal">
                    <CalendarIcon className="h-4 w-4" />
                    {dateRange?.from && dateRange?.to 
                      ? `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')}`
                      : 'Select date range'
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range: any) => setDateRange(range || { from: new Date(), to: new Date() })}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      <div className="grid gap-6">
        {filteredReports.map((report) => (
          <Card key={report.id} className="glass-card hover:bg-accent/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Report Info */}
                <div className="flex gap-4 flex-1">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <report.icon className="h-8 w-8 text-primary" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{report.name}</h3>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getTypeColor(report.type)}>
                          {report.type}
                        </Badge>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status === 'generating' && isGenerating === report.id ? (
                            <>
                              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            report.status
                          )}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>Size: {report.size}</span>
                      <span>
                        Last generated: {new Date(report.lastGenerated).toLocaleDateString()}
                      </span>
                      <span>
                        Format: PDF, Excel, CSV
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-col gap-2 min-w-fit">
                  {report.status === 'ready' ? (
                    <>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-primary hover:bg-primary/90 gap-2"
                          onClick={() => handleDownloadReport(report, 'pdf')}
                        >
                          <Download className="h-4 w-4" />
                          PDF
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => handleDownloadReport(report, 'excel')}
                        >
                          <FileSpreadsheet className="h-4 w-4" />
                          Excel
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => handleDownloadReport(report, 'csv')}
                        >
                          <FileText className="h-4 w-4" />
                          CSV
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => handleGenerateReport(report.id)}
                          disabled={isGenerating === report.id}
                        >
                          <RefreshCw className={`h-4 w-4 ${isGenerating === report.id ? 'animate-spin' : ''}`} />
                          Refresh
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90 gap-2"
                      onClick={() => handleGenerateReport(report.id)}
                      disabled={isGenerating === report.id}
                    >
                      {isGenerating === report.id ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4" />
                          Generate Report
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Report Builder */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Custom Report Builder</CardTitle>
          <CardDescription>
            Create a custom report with specific metrics and date ranges
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hiring">Hiring Metrics</SelectItem>
                  <SelectItem value="performance">Job Performance</SelectItem>
                  <SelectItem value="analytics">Advanced Analytics</SelectItem>
                  <SelectItem value="custom">Custom Metrics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 3 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Export Format</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="csv">CSV Data</SelectItem>
                  <SelectItem value="json">JSON Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Download className="h-4 w-4" />
              Generate Custom Report
            </Button>
            <Button variant="outline" className="gap-2">
              <Mail className="h-4 w-4" />
              Schedule Delivery
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}