import NotFoundContent from "@/components/not-found-content";
import SiteShell from "@/components/site-shell";

export default async function RootNotFound() {
  return (
    <SiteShell>
      <NotFoundContent />
    </SiteShell>
  );
}
