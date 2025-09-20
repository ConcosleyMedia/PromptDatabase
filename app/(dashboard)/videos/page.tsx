import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Video, Clock, Sparkles } from 'lucide-react'

export default function VideoPromptsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Video Prompts</h1>
          <p className="text-muted-foreground">
            Create amazing videos with AI - Coming Soon!
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          <span>Coming Soon</span>
        </Badge>
      </div>

      {/* Coming Soon Card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
            <Video className="h-8 w-8 text-purple-600" />
          </div>
          <CardTitle className="text-2xl">Video Prompts Coming Soon</CardTitle>
          <CardDescription className="text-base">
            We're working on bringing you the best video generation prompts for platforms like Runway, Pika Labs, and more.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg border">
              <Sparkles className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
              <h3 className="font-medium">Multiple Platforms</h3>
              <p className="text-sm text-muted-foreground">Runway, Pika, Stable Video</p>
            </div>
            <div className="text-center p-4 rounded-lg border">
              <Video className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <h3 className="font-medium">Style Categories</h3>
              <p className="text-sm text-muted-foreground">Animation, Cinematic, Abstract</p>
            </div>
            <div className="text-center p-4 rounded-lg border">
              <Clock className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <h3 className="font-medium">Coming Q2 2024</h3>
              <p className="text-sm text-muted-foreground">Beta access available</p>
            </div>
          </div>

          <div className="text-center">
            <Button disabled>
              Get Notified When Available
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}