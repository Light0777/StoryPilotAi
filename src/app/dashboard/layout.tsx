import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden w-64 shrink-0 md:block">
        <Sidebar />
      </aside>
      <main className="flex-1 overflow-y-auto bg-muted/30">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
