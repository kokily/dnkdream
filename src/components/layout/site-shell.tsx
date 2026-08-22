import SiteHeader from "@/components/layout/site-header";
import { auth } from "@/auth";

export default async function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
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
