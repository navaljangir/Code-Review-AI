import db from "@repo/db"
import { NextRequest, NextResponse } from "next/server"
import { signUpSchema } from "../../lib/actions/signup/schema";
// interface SignUpType{
//     username : string,
//     name : string | undefined,
//     phone : Number ,    
//     password : string | undefined, 
//     email : string | undefined
// }

export async function POST(request :NextRequest){
    const body = await request.json();
    const dataVerified = signUpSchema.safeParse(body)
    if(!dataVerified.success){
        return NextResponse.json({
            "message" : "failed"
        })
    }
    try{
        const isUsernameUnique = await db.user.findFirst({
            where : {
                username : body.username
            }
        })
        return NextResponse.json({"message" : "successfull"} )
    }catch(e){
        return e;
    }
}
