import { TopNav } from '@/components/layout/top-nav'
import { BottomNav } from '@/components/layout/bottom-nav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <TopNav />
      <main className="pt-16 pb-24 lg:pb-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
