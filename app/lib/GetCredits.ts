'use server'

import { prisma } from "@/db"

export async function GetCredits(userId : string ){
    if(!userId){
        return 0
    }
    const creditsLeft = await prisma.user.findUnique({
        where: {
            id :userId
        },
        select : {
            credits : true
        }
    })
    return creditsLeft?.credits
}