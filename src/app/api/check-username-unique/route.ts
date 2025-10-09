import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { userNameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

// this route is upto 3:38:48

// check the user name using zod
const usernameQueuerySchema = z.object({
    username: userNameValidation
});

export async function GET(request: Request) { // not verified it, check later 
    dbConnect();
    try {
        //console.log(new URL(request.url)) // TODO: remove after check
        const {searchParams} = new URL(request.url);
        const queryParam = { 
            username: searchParams.get('username')
        };

        // username validation with zod
        const parsed = usernameQueuerySchema.safeParse(queryParam);
        console.log(parsed) // TODO: remove after check 

        if(!parsed.success) {
        const usernameErrors = parsed.error.format().username?._errors || [];

            return Response.json({
                success:false,
                message: usernameErrors?.length > 0? usernameErrors.join(', '): 'Invalid query parameters'
            },{status:400})
        }
        const {username} = parsed.data;
        const existingVerifiedUser = await UserModel.findOne({
            username: username,
            isVerified: true
        });

        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: 'username already taken'
                }, {
                status: 200
            }
            )
        } else {
            return Response.json(
                {
                    success: true,
                    message: 'username is available'
                }, {
                status: 200
            }
            )
        }
    } catch (error) {
        console.error('Error in GET /api/check-username-unique:', error);
        return Response.json(
            {
                success: false,
                message: 'error checking username uniqueness'
            }, {
            status: 500
        }
        )
    }
}

