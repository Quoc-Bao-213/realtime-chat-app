interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 transition-all duration-200 sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/70 via-slate-100 to-violet-100/65 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950/40" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-600/20" />
        <div className="absolute left-[30%] top-[70%] h-64 w-64 rounded-full bg-cyan-300/25 blur-3xl dark:bg-cyan-700/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.10),transparent_55%)]" />
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
};

export default Layout;
