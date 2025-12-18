'use client'
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
const Page = () => {
    const router = useRouter();
    const params = useParams();
    // zod implementation
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code,
            });

            if(response.data.success) {
                // must check the response as log
                toast.success("Verification Successful", {
                    description: "Sign in for more exploration"
                   
                });    
                router.replace("/dashboard");
            } else {
                toast.error("Failed", {
                    description: "check verification code"
                });
            }
        } catch (error) {
            console.log("Error in signup of user", error);
            const axiosError = error as AxiosError<ApiResponse>;
            const erroreMessage = axiosError.response?.data.message;
            toast.error("Failed");
            console.log("error :",erroreMessage)
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Verify Your Account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter the verification code send to your email 
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col ">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="enter the code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="w-fit m-auto cursor-pointer" type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default Page;