import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, MessageSquare, Bot, Clock } from 'lucide-react'

export default function AgentRoomsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Rooms</h1>
          <p className="text-muted-foreground">
            Collaborative AI agent workspaces - Coming Soon!
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
          <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Agent Rooms Coming Soon</CardTitle>
          <CardDescription className="text-base">
            Create collaborative workspaces where AI agents work together on complex tasks using your favorite prompts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg border">
              <Bot className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <h3 className="font-medium">Multi-Agent Teams</h3>
              <p className="text-sm text-muted-foreground">Specialized AI agents</p>
            </div>
            <div className="text-center p-4 rounded-lg border">
              <MessageSquare className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <h3 className="font-medium">Real-time Chat</h3>
              <p className="text-sm text-muted-foreground">Interactive conversations</p>
            </div>
            <div className="text-center p-4 rounded-lg border">
              <Users className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <h3 className="font-medium">Team Collaboration</h3>
              <p className="text-sm text-muted-foreground">Work together with AI</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Planned Room Types:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Research Rooms:</strong> Fact-checking and analysis teams</li>
              <li>• <strong>Creative Rooms:</strong> Writing and design collaborations</li>
              <li>• <strong>Coding Rooms:</strong> Development and debugging sessions</li>
              <li>• <strong>Strategy Rooms:</strong> Business planning and brainstorming</li>
              <li>• <strong>Custom Rooms:</strong> Your own specialized workflows</li>
            </ul>
          </div>

          <div className="text-center">
            <Button disabled>
              Request Early Access
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}