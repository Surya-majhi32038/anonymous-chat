import mongoose,{Schema,Document} from 'mongoose';

export interface AuthCredentials {
  identifier: string; // email or username
  password: string;
}

// Import the Mongoose user type

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  isAcceptingMessages: boolean;
}

export interface Message extends Document {
    content: string;
    createdAt:Date;
}

const MessageSchema : Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})


export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAccpetingMessages: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Email is invalid'], 
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    verifyCode: {
        type: String,
        required: [true,'Verification code is required']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true,'Verification code expiry is required']
    },
    isAccpetingMessages: {
        type: Boolean,
        default: true
    },
    messages:[MessageSchema]
})

// we are using next.js, so it call every time for model creation, so we need to check if the model already exists
const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema);

export default UserModel;

