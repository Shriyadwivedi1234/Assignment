import React from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { CheckCircle, User, LayoutDashboard } from 'lucide-react'

interface RegistrationCompleteProps {
  onViewProfile: () => void
  onViewDashboard: () => void
}

export function RegistrationComplete({ onViewProfile, onViewDashboard }: RegistrationCompleteProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="bg-card/80 border-border">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-foreground">Registration Complete!</CardTitle>
            <CardDescription className="text-muted-foreground">
              Your company profile has been successfully created and is now ready for use.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground mb-6">
              Welcome to the platform! You can now access your dashboard and manage your company profile.
            </div>

            <div className="grid gap-3">
              <Button 
                onClick={onViewDashboard}
                className="w-full flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                View Dashboard
              </Button>
              
              <Button 
                variant="outline"
                onClick={onViewProfile}
                className="w-full flex items-center gap-2 border-border text-foreground hover:bg-muted"
              >
                <User className="h-4 w-4" />
                View Profile
              </Button>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
              <h4 className="font-medium mb-2 text-foreground">What's Next?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Complete your profile in Settings</li>
                <li>• Explore the dashboard features</li>
                <li>• Connect with candidates and employers</li>
                <li>• Post job opportunities</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}