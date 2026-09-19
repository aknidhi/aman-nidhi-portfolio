export default function Loading() {
  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <div className="container flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="h-8 w-8 animate-spin rounded-full border border-white/10 border-t-white/70" />

          <p className="text-xs uppercase tracking-[0.2em] text-white/30">
            Loading
          </p>
        </div>
      </div>
    </main>
  );
}