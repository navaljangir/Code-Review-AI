/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"
import {prisma as db} from "../../../db/index"
import bcrypt from 'bcrypt'
import { signUpSchema } from "./schema"

import { SignUpType } from "./types"
export default async function SignUpCall({username , name , email  , password } : SignUpType){
    const zodValidation = signUpSchema.safeParse({username ,email , name , password });
    let zodMessage = '';
     zodValidation.error?.issues.forEach((obj)=> {
        zodMessage = zodMessage + obj.message +'. ' 
    });
    if(zodValidation.error){
        return {
            success : false, 
            Message : zodMessage
        }
    }
    try{
        const usernameExists  = await db.user.findUnique({
            where : {
                username : username
            }
        })
        const emailExists = await db.user.findUnique({
            where :{
                email : email,
            }
        })
        if(usernameExists){
            return {
                success : false, 
                Message: 'Username Already Exist'
            };
        }
        if(emailExists){
            return {
                success : false , 
                Message : 'Email Already Exist'
            };
        }
        // const userId = 
        const genSalt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , genSalt); 
        const userCreated = await db.user.create({
            data: {
                username : username , 
                email : email ,
                name : name ,
                password : hashedPassword,
            }
        })
        if(!userCreated){
            return {
                success: false , 
                Message: 'Something Went Wrong'
            }
        }else{  
            return {
                success:  true, 
                Message: 'User Created Successfull'
            }
        }
    }catch(e ){
        return {
            success : false , 
            Message : 'Error While Creating a account'
        }
    }
}