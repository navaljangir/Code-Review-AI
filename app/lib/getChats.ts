'use server'

import { prisma } from "@/db"

export async function GetChat(userId : string){
    const chats = await prisma.chat.findMany({
        where: {
            userId : userId
        }
    })
    return chats
}