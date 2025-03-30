"use server";

import { prisma } from "@/db";
import { revalidatePath } from "next/cache";
import GetCreditsLeft from "./GetCreditsLeft";
export async function CreateUserMessage(
  userId: string ,
  chatid: string,
  content: string
) {
    const creditsLeft = await GetCreditsLeft(userId)
    if(!creditsLeft || creditsLeft<=0){
        return {
            success : false
        }
    }
  try {
    await prisma.message.create({
      data: {
        content,
        role: "user",
        chatId: chatid,
      },
    });
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: 1 } },
    });
    return {
      success: true,
    };
  } catch (e) {
    console.log("Error while creating ", e);
  } finally {
    revalidatePath(`/chat/${chatid}`);
  }
}
