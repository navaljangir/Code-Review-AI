import SignUppage from "@/app/component/SignupPage"
import { authOptions } from "@/app/lib/NEXTAUTH_Func"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function Page(){
    const session =await getServerSession(authOptions)
    if(session?.user.id){
        redirect('/')
    }
    return (
    <div className="h-full mx-40">
        <SignUppage/>
    </div>
    )
}