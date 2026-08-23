import { Flame, Target, TrendingUp } from 'lucide-react';
import AuthPanel from './AuthPanel';

const FEATURES = [
  {
    icon: Flame,
    title: 'Streaks that stick',
    desc: 'Build momentum one check-in at a time.',
  },
  {
    icon: TrendingUp,
    title: 'Trends at a glance',
    desc: 'Spot patterns across days and weeks.',
  },
  {
    icon: Target,
    title: 'Daily targets',
    desc: 'Small goals, measurable progress.',
  },
] as const;

export default function Landing() {
  return (
    <main className="relative overflow-hidden">
      {/* Ornaments */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="dot-grid absolute inset-0 opacity-50" />
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-300 items-center px-6 py-14 lg:py-10">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[1fr_400px] lg:gap-20">
          {/* Left — branding */}
          <section className="flex flex-col gap-8">
            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Build habits
              <br />
              that{' '}
              <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                stick.
              </span>
            </h1>

            <p className="max-w-md text-[15px] leading-relaxed text-muted">
              Track daily progress, spot your trends, and keep streaks alive —
              all in one focused dashboard designed for consistency.
            </p>

            <ul className="flex flex-col gap-4">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-primary">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-[13px] text-muted">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="pt-4 font-mono text-xs text-muted">
              © 2026 Akbar Widya. All rights reserved.
            </p>
          </section>

          {/* Right — auth card */}
          <section className="w-full rounded-xl border border-border bg-surface p-7 shadow-2xl shadow-black/50 sm:p-8">
            <AuthPanel />
          </section>
        </div>
      </div>
    </main>
  );
}
