'use client'

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { GetChat } from "../lib/GetAllChats";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MessageSquareText, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function ChatList() {
    const session = useSession()
    const router = useRouter()
    const pathname = usePathname()
    const userId = session.data?.user.id
    
    const { data: chats, isLoading } = useQuery({
        queryKey: ['chats', userId],
        queryFn: async () => {
            const userChats = await GetChat(userId!)
            return userChats
        },
        enabled: !!userId,
    })

    return (
        <div className="w-64 h-full bg-gray-900 border-r border-gray-800 backdrop-blur-lg bg-opacity-80 p-4 flex flex-col">
            <div className="mb-6">
                <Button 
                    className="w-full bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white 
                    rounded-lg py-5 transition-all duration-200 hover:shadow-xl hover:scale-[0.98]"
                    onClick={() => router.push('/chat')}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    New Chat
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                {isLoading ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full bg-gray-800 rounded-lg" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-1">
                        {chats?.map(chat => (
                            <div
                                key={chat.id}
                                className={cn(
                                    "group p-3 rounded-lg transition-all cursor-pointer",
                                    "hover:bg-gray-800/60 border border-transparent",
                                    "hover:border-gray-700 flex items-start",
                                    pathname.includes(chat.id) && "bg-gray-800/40 border-gray-700"
                                )}
                                onClick={() => router.push(`/chat/${chat.id}`)}
                            >
                                <MessageSquareText className="h-4 w-4 mt-1 mr-3 text-gray-500" />
                                <div className="flex-1">
                                    <h3 className="text-gray-100 font-medium truncate">
                                        {chat.title || "New Chat"}
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(chat.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {!chats?.length && !isLoading && (
                            <div className="text-center p-4 text-gray-500 text-sm">
                                No previous chats. Start a new conversation!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}