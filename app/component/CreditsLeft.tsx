'use client'

import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { GetCredits } from "../lib/GetCredits"

export function CreditsLeftComp(){
    const session = useSession()
    const userId = session.data?.user.id
    const {data : credits} = useQuery({
        queryKey : ['creditsleft' , userId],
        queryFn : async()=>{
            const getCredits = await GetCredits(userId!);
            return getCredits
        } ,
        enabled : !!userId
    })
        return <div>
             {credits ? credits : 0}
        </div>
}