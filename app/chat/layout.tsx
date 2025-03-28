import { ReactNode } from "react";
import { ChatList } from "../component/SideBarComp";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full pt-[67px]">
      <div className="fixed left-0 top-[67px] h-full">
        <ChatList />
      </div>
      <div className="w-full h-full ml-60">{children}</div>
    </div>
  );
}
