import { useState } from 'react';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import { authClient } from './lib/auth-client';

export default function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const user = session?.user;

  return (
    <div className="min-h-screen selection:bg-primary/30">
      {/* Header */}
      <header className="border-b border-border h-16 flex items-center px-6 justify-between bg-background">
        <div className="font-bold tracking-tight">HabitEngine</div>
        {isSessionLoading ? null : user ? (
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
        ) : (
          <button
            onClick={() => setIsAuthOpen(true)}
            className="bg-primary hover:bg-primary-hover text-foreground px-4 py-2 rounded transition-colors font-medium text-sm"
          >
            Log In
          </button>
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
        <main className="max-w-300 mx-auto px-6 py-10 flex flex-col gap-8">
          {/* Welcome screen for unauthenticated visitors */}
          <section className="border border-border rounded-lg bg-surface px-8 py-16 text-center flex flex-col items-center gap-6">
            <h1 className="text-[40px] font-semibold tracking-tight leading-tight max-w-xl">
              Build habits that stick.
            </h1>
            <p className="text-muted text-[15px] max-w-md">
              Track daily progress, spot your trends, and keep streaks alive.
              Sign in to start building your routine.
            </p>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="bg-primary hover:bg-primary-hover text-foreground px-6 py-2.5 rounded transition-colors font-medium text-sm"
            >
              Log In to Get Started
            </button>
          </section>
        </main>
      )}

      {isAuthOpen && <AuthModal onClose={() => setIsAuthOpen(false)} />}
    </div>
  );
}
