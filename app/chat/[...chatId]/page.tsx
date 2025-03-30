import { ChatWindow } from "@/app/component/ChatForm";
import { getMessages } from "@/app/lib/GetMessages";

export default async function Chats({params} : {params : Promise<{chatId : string}>}){
    const param = await params
    const chatId = param.chatId[0]
    const allMessages  = await getMessages(chatId)
    return <div className="w-full h-full">
        <ChatWindow allMessages={allMessages}/>
    </div>
}