import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({ username: decodedUsername });

        if (!user) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const isCodeValid = user.verifyCode === code;
        if (!isCodeValid) {
            return Response.json({ success: false, message: "Invalid verification code" }, { status: 400 });
        }

        const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date();
        console.log("times",new Date(user.verifyCodeExpiry), new Date());

        if(!isCodeExpired){
            return Response.json({ success: false, message: "Verification code has expired" }, { status: 400 });
        } 
        user.isVerified = true;
        await user.save();

        return Response.json({ success: true, message: "User verified successfully" }, { status: 200 });


    } catch (error) {
        return Response.json({ success:false,message: "Internal Server Error:Verify code " }, { status: 500 });
    }
}
