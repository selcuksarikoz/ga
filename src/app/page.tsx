import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/server/auth";

export default async function MainPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col items-center justify-center gap-12 px-4 py-16 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Game Application
        </h1>
        <p className="text-lg text-gray-400">
          Welcome to the best place to track and manage your game library.
        </p>
        <Link
          href="/api/auth/signin"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          Sign In
        </Link>
      </div>
    </main>
  );
}
