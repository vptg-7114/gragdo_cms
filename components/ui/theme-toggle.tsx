"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme-context"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-[50px] md:w-[71px] h-[50px] md:h-[66px] bg-[#f4f3ff] dark:bg-[#2a2a3a] rounded-[20px] hover:bg-[#e8e7ff] dark:hover:bg-[#3a3a4a] transition-colors"
    >
      {theme === "light" ? (
        <Moon className="w-6 h-6 md:w-[33px] md:h-[33px] text-[#7165e1] dark:text-[#9b8ff5]" />
      ) : (
        <Sun className="w-6 h-6 md:w-[33px] md:h-[33px] text-[#7165e1] dark:text-[#9b8ff5]" />
      )}
    </Button>
  )
}