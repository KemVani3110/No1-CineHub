export default function FavoritesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Favorites</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Favorite movie cards will be added here */}
        <div className="rounded-lg border bg-card p-4">
          <div className="aspect-[2/3] w-full rounded-lg bg-muted" />
          <h3 className="mt-2 font-semibold">Favorite Movie</h3>
          <p className="text-sm text-muted-foreground">2024 • Action</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="aspect-[2/3] w-full rounded-lg bg-muted" />
          <h3 className="mt-2 font-semibold">Favorite Movie</h3>
          <p className="text-sm text-muted-foreground">2024 • Action</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="aspect-[2/3] w-full rounded-lg bg-muted" />
          <h3 className="mt-2 font-semibold">Favorite Movie</h3>
          <p className="text-sm text-muted-foreground">2024 • Action</p>
        </div>
      </div>
    </div>
  )
} 