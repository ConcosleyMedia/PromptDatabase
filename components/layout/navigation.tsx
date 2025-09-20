'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Image,
  Video,
  TestTube,
  Users
} from 'lucide-react'

const tabs = [
  {
    value: 'prompts',
    label: 'Text Prompts',
    href: '/dashboard/prompts',
    icon: FileText,
    implemented: true
  },
  {
    value: 'images',
    label: 'Image Prompts',
    href: '/dashboard/images',
    icon: Image,
    implemented: true
  },
  {
    value: 'videos',
    label: 'Video Prompts',
    href: '/dashboard/videos',
    icon: Video,
    implemented: false
  },
  {
    value: 'test',
    label: 'Prompt Testing',
    href: '/dashboard/test',
    icon: TestTube,
    implemented: false
  },
  {
    value: 'rooms',
    label: 'Agent Rooms',
    href: '/dashboard/rooms',
    icon: Users,
    implemented: false
  }
]

export function Navigation() {
  const pathname = usePathname()

  const getCurrentTab = () => {
    const currentTab = tabs.find(tab => pathname.startsWith(tab.href))
    return currentTab?.value || 'prompts'
  }

  return (
    <div className="border-b bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs value={getCurrentTab()} className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-14 bg-transparent border-0 p-0">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = pathname.startsWith(tab.href)

              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  asChild
                  className={cn(
                    "relative h-14 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-3 font-medium text-muted-foreground transition-none",
                    "data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none",
                    !tab.implemented && "cursor-not-allowed opacity-50"
                  )}
                >
                  {tab.implemented ? (
                    <Link href={tab.href} className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                    </Link>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                      <Badge variant="secondary" className="text-xs">
                        Soon
                      </Badge>
                    </div>
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}