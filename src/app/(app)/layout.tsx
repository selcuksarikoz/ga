import { ActionButtons } from "@/app/components/action-buttons";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  return (
    <div className="container-fluid mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Game Dashboard</h1>
        <ActionButtons />
      </div>
      {children}
    </div>
  );
}
