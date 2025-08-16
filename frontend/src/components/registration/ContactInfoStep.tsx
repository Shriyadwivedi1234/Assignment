import React from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { MapPin, Phone, Mail } from 'lucide-react'

interface ContactInfoStepProps {
  data: {
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
  onChange: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function ContactInfoStep({ data, onChange, onNext, onBack }: ContactInfoStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (data.address && data.city && data.country && data.phone && data.email) {
      onNext()
    }
  }

  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Germany',
    'France',
    'Australia',
    'India',
    'China',
    'Japan',
    'Brazil',
    'Other'
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-card/80 border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Contact Information</CardTitle>
            <CardDescription className="text-muted-foreground">
              Provide your company's contact details (Step 4 of 4)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Address Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-medium text-foreground">Business Address</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-foreground">Street Address *</Label>
                  <Input
                    id="address"
                    placeholder="123 Business Street"
                    value={data.address}
                    onChange={(e) => onChange({ ...data, address: e.target.value })}
                    required
                    className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-foreground">City *</Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      value={data.city}
                      onChange={(e) => onChange({ ...data, city: e.target.value })}
                      required
                      className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-foreground">State/Province</Label>
                    <Input
                      id="state"
                      placeholder="NY"
                      value={data.state}
                      onChange={(e) => onChange({ ...data, state: e.target.value })}
                      className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="text-foreground">ZIP/Postal Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="10001"
                      value={data.zipCode}
                      onChange={(e) => onChange({ ...data, zipCode: e.target.value })}
                      className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-foreground">Country *</Label>
                    <Input
                      id="country"
                      placeholder="United States"
                      value={data.country}
                      onChange={(e) => onChange({ ...data, country: e.target.value })}
                      required
                      className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Phone className="h-5 w-5 text-primary" />
                  <h3 className="font-medium text-foreground">Contact Details</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={data.phone}
                      onChange={(e) => onChange({ ...data, phone: e.target.value })}
                      required
                      className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="contact@company.com"
                      value={data.email}
                      onChange={(e) => onChange({ ...data, email: e.target.value })}
                      required
                      className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson" className="text-foreground">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      placeholder="John Doe"
                      value={data.contactPerson}
                      onChange={(e) => onChange({ ...data, contactPerson: e.target.value })}
                      className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactTitle" className="text-foreground">Contact Title</Label>
                    <Input
                      id="contactTitle"
                      placeholder="CEO, Manager, etc."
                      value={data.contactTitle}
                      onChange={(e) => onChange({ ...data, contactTitle: e.target.value })}
                      className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <Button type="button" variant="outline" onClick={onBack} className="border-border text-foreground hover:bg-muted">
                  Back
                </Button>
                <Button type="submit">
                  Complete Registration
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}