import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

interface LoginCredentials {
    identifier: string;
    password: string;
}
 type UserType = {
    _id: string;
    email: string;
    username: string;
    password: string;
    isVerified: boolean;
    isAcceptingMessages: boolean;
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
           async authorize(credentials: unknown): Promise<any | null> {
                // console.log('when it call, the auth function ')
                await dbConnect();

                console.log('credentials',credentials)

                // 1. Validate the credentials structure
                if (
                    !credentials ||
                    typeof credentials !== "object" ||
                    !("identifier" in credentials) ||
                    !("password" in credentials)
                ) {
                    throw new Error("Invalid credentials format");
                }

                const { identifier, password } = credentials as LoginCredentials;
                try {

                    //const {email, password} = credentials;

                    const user = await UserModel.findOne({
                        $or: [
                            { email: identifier },
                            { username: identifier }
                        ]
                    })

                    if (!user) {
                        throw new Error("No user found with the given email or username");
                    }

                    if (!user.isVerified) {
                        throw new Error("User is not verified, please verify your email");
                    }

                    const isPasswordValid = await bcrypt.compare(password, user.password);

                    if (!isPasswordValid) {
                        throw new Error("Invalid password");
                    }

                    return user;
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        throw new Error(error.message);
                    }
                    throw new Error("Unknown error occurred");
                }
            }
        })
    ],
    callbacks: {
        /**
         * in the user, the nextauth don't know who is _id, that why we are modifing the nextauth in fiel types/next-auth.d.ts 
         * 
         */
        async jwt({ token, user }) {
            // console.log("token",token)
            if (user) {
                token.id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            // console.log('token',token,'user',user)
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token.id
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.isVerified = token.isVerified
                session.user.username = token.username
            }
            // console.log('after jwt',session);
            return session;
        }
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}