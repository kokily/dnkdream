import NotFoundContent from "@/components/site/not-found-content";
import SiteShell from "@/components/layout/site-shell";

export default async function RootNotFound() {
  return (
    <SiteShell>
      <NotFoundContent />
    </SiteShell>
  );
}
