export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 text-center p-4">
      {children}
    </main>
  );
}
