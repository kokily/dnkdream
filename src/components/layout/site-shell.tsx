import { auth } from "@/auth";
import SiteHeader from "@/components/layout/site-header";

interface SiteShellProps {
  children: React.ReactNode;
}

export default async function SiteShell({ children }: SiteShellProps) {
  const session = await auth();

  return (
    <>
      <SiteHeader isAdmin={!!session?.user} />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        {children}
      </main>
    </>
  );
}
