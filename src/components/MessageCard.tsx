"use client";
import {
    Card,

    CardContent,

    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import React from "react";
import dayjs from 'dayjs';
import { Button } from "./ui/button";
import { Message } from "@/model/User.model";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { X } from "lucide-react";
import { ApiResponse } from '@/types/ApiResponse';
type MessageType = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
}
const MessageCard = ({ message, onMessageDelete }: MessageType) => {
    // console.log('message',message)
    const handleDelete = async () => {
        try {
            await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
            toast.success("Message Delete");
            const id = message._id as string;
            onMessageDelete(id)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error("Failed to delete message")

        }
    }

return (
    <Card className="card-bordered">
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>{message.content}</CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant='destructive' className="cursor-pointer ">
                            <X className="w-5 h-5 " />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete
                                this message.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="cursor-pointer">
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <div className="text-sm">
                {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
            </div>
        </CardHeader>
        <CardContent></CardContent>
    </Card>
);
};

export default MessageCard;
