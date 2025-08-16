import React from 'react'
import { Button } from './ui/button'
import { Moon } from 'lucide-react'

export function ThemeToggle() {
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled
      className="h-8 w-8 p-0 opacity-50 cursor-not-allowed"
      title="Dark theme is enforced"
    >
      <Moon className="h-4 w-4" />
      <span className="sr-only">Dark theme enforced</span>
    </Button>
  )
}