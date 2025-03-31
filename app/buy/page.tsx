import { getServerSession } from "next-auth"
import { authOptions } from "../lib/NEXTAUTH_Func"
import { redirect } from "next/navigation"
import Checkout from "../component/BuyTokens"

export default async function BuyToken(){
    const session = await getServerSession(authOptions)
    if(!session?.user.id){
        redirect('/signin')
    }
    return <div>
        <Checkout/>
    </div>
}