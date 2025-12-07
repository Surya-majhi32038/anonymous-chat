import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

import { NextRequest, NextResponse } from "next/server";
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ messageId: string }> }
) {

    try {
        await dbConnect();
       const { messageId } = await context.params;
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

// export async function DELETE(
//   request: NextRequest,
//   context: { params: Promise<{ messageId: string }> }
// ) {
//   try {
//     await dbConnect();

//     const { messageId } = await context.params;

//     const session = await getServerSession(authOptions);
//     const user = session?.user as User;

//     if (!session || !user) {
//       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//     }

//     const result = await UserModel.updateOne(
//       { _id: user._id },
//       { $pull: { messages: { _id: messageId } } }
//     );

//     if (result.modifiedCount === 0) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Message not found or already deleted"
//         },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Message deleted"
//       },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("Error in deleting message ", error);
//     return NextResponse.json(
//       { success: false, message: "Error while deleting message" },
//       { status: 500 }
//     );
//   }
// }