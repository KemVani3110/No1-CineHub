export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Notifications</label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Email notifications
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Push notifications
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 