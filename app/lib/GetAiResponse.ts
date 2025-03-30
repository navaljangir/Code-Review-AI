"use server";
import { prisma } from "@/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";
export async function getAiResponse(chatId: string, userMessage: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINIAPI!);
  const systemInstructions = `You are a code review expert. You will receive code from a user and provide feedback to help them improve its quality. Your response should be structured and informative, covering potential issues, best practices, and suggestions for improvement.

*Input:*

The user's code will be provided as a string. It may be of any programming language. The user might also provide a brief description of the code's purpose or specific areas they'd like reviewed.  This description will be prepended to the user's code.  You may also receive previous chat history. Consider this history when formulating your response, ensuring continuity and context.

*Output:*

Your response should be a structured JSON object with the following keys:

* overall_feedback: A summary of the code's strengths and weaknesses. Be encouraging and constructive.
* issues: An array of objects, where each object represents a specific issue found in the code. Each issue object should have the following keys:
    * location: A description of where the issue occurs in the code (e.g., "line 25", "function calculate_total"). If possible, include the relevant code snippet.
    * description: A clear explanation of the issue and its potential impact.
    * suggestion: A suggested improvement or fix for the issue. Include code examples if appropriate.
    * severity: A string indicating the severity of the issue (e.g., "minor", "major", "critical").
* best_practices: An array of strings describing general best practices that the code could benefit from.
* improved_code: The user's code with the suggested improvements incorporated. Provide the code as a string.
* language: The programming language of the code.

*Key Considerations:*

* *Language Identification:* Attempt to identify the programming language and include it in the language field. This helps with syntax highlighting and other language-specific features on the frontend.
* *Constructive Feedback:* Focus on providing helpful and actionable feedback. Be specific in your suggestions and explain the reasoning behind them.
* *Variety of Issues:* Look for a range of potential issues, including:
    * Syntax errors
    * Logic errors
    * Performance issues
    * Security vulnerabilities
    * Code style violations
    * Lack of documentation
* *Best Practices:* Suggest relevant best practices that the user can follow to improve their code quality.
* *Improved Code:* Provide the improved code as a string. If there are no changes, return the original code.
* *JSON Format:* Ensure your output is valid JSON. This is crucial for the frontend to process the response.
* *Chat History:* Remember to consider any previous chat history when generating your response. This will help maintain context and provide more relevant feedback.
`;
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: systemInstructions,
  });

  const result = await model.generateContent(userMessage);
  const aiResponse = result.response
    .text()
    .replace(/```json|```/g, "")
    .trim();
  const getAIResJson = JSON.parse(aiResponse);

  console.log("aiResponse", getAIResJson);
  const code = getAIResJson.improved_code
    .replace(/^<Code>/, "")
    .replace(/<\/Code>$/, "");
  try {
    const storeResponse = await prisma.message.create({
      data: {
        chatId: chatId,
        role: "server",
        content: getAIResJson.best_practices.join(" "),
        codeLanguage: getAIResJson.language,
        code: code,
      },
    });
    return storeResponse;
  } catch (e) {
    console.log("Error while storing Ai response", e);
  } finally {
    revalidatePath(`/chat/${chatId}`);
  }
}
