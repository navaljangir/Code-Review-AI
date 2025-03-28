'use server'

import { prisma } from "@/db"

export async function getMessages(chatId : string){
    console.log('chatid' , chatId)
    if(!chatId){
        return []
    }
    try{
        const chat = await prisma.chat.findUnique({
            where : {
                id : chatId
            } ,
            include : {
                Messages : true
            }
        })
        return chat?.Messages
    }catch(e){
        console.log('Error while fetching chat messages' , e)
        return []
    }
}