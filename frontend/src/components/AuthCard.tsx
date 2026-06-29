type AuthCardProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <main className="min-h-screen bg-[#070a12] px-5 py-10 text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.12),transparent_30%)]" />

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/40 lg:grid-cols-[1fr_0.9fr]">
          <section className="hidden border-r border-white/10 bg-[#0b0f19] p-10 lg:block">
            <div className="mb-10">
              <div className="text-3xl font-bold tracking-tight">
                MarketPulse
              </div>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
                AI-powered market intelligence for tracking companies, news
                sentiment, market signals, and risk alerts from one professional
                dashboard.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Live backend-connected dashboard",
                "Company watchlist intelligence",
                "Market signal and risk radar",
                "News-to-insight workflow",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-4 text-sm text-cyan-100"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="p-6 sm:p-8 lg:p-10">
            <div className="mb-8">
              <div className="mb-3 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                Secure Access
              </div>

              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {subtitle}
              </p>
            </div>

            {children}
          </section>
        </div>
      </div>
    </main>
  );
}