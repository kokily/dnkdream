interface LoginShellProps {
  children: React.ReactNode;
}

export default function LoginShell({ children }: LoginShellProps) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <section className="w-full max-w-sm">
        <h1 className="mb-6 font-display text-2xl tracking-wide">D&K Dreams</h1>
        {children}
      </section>
    </main>
  );
}
