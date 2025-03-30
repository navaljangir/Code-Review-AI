import { ReactNode } from "react";
import { ChatList } from "../component/SideBarComp";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full pt-[67px] gap-4">
      <div className="fixed left-0 top-[67px] h-full">
        <ChatList />
      </div>
      <div className="w-full h-full ml-[270px]">{children}</div>
    </div>
  );
}
