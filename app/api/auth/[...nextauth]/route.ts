import NextAuth  from "next-auth/next";
import { authOptions } from "../../../lib/NEXTAUTH_Func";

const handler= NextAuth(authOptions);

export {handler as GET , handler as POST}

