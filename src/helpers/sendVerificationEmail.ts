import { ApiResponse } from "@/types/ApiResponse";
const nodemailer = require("nodemailer");
export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: number
): Promise<ApiResponse> {
    try {

        // Create transporter using Gmail
        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            port: 465,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Mail options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email || process.env.EMAIL_USER, // default to your email if none provided
            subject: "User Verification",
            html: ` <div style="font-family: 'Arial', sans-serif; background-color: #f7f8fa; padding: 30px; border-radius: 10px; text-align: center; max-width: 500px; margin: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <h1 style="color: #333; font-size: 28px; margin-bottom: 10px;">Welcome, <span style="color: #007bff;">${username}</span>!</h1>
                <p style="font-size: 16px; color: #555; margin-bottom: 30px;">
                Your One-Time Password (OTP) is shown below. Please <strong>do not share it with anyone</strong>.
                </p>
                <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; display: inline-block; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                <h2 style="font-size: 42px; color: #28a745; margin: 0; letter-spacing: 6px;">${verifyCode}</h2>
                </div>
                <p style="font-size: 14px; color: #888; margin-top: 30px;">
                This OTP will expire in <strong>10 minutes</strong>.<br/>
                If you didn’t request this, please ignore this email.
                </p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                <p style="font-size: 12px; color: #aaa;">&copy; ${new Date().getFullYear()} YourAppName. All rights reserved.</p>
            </div>`
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log("Mail sent:", info.response);

        return { success: true, message: "Email sent successfully!" };
    } catch (error: unknown) {
        console.error("Error sending email:", error);
        if (error instanceof Error) {
            return { success: false, message: error.message };
        }
        return { success: false, message: "Unknown error" };
    }
}

