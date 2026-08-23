import Dashboard from './components/Dashboard';
import Landing from './components/Landing';
import { authClient } from './lib/auth-client';

export default function App() {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const user = session?.user;

  return (
    <div className="min-h-screen selection:bg-primary/30">
      {/* Header */}
      <header className="border-b border-border h-16 flex items-center px-6 justify-between bg-background">
        <div className="font-bold tracking-tight">HabitEngine</div>
        {!isSessionLoading && user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">
              {user.name || user.email}
            </span>
            <button
              onClick={() => authClient.signOut()}
              className="text-sm font-medium text-foreground bg-transparent hover:bg-surface-elevated border border-border rounded px-3 py-1.5 transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </header>

      {isSessionLoading ? (
        <main className="max-w-300 mx-auto px-6 py-10 flex flex-col gap-8">
          <div className="border border-border rounded-lg bg-surface py-8 text-center text-muted text-sm">
            Loading...
          </div>
        </main>
      ) : user ? (
        <Dashboard />
      ) : (
        <Landing />
      )}
    </div>
  );
}
