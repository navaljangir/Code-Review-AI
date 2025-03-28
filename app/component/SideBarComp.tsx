'use client'

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { GetChat } from "../lib/getChats";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function ChatList() {
    const session = useSession()
    const router= useRouter()
    const userId = session.data?.user.id
    const {data : chats} = useQuery({
        queryKey : ['chats' , userId],
        queryFn : async()=>{
            const userChats = GetChat(userId!)
            console.log(userChats)
            return userChats
        }, 
        enabled: !!userId,
    })
    return (
      <div className="w-64 bg-black/50 p-4 h-full">
        <Button 
          className="w-full bg-blue-500 text-white p-2 rounded mb-4"
        >
          New Chat
        </Button>
        <div className="space-y-2">
          {chats && chats.map(chat => (
            <div 
              key={chat.id}
              className="p-2 hover:bg-gray-800 rounded cursor-pointer"
              onClick={()=> router.push(`/chat/${chat.id}`)}
            >
              <h3 className="font-medium text-white">{chat.title}</h3>
              <p className="text-white text-xs">
                {new Date(chat.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  } 