import SiteHeader from "@/components/layout/site-header";
import { auth } from "@/auth";

export default async function WriteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader isAdmin={!!session?.user} />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
