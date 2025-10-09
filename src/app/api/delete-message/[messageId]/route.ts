import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";


export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {

    try {
        await dbConnect();
        const messageId = params.messageId;
        const session = await getServerSession(authOptions);
        const user = session?.user as User;
        if (!session || !user) {
            return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const result = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }

        );

        if (result.modifiedCount == 0) {
            return Response.json(
                {
                    success: false,
                    message: "message are not found or already deleted"
                }, {
                status: 400
            }
            )
        }
        return Response.json(
            {
                success: true,
                message: "message are deleted"
            }, {
            status: 200
        }
        )
    } catch (error) {
        console.error("Error in deleting message ", error);
        return Response.json({ success: false, message: "error happing on delete messages" }, { status: 500 });
    }
}