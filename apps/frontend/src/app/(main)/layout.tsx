import { Sidebar } from "@/components";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <main className="flex-1 ml-[88px] p-8">{children}</main>
    </div>
  );
}
