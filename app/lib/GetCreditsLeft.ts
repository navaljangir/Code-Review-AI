'use server'

import { prisma } from "@/db"

export default async function GetCreditsLeft(userId :string){
    try{
        const userCredits = await prisma.user.findUnique({
            where: {
                id : userId
            },
            select : {
                credits :true
            }
        })
        return userCredits?.credits
    }catch(e){
        console.log('error while fetching the credits' , e)
        return 0;
    }
}