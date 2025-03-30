'use server'

import { prisma } from "@/db"
import { revalidatePath } from "next/cache"
export async function CreateUserChat(userId : string | undefined , chatid : string , content :string){
    
    try{
        await prisma.message.create({
            data: {
                content, 
                role: 'user', 
                chatId : chatid
            }
        })
    }catch(e){
        console.log('Error while creating ' , e)
    }finally{
        revalidatePath(`/chat/${chatid}`)
    }
}