import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
interface AuthCredentials {
  identifier: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
        id: "credentials",
        name: "Credentials",
        credentials: {
            email: {label: "Email", type: "text"},
            password: {label: "Password", type: "password"}
        },
        async authorize(credentials:any): Promise<any | null> {
            // console.log('when it call, the auth function ')
            await dbConnect();
            try {
                
                //const {email, password} = credentials;
                
                const user = await UserModel.findOne({
                    $or:[
                        {email: credentials.identifier},
                        {username:credentials.identifier}
                    ]
                })

                if(!user) {
                    throw new Error("No user found with the given email or username");
                }

                if(!user.isVerified) {
                    throw new Error("User is not verified, please verify your email");
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if(!isPasswordValid) {
                    throw new Error("Invalid password");
                }

                return user;
            } catch (error:any) {
                throw new Error(error)
            }
        }
        })
    ],
    callbacks: {
        /**
         * in the user, the nextauth don't know who is _id, that why we are modifing the nextauth in fiel types/next-auth.d.ts 
         * 
         */
        async jwt({token, user}) { 
            // console.log("token",token)
            if(user) {
                token.id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            // console.log('token',token,'user',user)
            return token;
        },
        async session({session, token}) {
            if(token) {
                session.user._id = token.id
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.isVerified = token.isVerified
                session.user.username = token.username
            }
            // console.log('after jwt',session);
            return session;
        } 
    },
    pages:{
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}
