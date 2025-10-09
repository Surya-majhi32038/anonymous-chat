import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";

/**
 *  in this sign-up route, we will do the following:
 * 
 * if 'existringUserByEmail' exists then 
    *   if user is verified then  
    *     return false 
    *  else 
    *      update the verify code and expiry
 * else
    *  create new user
    * save the new user 
 * 
 * 
 */

export async function POST(request: Request) {
    await dbConnect();

    try 
    {
         const {username, email,password} = await request.json();
        //  console.log("Request body:", {username, email, password});
         const existingUserVerifiedByUserName = await UserModel.findOne({
            username,
            isVerified:true
         })

            if(existingUserVerifiedByUserName){
                return Response.json(
                    {
                        success: false,
                        message: "Username already taken",
                    },
                    {
                        status: 400,
                    }
                )
            }

            const existingUserVerifiedByEmail = await UserModel.findOne({
                email
            });

            const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); // generate 6 digit otp

            if(existingUserVerifiedByEmail) {
                // user exists, but not verified
                if(existingUserVerifiedByEmail.isVerified) { // user already verified, nothing can do, return 
                    return Response.json(
                        {
                            success: false,
                            message: "Email already registered and verified, please login",
                        },
                        {
                            status: 400,
                        }
                    )
                }

                // user exists but not verified, update the verify code and expiry
                const hashPass = await bcrypt.hash(password,10);
                const expiryDate = new Date(); 
                expiryDate.setHours(expiryDate.getHours() + 1); // otp valid for 10 minutes
                existingUserVerifiedByEmail.password = hashPass;
                existingUserVerifiedByEmail.verifyCode = verifyCode;
                existingUserVerifiedByEmail.verifyCodeExpiry = expiryDate;

                await existingUserVerifiedByEmail.save();
               
            } else {
                // new user registration
                const hasedPassword = await bcrypt.hash(password, 10);

                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1); // otp valid for 10 minutes

                const newUser = new UserModel({
                  username,
                  email,
                  password: hasedPassword,
                  verifyCode,
                  verifyCodeExpiry: expiryDate,
                  isVerified: false,
                  isActingMessages: true,
                  messages: []


                });

                await newUser.save();

            }

            const emailResponse = await sendVerificationEmail(
                email,
                username,
                parseInt(verifyCode)
            );
                console.log("Email response:", emailResponse);
            if(emailResponse.success) {
                return Response.json(
                    {
                        success: true,
                        message: "Verification email sent",
                    },
                    {
                        status: 200,
                    }
                )
            } else {
                return Response.json(
                    {
                        success: false,
                        message: "Error sending verification email",
                    },
                    {
                        status: 500,
                    }
                )
            }

    } catch (error) {
        console.error("Error in sign-up route:", error);
        return Response.json(
            {
                success: false,
                message: "Error registering user (sign-up route)",
            },
            {
                status: 500,
            }
        )
    }
}

// video done at 2:00:00