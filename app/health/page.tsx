export default function HealthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">✅ App is Running!</h1>
        <p className="text-gray-600 mb-4">Next.js application is working correctly</p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>Node.js: {process.version}</p>
          <p>Environment: {process.env.NODE_ENV}</p>
          <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configured' : '❌ Missing'}</p>
        </div>
        <div className="mt-6">
          <a href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}