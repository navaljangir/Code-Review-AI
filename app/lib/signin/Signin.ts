"use server";
import bcrypt from "bcrypt";
import { prisma } from "@/db";

export async function signInCall(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return {
      success: false,
      message: "Invalid Email/Pasword",
    };
  }
  const userPassword = user.password || "";
  const verifyPassword = await bcrypt.compare(password, userPassword);
  if (!verifyPassword) {
    return {
        success: false,
        message : 'Invalid Email/Password'
    };
  }
  return {
    success: true, 
    user: {
        id : user.id || '',
        email : user.email || '',
        name : user.name || ''
    },
    message: 'Signed In'
  }
}
