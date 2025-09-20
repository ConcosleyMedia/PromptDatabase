import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TestTube, Zap, BarChart, Clock } from 'lucide-react'

export default function PromptTestingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prompt Testing</h1>
          <p className="text-muted-foreground">
            Test and compare prompts across different AI models - Coming Soon!
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
          <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
            <TestTube className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">OpenRouter Integration Coming Soon</CardTitle>
          <CardDescription className="text-base">
            Test your prompts across multiple AI models and compare results in real-time.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg border">
              <Zap className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <h3 className="font-medium">Multi-Model Testing</h3>
              <p className="text-sm text-muted-foreground">GPT-4, Claude, Gemini & more</p>
            </div>
            <div className="text-center p-4 rounded-lg border">
              <BarChart className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <h3 className="font-medium">Performance Analytics</h3>
              <p className="text-sm text-muted-foreground">Response quality metrics</p>
            </div>
            <div className="text-center p-4 rounded-lg border">
              <TestTube className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <h3 className="font-medium">A/B Testing</h3>
              <p className="text-sm text-muted-foreground">Compare prompt variations</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Planned Features:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Test prompts across 20+ AI models</li>
              <li>• Response quality scoring and analytics</li>
              <li>• Cost tracking and optimization</li>
              <li>• Export results and comparisons</li>
              <li>• Collaborative testing with teams</li>
            </ul>
          </div>

          <div className="text-center">
            <Button disabled>
              Join Beta Waitlist
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}