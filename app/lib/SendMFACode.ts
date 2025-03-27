'use server'
import Mailjet from 'node-mailjet';
import crypto from 'crypto';
import redisClient from '@/redis/redisClient'; 
console.log(process.env.MAILJETAPIKEY)
const mailjet = Mailjet.apiConnect(process.env.MAILJETAPIKEY || 'YOURMAILJETAPIKEY', process.env.MAILJETSECRETKEY || 'YOURMAILJETSECRETKEY');

function generateMfaCode() {
    return crypto.randomBytes(32).toString('hex');
}

export async function sendMfaToken(email : string | null | undefined,  name : string | null | undefined) {
    if(!email){
        return {
            success: false,
            message : 'Email Not Valid'
        }
    }
    const mfaToken = generateMfaCode()
    try {
        const request = mailjet
            .post("send", { version: 'v3.1' })
            .request({
                Messages: [
                    {
                      From: {
                        Email: "codereviewer.team@gmail.com",
                        Name: "Code Reviewer",
                      },
                      To: [
                        {
                          Email: email,
                        },
                      ],
                      Subject: "Code Reviewer MFA Token",
                      TextPart: `
                        Hello ${name},
                  
                        Your MFA token is: 
                        
                        ${mfaToken}
                  
                        It is valid for 30 seconds. Please use this token within that time frame to proceed with the authentication process.
                  
                        If you did not request this, please ignore this message.
                  
                        Best regards,
                        Code Reviewer
                      `,
                      HTMLPart: `
                        <html>
                          <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                          <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333;">
                            <div style="background-color: #ffffff; padding: 20px; max-width: 600px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                              <h2 style="color: #4CAF50;">Your MFA Token</h2>
                              <p style="font-size: 16px;">Hello ${name},</p>
                              <p style="font-size: 16px;">Your MFA token is: </p><br><br> 
                              <input type="text" value="${mfaToken}" id="mfaTokenInput" readonly 
                                style="width: 100%; padding: 10px; font-size: 18px; text-align: center; border: 1px solid #ccc; border-radius: 5px; margin-bottom: 10px;">
                                
                              <button onclick="document.getElementById('mfaTokenInput').select(); document.execCommand('copy');"
                                style="background-color: #4CAF50; color: white; padding: 10px 20px; font-size: 16px; border: none; border-radius: 5px; cursor: pointer;">
                                Copy Token
                              </button>
                              <p style="font-size: 16px;">It is valid for 30 seconds. Please use this token within that time frame to proceed with the authentication process.</p>
                              <p style="font-size: 16px;">If you did not request this, please ignore this message.</p>
                              <br>
                              <p style="font-size: 16px;">Best regards,</p>
                              <p style="font-size: 16px; font-weight: bold;">Team Code Reviewer</p>
                            </div>
                          </body>
                        </html>
                      `,
                    },
                ]
            });

        await request;
        console.log("MFA token sent successfully!");
        await redisClient.set(email, mfaToken, { EX: 60 });
        return {
            success : true,
            message : 'Enter the Code send to your mail'
        }
    } catch (error) {
        console.error("Error sending MFA token:", error);
        return {
            success : false,
            message : 'Try After Some time'
        }
    }
}