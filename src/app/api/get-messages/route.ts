import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";


export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    console.log('session',session)
    const user = session?.user as User;
    console.log('user',user)
    if(!session || !user) {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {

        // must to convert this id string to a mongoose object id for aggregation
        const userId = new mongoose.Types.ObjectId(user._id);
        console.log(userId)
        const allMessages = await UserModel.aggregate([
            { $match: {_id: userId} },
            // { $unwind: "$messages" },
            // { $sort: { "messages.createdAt": -1 } },
            // { $group: {_id: "$_id", messages: { $push: "$messages" } } }
        ]);

        console.log('get-messages-',allMessages)

        if(!allMessages || allMessages.length === 0) {
            return Response.json({ success: true, message: "No messages found" }, { status: 200 });
        }

        return Response.json({ success: true, messages: allMessages[0].messages, message: "Messages fetched successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error in GET /api/get-messages:", error);
        return Response.json({ success: false, message: "error happing on get messages " }, { status: 500 });
    }
}