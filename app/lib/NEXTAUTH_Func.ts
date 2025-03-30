/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import {prisma} from '../../db'
import {  NextAuthOptions , DefaultSession , Session} from 'next-auth'
import { JWT } from 'next-auth/jwt'
import redisClient from '@/redis/redisClient'
const adapter = PrismaAdapter(prisma);
declare module 'next-auth' {
    interface Session extends DefaultSession {
      user: {
        id: string;
      } & DefaultSession['user']
    }
  }
const saltRounds = 10;
export const authOptions : NextAuthOptions= {

    providers : [
        CredentialsProvider ({
            name : 'Email' ,
            credentials :{
                email : {label :'email' , type: 'text' , placeholder: 'Enter Your Username', required: true},
                mfatoken : {label : 'Password' , type : 'password' , placeholder : 'Enter Your Password' , required: true}
            },
            async authorize(credentials :  Record<"email" | "mfatoken", string> | undefined){
              const email = credentials?.email || ''
              const user = await prisma.user.findFirst({
                where : {
                  email : email
                }
              })
              if(!user){
                return null
              }
              const mfatoken = credentials?.mfatoken
              const mfaExists = await redisClient.get(email)
              if(!mfaExists || mfaExists !=mfatoken){ 
                return null;
              }
              return {
                id : user?.id,
                email : user?.email, 
                name : user?.name
              }
            }
        }) ,
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
          }),
    ] , 
    secret : process.env.NEXTAUTH_SECRET || 'secret',
    session :{
        strategy : 'jwt'
    },
    callbacks : {
        jwt : ({ token } : {token : JWT})=>{
            // console.log('token' *****9-+*, token)

           return token
       }, 
       
        // signIn : ({ account , token , user , profile} : any)=>{
        //     // console.log('account' , account);
            
        //     // console.log('account' , account);
        //     // console.log('user' , user);
        //     return true
        // }, 
        session :async ({session , token } : {session : Session , token :JWT})=>{
            if(session && session?.user){
                session.user.id = token.sub || '';
            }
            // console.log('session' , session )
            return session
        }
    },
    adapter,
    pages : {
        signIn : '/signin'
    }
} 