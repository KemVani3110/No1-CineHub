export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-medium">Total Movies</h3>
          <p className="text-2xl font-bold">1,234</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-medium">Favorites</h3>
          <p className="text-2xl font-bold">56</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-medium">Watchlist</h3>
          <p className="text-2xl font-bold">89</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-medium">Reviews</h3>
          <p className="text-2xl font-bold">23</p>
        </div>
      </div>
    </div>
  )
} 