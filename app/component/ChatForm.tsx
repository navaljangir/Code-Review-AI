'use client'

import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useOptimistic, useState } from "react";
import { getMessages } from "../lib/GetMessages";
import { MessageType } from "../lib/types/chatTypes";
import { randomBytes } from "crypto";

export function ChatWindow() {
    const params = useParams()
    const chatId = params.chatId[0]
    const [input, setInput] = useState('');
   const {data: allMessages} =  useQuery({
      queryKey : ['messages' , chatId],
      queryFn : async()=>{
        const initialMessages = await getMessages(chatId as string)
        return initialMessages
      }
    })
    const [messages, addOptimisticMessages] = useOptimistic(
      allMessages ?? [] , (state , newMessage : MessageType) => [...state , newMessage]
    );
    const {mutateAsync : createMessage} = useMutation({
      mutationFn : async()=>{
        const messageId = randomBytes(16).toString('hex')
        console.log('essageid' , messageId)
      }
    })
    return (
      <div className="flex-1 p-4 h-full flex flex-col w-full">
        <div className="flex-1 overflow-auto mb-4 space-y-4 w-full pl-5">
          {messages && messages.map(message => (
            <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`} key={message.id}>
            <div
              key={message.id}
              className={`py-2 px-4 rounded-lg ${message.role === 'user' ? 'bg-black/30 w-[400px] rounded-2xl text-white' : 'border text-white mr-8'}`}
            >
              {message.code && (
                <pre className="text-white">
                  <code>{message.code}</code>
                </pre>
              )}
              {message.content && <p>{message.content}</p>}
            </div>
          </div>
          
          ))}
        </div>
        
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            setInput('');
          }}
          className="flex gap-2 items-center mx-auto w-[800px]"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border rounded bg-transparent text-white"
            placeholder="Paste your code or ask a question..."
            rows={2}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded h-fit"
            onClick={()=> createMessage()}
          >
            Send
          </button>
        </form>
      </div>
    );
  }