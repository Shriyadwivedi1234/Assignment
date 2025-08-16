import React from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Globe } from 'lucide-react'

interface SocialInfoStepProps {
  data: {
    website?: string
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
    youtube?: string
  }
  onChange: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function SocialInfoStep({ data, onChange, onNext, onBack }: SocialInfoStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  const socialPlatforms = [
    {
      key: 'website',
      label: 'Website',
      icon: Globe,
      placeholder: 'https://www.yourcompany.com'
    },
    {
      key: 'facebook',
      label: 'Facebook',
      icon: Facebook,
      placeholder: 'https://facebook.com/yourcompany'
    },
    {
      key: 'twitter',
      label: 'Twitter',
      icon: Twitter,
      placeholder: 'https://twitter.com/yourcompany'
    },
    {
      key: 'instagram',
      label: 'Instagram',
      icon: Instagram,
      placeholder: 'https://instagram.com/yourcompany'
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      icon: Linkedin,
      placeholder: 'https://linkedin.com/company/yourcompany'
    },
    {
      key: 'youtube',
      label: 'YouTube',
      icon: Youtube,
      placeholder: 'https://youtube.com/c/yourcompany'
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-card/80 border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Social Media & Online Presence</CardTitle>
            <CardDescription className="text-muted-foreground">
              Connect your company's social media accounts (Step 3 of 4)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Website */}
              <div className="space-y-2">
                <Label className="text-foreground">Company Website</Label>
                <Input
                  type="url"
                  placeholder="https://yourcompany.com"
                  value={data.website || ''}
                  onChange={(e) => onChange({ ...data, website: e.target.value })}
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Facebook */}
              <div className="space-y-2">
                <Label className="text-foreground">Facebook Page</Label>
                <Input
                  type="url"
                  placeholder="https://facebook.com/yourcompany"
                  value={data.facebook || ''}
                  onChange={(e) => onChange({ ...data, facebook: e.target.value })}
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Twitter */}
              <div className="space-y-2">
                <Label className="text-foreground">Twitter/X Profile</Label>
                <Input
                  type="url"
                  placeholder="https://twitter.com/yourcompany"
                  value={data.twitter || ''}
                  onChange={(e) => onChange({ ...data, twitter: e.target.value })}
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Instagram */}
              <div className="space-y-2">
                <Label className="text-foreground">Instagram Profile</Label>
                <Input
                  type="url"
                  placeholder="https://instagram.com/yourcompany"
                  value={data.instagram || ''}
                  onChange={(e) => onChange({ ...data, instagram: e.target.value })}
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* LinkedIn */}
              <div className="space-y-2">
                <Label className="text-foreground">LinkedIn Company Page</Label>
                <Input
                  type="url"
                  placeholder="https://linkedin.com/company/yourcompany"
                  value={data.linkedin || ''}
                  onChange={(e) => onChange({ ...data, linkedin: e.target.value })}
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* YouTube */}
              <div className="space-y-2">
                <Label className="text-foreground">YouTube Channel</Label>
                <Input
                  type="url"
                  placeholder="https://youtube.com/@yourcompany"
                  value={data.youtube || ''}
                  onChange={(e) => onChange({ ...data, youtube: e.target.value })}
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <Button type="button" variant="outline" onClick={onBack} className="border-border text-foreground hover:bg-muted">
                  Back
                </Button>
                <Button type="submit">
                  Next: Contact Information
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}