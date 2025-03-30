'use client'

import { Input } from "@/components/ui/input";
import { ArrowUp, LoaderIcon } from "lucide-react";
import { useRef } from "react";
import { CreateNewChat } from "../lib/CreateNewChat";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export function ChatInterface() {
  const userinput = useRef('');
  const session = useSession();
  const userId = session.data?.user.id
  const router = useRouter()
  const queryClient= useQueryClient()
  const {mutateAsync : handleSubmit , isPending} = useMutation({
      mutationFn : async()=>{
        console.log('userinput', userinput.current)
        const newChat = await CreateNewChat(userId! , userinput.current)
        userinput.current = ''
        router.push(`/chat/${newChat.id}`)
      },
      onSuccess : ()=>{
        queryClient.invalidateQueries({queryKey : ['chats' , userId]})
      }
  })


  return (
    <div className="h-full flex justify-center items-center bg-gradient-to-br p-6 text-black">
      <div className="w-full max-w-2xl space-y-4">
        <div className="flex items-center gap-2 shadow-lg rounded-2xl bg-white p-2">
          <Input
            type="text"
            placeholder="Enter your code to start working..."
            className="flex-1 py-6 rounded-xl border-0 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
            onChange={(e) => userinput.current=e.target.value}
            onKeyDown={(e) =>{
              if(!isPending){
                e.key === 'Enter' && handleSubmit()
              }
            }}
          />
          <Button
            onClick={()=> handleSubmit()}
            size="lg"
            className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-lg"
            disabled={isPending}
          >
            {isPending && <LoaderIcon className="animate-spin"/>}
           {!isPending && <ArrowUp className="h-6 w-6 text-white" />}
          </Button>
        </div>
        <p className="text-sm text-center text-gray-500">
          Press Enter or click the arrow to submit
        </p>
      </div>
    </div>
  );
}