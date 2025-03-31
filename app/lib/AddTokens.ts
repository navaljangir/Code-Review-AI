'use server'

import { prisma } from "@/db"

export async function AddToken(tokens : number , userId :string){
    await prisma.user.update({
        data: {
            credits : {
                increment : tokens
            }
        }, where: {
            id : userId
        }
    })
}