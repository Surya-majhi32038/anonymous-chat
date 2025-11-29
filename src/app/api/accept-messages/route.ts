import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User} from "next-auth";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);
        const user = session?.user as User;

        if(!session || !user) {
            return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const userId = user._id;
        const {acceptMessages} = await request.json();

        // const newUser = await UserModel.findByIdAndUpdate(
        //     userId,
        //     { isAcceptingMessages: acceptMessages },
        //     { new: true }

        // );
        const newUser = await UserModel.findOneAndUpdate(
            { _id: userId },
            { isAcceptingMessages: acceptMessages },
            { new: true }
        );
        // console.log('Updated user for accept messages(post) ',acceptMessages);
        // console.log("newUser ", newUser?.isAccpetingMessages);

        if (!newUser) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Message acceptance status updated successfully", newUser }, { status: 200 });


    } catch (error) {
        console.error("Error in POST /api/accept-messages:", error);
        return Response.json({ success: false, message: "error happing on accept messages " }, { status: 500 });
    }
}

export async function GET() {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user as User;

    if(!session || !user) {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const userId = user._id;
        const existingUser = await UserModel.findById(userId);
        if (!existingUser) {
            return Response.json({ success: false, message: "User not found when send isAccepting flage" }, { status: 404 });
        }
        // console.log('Fetched user accept messages status (get)', existingUser.isAccpetingMessages);
        return Response.json({ success: true, isAcceptingMessages: existingUser.isAcceptingMessages, 
            message: "Message acceptance status fetched successfully",
         }, { status: 200 });
    } catch (error) {
        console.error("Error in GET /api/accept-messages:", error);
        return Response.json({ success: false, message: "error happing on accept messages " }, { status: 500 });
    }
}

// 4:03:00