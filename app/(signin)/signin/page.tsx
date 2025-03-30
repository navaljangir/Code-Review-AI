import SigninPage from "@/app/component/SigninPage";
import { authOptions } from "@/app/lib/NEXTAUTH_Func";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (session?.user.id) {
    redirect("/chat");
  }
  return (
    <div className="h-screenbg-opacity-30">
      <SigninPage />
    </div>
  );
}
