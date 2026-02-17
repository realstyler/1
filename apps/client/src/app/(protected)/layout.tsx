import { UserDTO } from "@/auth/auth.dto";
import InitUser from "@/components/providers/InitUser";
import createSSRApi from "@/lib/api.ssr";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: UserDTO;

  try {
    const api = await createSSRApi();
    const res = await api.get("/api/auth/me");
    user = res.data;
  } catch {
    redirect("/login");
  }

  return <InitUser user={user}>{children}</InitUser>;
}
