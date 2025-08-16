import React from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

interface FoundingInfoStepProps {
  data: {
    organizationType: string
    companyType: string
    teamSize: string
    yearEstablished: string
    website: string
    vision: string
  }
  onChange: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function FoundingInfoStep({ data, onChange, onNext, onBack }: FoundingInfoStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (data.organizationType && data.companyType && data.teamSize && data.yearEstablished) {
      onNext()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-card/80 border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Founding Information</CardTitle>
            <CardDescription className="text-muted-foreground">
              Provide details about your company structure and history (Step 2 of 4)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Organization Type */}
              <div className="space-y-2">
                <Label className="text-foreground">Organization Type *</Label>
                <Select value={data.organizationType} onValueChange={(value) => onChange({ ...data, organizationType: value })}>
                  <SelectTrigger className="bg-muted/50 border-border text-foreground">
                    <SelectValue placeholder="Select organization type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="llc">Limited Liability Company (LLC)</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                    <SelectItem value="nonprofit">Non-Profit Organization</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Company Type */}
              <div className="space-y-2">
                <Label className="text-foreground">Company Type *</Label>
                <Select value={data.companyType} onValueChange={(value) => onChange({ ...data, companyType: value })}>
                  <SelectTrigger className="bg-muted/50 border-border text-foreground">
                    <SelectValue placeholder="Select company type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="startup">Startup</SelectItem>
                    <SelectItem value="small-business">Small Business</SelectItem>
                    <SelectItem value="medium-business">Medium Business</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="nonprofit">Non-Profit</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Team Size */}
              <div className="space-y-2">
                <Label className="text-foreground">Team Size *</Label>
                <Select value={data.teamSize} onValueChange={(value) => onChange({ ...data, teamSize: value })}>
                  <SelectTrigger className="bg-muted/50 border-border text-foreground">
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="500+">500+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Year Established */}
              <div className="space-y-2">
                <Label className="text-foreground">Year Established *</Label>
                <Input
                  placeholder="e.g., 2020"
                  value={data.yearEstablished}
                  onChange={(e) => onChange({ ...data, yearEstablished: e.target.value })}
                  required
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label className="text-foreground">Company Website</Label>
                <Input
                  type="url"
                  placeholder="https://yourcompany.com"
                  value={data.website}
                  onChange={(e) => onChange({ ...data, website: e.target.value })}
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Vision */}
              <div className="space-y-2">
                <Label className="text-foreground">Company Vision</Label>
                <Textarea
                  placeholder="Describe your company's vision and long-term goals..."
                  value={data.vision}
                  onChange={(e) => onChange({ ...data, vision: e.target.value })}
                  rows={4}
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <Button type="button" variant="outline" onClick={onBack} className="border-border text-foreground hover:bg-muted">
                  Back
                </Button>
                <Button type="submit">
                  Next: Social Media
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}