import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Upload, X } from 'lucide-react'
// ImageWithFallback component removed - using regular img tags instead

interface CompanyInfoStepProps {
  data: {
    logo?: string
    banner?: string
    companyName: string
    aboutUs: string
  }
  onChange: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function CompanyInfoStep({ data, onChange, onNext, onBack }: CompanyInfoStepProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(data.logo || null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(data.banner || null)

  const handleFileUpload = (type: 'logo' | 'banner', file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (type === 'logo') {
        setLogoPreview(result)
        onChange({ ...data, logo: result })
      } else {
        setBannerPreview(result)
        onChange({ ...data, banner: result })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (data.companyName && data.aboutUs) {
      onNext()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-card/80 border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Company Information</CardTitle>
            <CardDescription className="text-muted-foreground">
              Tell us about your company (Step 1 of 4)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label className="text-foreground">Company Logo</Label>
                <div className="flex items-center gap-4">
                  {logoPreview ? (
                    <div className="relative">
                      <img
                        src={logoPreview}
                        alt="Company Logo"
                        className="w-20 h-20 object-cover rounded-lg border border-border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => {
                          setLogoPreview(null)
                          onChange({ ...data, logo: '' })
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload('logo', file)
                      }}
                      className="hidden"
                      id="logo-upload"
                    />
                    <Label htmlFor="logo-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" className="pointer-events-none border-border text-foreground">
                        Upload Logo
                      </Button>
                    </Label>
                  </div>
                </div>
              </div>

              {/* Banner Upload */}
              <div className="space-y-2">
                <Label className="text-foreground">Company Banner</Label>
                <div className="space-y-4">
                  {bannerPreview ? (
                    <div className="relative">
                      <img
                        src={bannerPreview}
                        alt="Company Banner"
                        className="w-full h-32 object-cover rounded-lg border border-border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => {
                          setBannerPreview(null)
                          onChange({ ...data, banner: '' })
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Upload company banner</p>
                      </div>
                    </div>
                  )}
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload('banner', file)
                      }}
                      className="hidden"
                      id="banner-upload"
                    />
                    <Label htmlFor="banner-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" className="pointer-events-none border-border text-foreground">
                        Upload Banner
                      </Button>
                    </Label>
                  </div>
                </div>
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="company-name" className="text-foreground">Company Name *</Label>
                <Input
                  id="company-name"
                  placeholder="Your Company Ltd."
                  value={data.companyName}
                  onChange={(e) => onChange({ ...data, companyName: e.target.value })}
                  required
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* About Us */}
              <div className="space-y-2">
                <Label htmlFor="about-us" className="text-foreground">About Us *</Label>
                <Textarea
                  id="about-us"
                  placeholder="Tell us about your company, its mission, and what makes it unique..."
                  value={data.aboutUs}
                  onChange={(e) => onChange({ ...data, aboutUs: e.target.value })}
                  rows={4}
                  required
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <Button type="button" variant="outline" onClick={onBack} className="border-border text-foreground hover:bg-muted">
                  Back
                </Button>
                <Button type="submit">
                  Next: Founding Information
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}