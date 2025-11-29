
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { NextAuthOptions, User as NextAuthUser } from "next-auth";
// inside your NextAuth file, near imports
import { Types } from "mongoose";

type DBUser = {
    _id: Types.ObjectId | string;
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date | string;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages?: [];
};

interface LoginCredentials {
    identifier: string;
    password: string;
}
interface LoginCredentials {
    identifier: string;
    password: string;
}

// This is what authorize will return
type UserType = NextAuthUser & {
    _id: string;
    username: string;
    password: string;
    isVerified: boolean;
    isAcceptingMessages: boolean;
};

//  type UserType = {
//     id: string;
//     email: string;
//     username: string;
//     password: string;
//     isVerified: boolean;
//     isAcceptingMessages: boolean;
// }

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: unknown): Promise<UserType | null> {
                // console.log('when it call, the auth function ')
                await dbConnect();

                console.log('credentials', credentials)

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

                    // Use .lean() to get a plain object (not a Mongoose Document)
                    const user = await UserModel
                        .findOne({ $or: [{ email: identifier }, { username: identifier }] })
                        .lean() as DBUser | null;

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

                    // 🔥 Map Mongoose document -> typed UserType object
                    const safeUser: UserType = {
                        _id: user._id.toString(),
                        id: user._id.toString(),          // for NextAuth
                        email: user.email,
                        username: user.username,
                        password: user.password,
                        isVerified: user.isVerified,
                        isAcceptingMessages: user.isAcceptingMessages,
                        name: user.username,              // optional, from NextAuthUser
                        image: null                       // or user.image if you have it
                    };

                    return safeUser;
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
console.log('NextAuth options loaded --> ', authOptions.providers[0].options);