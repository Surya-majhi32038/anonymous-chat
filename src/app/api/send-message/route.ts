import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { Message} from "@/model/User.model";


export async function POST(request: Request) {
    await dbConnect();

    try {
        const {username,content} = await request.json();
        // here we will find the user by username and check if he is accepting messages
        const user = await UserModel.findOne({username});
        if(!user) {
            return Response.json({ success: false, message: "User not found" }, { status: 200 });
        }

        if(!user.isAccpetingMessages) {
            return Response.json({ success: false, message: "User is not accepting messages" }, { status: 403 });
        }

        const message = {
            content,
            createdAt: new Date()
        }
        user.messages.push(message as Message);

        await user.save();
        return Response.json({ success: true, message: "Message sent successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error in POST /api/send-message:", error);
        return Response.json({ success: false, message: "error happing on send message " }, { status: 500 });
    }
}