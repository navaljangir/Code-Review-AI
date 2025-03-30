import { ReactNode } from "react";
import { ChatList } from "../component/SideBarComp";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/NEXTAUTH_Func";
import { redirect } from "next/navigation";

export default async function ChatLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)
  if(!session?.user.id){
    redirect('/signin')
  }
  return (
    <div className="flex h-full pt-[67px] gap-4 bg-black/90">
      <div className="fixed left-0 top-[67px] h-full">
        <ChatList />
      </div>
      <div className="w-full h-full ml-[270px]">{children}</div>
    </div>
  );
}
