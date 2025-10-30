// import { auth } from "@/server/auth";
// import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // i had to disable, oauth2 doesnt work very well on the production
  // const session = await auth();
  // if (!session) {
  //   redirect("/");
  // }

  return <div className="container-fluid mx-auto p-4">{children}</div>;
}
