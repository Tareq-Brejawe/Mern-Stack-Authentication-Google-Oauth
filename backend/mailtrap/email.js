import { client, sender } from "./mail.config.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./mailTemplates.js";


export const sendVerifictionCode = async(email,verifycode)=>{
 try {

    const recipient = [{email}];

    const response = await client.send({
      from: sender,
      to: recipient,
      subject: "Verification code",
     html:VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}',verifycode),
      category: "send verification code",
    });
    console.log(response,"Send verification code successfull")
}catch(error){
   throw new Error("Faild to send verification code")
}
}

export const sendPasswordResetLink = async(email,url)=>{
try {
    const recipient = [{email}];

    const response = await client.send({
      from: sender,
      to: recipient,
      subject: "Reset password",
     html:PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}',url),
      category: "reset password",
    });
    console.log(response,"Send reset password link successfull")
}catch(error){
   throw new Error("Faild to send reset password link")
}
}

export const resetPasswordSuccess = async(email)=>{
   try {
    const recipient = [{email}];

    const response = await client.send({
      from: sender,
      to: recipient,
      subject: "Success Reset password",
     html:PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "success reset password",
    });
    console.log(response,"Reset password successfull")
}catch(error){
   throw new Error("Faild to reset password confirm message")
}
}