import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Separator } from './ui/separator'
import { ArrowLeft, Building2, Users, Globe, MapPin } from 'lucide-react'
import { CompanyInfoStep } from './registration/CompanyInfoStep'
import { FoundingInfoStep } from './registration/FoundingInfoStep'
import { SocialInfoStep } from './registration/SocialInfoStep'
import { ContactInfoStep } from './registration/ContactInfoStep'
import { ThemeToggle } from './ThemeToggle'

interface SettingsProps {
  companyData: any
  onSave: (data: any) => void
  onBack: () => void
}

export function Settings({ companyData, onSave, onBack }: SettingsProps) {
  const [editingData, setEditingData] = useState(companyData)
  const [hasChanges, setHasChanges] = useState(false)

  const handleDataChange = (section: string, data: any) => {
    setEditingData((prev: any) => ({
      ...prev,
      [section]: data
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    onSave(editingData)
    setHasChanges(false)
  }

  const handleDiscard = () => {
    setEditingData(companyData)
    setHasChanges(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center space-x-4">
            <Building2 className="h-6 w-6 text-primary" />
            <h1 className="font-semibold">Settings</h1>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
            {hasChanges && (
              <>
                <Button variant="outline" onClick={handleDiscard}>
                  Discard Changes
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <h2 className="text-3xl font-semibold">Company Settings</h2>
          <p className="text-muted-foreground">
            Manage your company profile and account settings
          </p>
        </div>

        <Tabs defaultValue="company" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Company Info
            </TabsTrigger>
            <TabsTrigger value="founding" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Founding Info
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Social Media
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Contact Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Update your company's basic information, logo, and description
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CompanyInfoStep
                  data={editingData.companyInfo || {}}
                  onChange={(data) => handleDataChange('companyInfo', data)}
                  onNext={() => {}}
                  onBack={() => {}}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="founding">
            <Card>
              <CardHeader>
                <CardTitle>Founding Information</CardTitle>
                <CardDescription>
                  Manage your company's organizational structure and history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FoundingInfoStep
                  data={editingData.foundingInfo || {}}
                  onChange={(data) => handleDataChange('foundingInfo', data)}
                  onNext={() => {}}
                  onBack={() => {}}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Profiles</CardTitle>
                <CardDescription>
                  Connect and manage your social media presence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SocialInfoStep
                  data={editingData.socialInfo || {}}
                  onChange={(data) => handleDataChange('socialInfo', data)}
                  onNext={() => {}}
                  onBack={() => {}}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Update your business address and contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactInfoStep
                  data={editingData.contactInfo || {}}
                  onChange={(data) => handleDataChange('contactInfo', data)}
                  onNext={() => {}}
                  onBack={() => {}}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator className="my-8" />

        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={() => alert('Account deletion would be handled here')}>
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}