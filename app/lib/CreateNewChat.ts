'use server'

import { prisma } from "@/db"
import { CreateUserMessage } from "./CreateUserMessage"
import { getAiResponse } from "./GetAiResponse";

export async function CreateNewChat(userId : string , content : string){
    const newChat = await prisma.chat.create({
        data :{
            userId : userId
        }
    })
    await CreateUserMessage(userId , newChat.id , content);
    const aiResponse = await getAiResponse(newChat.id , content , true );
    if(aiResponse.title){
        await prisma.chat.update({
            where : {
                id : newChat.id
            },data : {
                title : aiResponse.title
            }
        })
    }
    return newChat
}