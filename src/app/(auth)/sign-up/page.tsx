"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import {Eye, EyeOff, Loader2} from 'lucide-react'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
/**
 * ALGORITHME       
 * 1. username 
 *      a. after 500 milisecond it check the user name using debounce 
 *      b. retrun it exsist or not 
 * 2. email, password
 * 3. sign up 
 * 4. email not exists 
 * 5. go to verify part verify/[username]/page
 * to verify  
 *  
 *
 */
const page = () => {
    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isPassHide, setIsPassHide] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debounced = useDebounceCallback(setUsername, 500);
    const router = useRouter();

    // zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                //  != ''
                setIsCheckingUsername(true);
                setUsernameMessage("");
                try {
                    const response = await axios.get(
                        `/api/check-username-unique?username=${username}`
                    );
                    // must see the axios response
                    console.log(response); //TODO remove it after seen
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(
                        axiosError.response?.data.message ?? "error checking username"
                    );
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        };
        checkUsernameUnique();
    }, [username]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);

        try {
            const response = await axios.post("/api/sign-up", data);
            // must check the response as log
            toast.success("code verification", {
                description: 'verify code to your email address',
                
            });
            router.replace(`/verify/${username}`);
            setIsSubmitting(false);
        } catch (error) {
            console.log("Error in signup of user", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let erroreMessage = axiosError.response?.data.message;

            toast.error("Failed", {
                description: 'Something happen wrong',
                action:{
                    label:'Pleas Try again',
                    onClick:()=>toast.dismiss()
                }

            });
            setIsSubmitting(false);
        }
    };
    // upto 6hrs the singup page is done
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow space-y-5">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Join Mystery Message
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign up to start your anonymous adventure!
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username" {...field} 
                                        onChange={(e) => {
                                            field.onChange(e)
                                            debounced(e.target.value)
                                        }}
                                        />
                                    </FormControl>
                                    {
                                        isCheckingUsername && <Loader2 className="animate-spin"/>
                                    }
                                    <p className={`${usernameMessage === "username is available"? "text-green-500" : "text-red-500"} text-sm`}>{usernameMessage} </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="eamil" {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Password</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                    <Input
                                        {...field}
                                        type={isPassHide ? "password" : "text"}
                                        placeholder="Password"
                                        className="pr-10" // Add padding-right for the button
                                    />
                                    </FormControl>

                                    <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsPassHide((v) => !v)}
                                    aria-label={isPassHide ? "Show password" : "Hide password"}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                                    >
                                    {isPassHide ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </Button>
                                </div>

                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="w-full flex justify-center ">
                        <Button className="cursor-pointer" type="submit" disabled={isSubmitting}>
                            {
                                isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
                                    </>
                                ) : ('Register')
                            } 
                        </Button>
                        </div>
                    </form>
                </Form>

                <div className="text-center mt-4">
                    <p>
                        Alrady a Member?
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-600"> Sign in 
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default page;
