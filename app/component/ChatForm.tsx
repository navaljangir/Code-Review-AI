"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { startTransition, useOptimistic, useRef, useEffect } from "react";
import { MessageType } from "../lib/types/chatTypes";
import { CreateUserMessage } from "../lib/CreateUserMessage";
import { useSession } from "next-auth/react";
import { getAiResponse } from "../lib/GetAiResponse";
import SyntaxHighlighter from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { CreditsLeftComp } from "./CreditsLeft";

export function ChatWindow({
  allMessages,
}: {
  allMessages: MessageType[] | undefined;
}) {
  const params = useParams();
  const chatId = params.chatId[0];
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const content = useRef("");
  const session = useSession();
  const queryClient=  useQueryClient()
  const userId = session.data?.user.id;
  const [messages, addOptimisticMessages] = useOptimistic(
    allMessages ?? [],
    (state, newMessage: MessageType) => [...state, newMessage]
  );
  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  const { mutateAsync: createMessage, isPending } = useMutation({
    mutationFn: async () => {
      startTransition(() => {
        addOptimisticMessages({
          id: Math.random().toString() as string,
          chatId: chatId,
          content: content.current,
          createdAt: new Date(),
          role: "user",
          code: null,
          codeLanguage: null,
        });
      });
      const chatCreated = await CreateUserMessage(userId!, chatId, content.current);
      if (chatCreated && chatCreated.success) {
        const res = await getAiResponse(chatId, content.current);
        if (res && res.success) {
          startTransition(() => {
            if (res && res.data) {
              addOptimisticMessages(res.data);
            }
          });
        }
      }
    },
    onSuccess : ()=>{
        queryClient.invalidateQueries({queryKey : ['creditsleft' , userId]})
    }
  });

  return (
    <div className="flex flex-col h-full bg-gray-900/95 backdrop-blur-lg rounded-xl border border-gray-700 overflow-hidden">
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 "
      >
        {messages &&
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] lg:max-w-[60%] p-4 rounded-2xl ${
                  message.role === "user"
                    ? "bg-blue-600 text-white ml-12"
                    : "bg-gray-800/60 text-gray-100 mr-12 border border-gray-700"
                }`}
              >
                {message.code && (
                  <pre className="overflow-x-auto p-2 bg-black/40 rounded-lg text-wrap">
                    <SyntaxHighlighter language="javascript" style={darcula}>
                      {message.code}
                    </SyntaxHighlighter>
                  </pre>
                )}
                {message.content && (
                  <pre className="text-wrap">
                    <p className="text-gray-100 leading-relaxed">
                      {message.content}
                    </p>
                  </pre>
                )}
              </div>
            </div>
          ))}
      </div>

      <form
        action={async () => {
          await createMessage();
        }}
        className="border-t border-gray-700 p-4"
      >
        <div className="flex gap-3 items-center max-w-4xl mx-auto">
          <textarea
            onChange={(e) => (content.current = e.target.value)}
            className="flex-1 p-3 bg-gray-800/60 text-gray-100 rounded-xl border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 resize-none transition-all"
            placeholder="Paste your code or ask a question..."
            rows={2}
            name="userinput"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-600 text-white p-3 rounded-xl font-medium transition-colors duration-200 transform hover:scale-105 active:scale-95"
            disabled={isPending}
          >
            {isPending ? "Sending..." : "Send"}
          </button>
          <div className="text-xs text-white flex gap-1">
            Credits Left : <CreditsLeftComp/>
          </div>
        </div>
      </form>
    </div>
  );
}
