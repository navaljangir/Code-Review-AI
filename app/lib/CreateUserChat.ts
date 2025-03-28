'use server'

import { prisma } from "@/db"

export async function CreateUserChat(chatid : string , content :string){
    try{
        const res = await prisma.message.create({
            data: {
                content, 
                role: 'user', 
                chatId : chatid
            }
        })
        return res
    }catch(e){
        console.log('Error while creating ')
    }
}