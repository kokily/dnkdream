import { auth } from "@/auth";
import SiteHeader from "@/components/layout/site-header";

interface WriteShellProps {
  children: React.ReactNode;
}

export default async function WriteShell({ children }: WriteShellProps) {
  const session = await auth();

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <SiteHeader isAdmin={!!session?.user} />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
