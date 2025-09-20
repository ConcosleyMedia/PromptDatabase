import { createSupabaseServerClient, getUser, getUserProfile } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Navigation } from '@/components/layout/navigation'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const userProfile = await getUserProfile(user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={userProfile} />
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}