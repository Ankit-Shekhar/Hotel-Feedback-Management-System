import { Sidebar } from '../../components/layout'

function DashboardPage() {
  return (
    <main className="flex min-h-[calc(100vh-132px)] bg-slate-50">
      <Sidebar />
      <section className="flex-1 p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">Admin dashboard widgets and analytics will be added here.</p>
      </section>
    </main>
  )
}

export default DashboardPage
