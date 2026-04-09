import { Card } from '../../components/ui'

function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Card>
        <h1 className="text-2xl font-semibold text-slate-900">Home Page</h1>
        <p className="mt-2 text-slate-600">Public landing page for hotels and recent feedback highlights.</p>
      </Card>
    </main>
  )
}

export default HomePage
