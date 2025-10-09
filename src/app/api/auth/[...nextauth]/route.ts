import NextAuth from "next-auth/next";
import { authOptions } from "./options";

const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};
//                 session.user.id = token.id as string;
//                 session.user.isVerified = token.isVerified as boolean;
//                 session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
//                 session.user.username = token.username as string;
//             }
// 2:47:43