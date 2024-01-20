import { sendEmail, processEmail } from "./send-email";

import { NotFoundError, InternalServerError } from "../../middleware/error";

export const sendVerificationEmail = async function(user: any) {
    const data  = {
        username: user.username,
        token: user.verificationToken
    }

    const html = await processEmail("verification", data);
    await sendEmail(user.email, "Verify your account", html);
}