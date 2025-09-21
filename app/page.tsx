export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          🎯 Prompt Platform
        </h1>
        <p className="text-xl text-gray-600">
          Your AI prompt database is loading...
        </p>
        <div className="space-y-2">
          <a
            href="/health"
            className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Health Check
          </a>
          <br />
          <a
            href="/login"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login with Whop
          </a>
        </div>
      </div>
    </div>
  )
}
