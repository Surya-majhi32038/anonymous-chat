"use client";

import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { signIn } from "next-auth/react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Eye, EyeOff } from 'lucide-react';
/**
 *
 * algorithem
 *  1. useranme / email and take password
 *  2. not exists username/ email
 *      --> not register or need to sign up
 *  3. password incorect
 *      --> reset the password
 *  4. both are valid
 *      --> goto /dashboard page
 *
 */
const Page = () => {
    const [isPassHide, setIsPassHide] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    // toast.success("for test");
    // toast.error("for test")
    // zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);
        const result = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });

        if (result?.error) {
            setIsSubmitting(false);
            toast.error("Failed to sign-in");
        }

        if (result?.url) {
            setIsSubmitting(false);
            router.replace('/dashboard')
            toast.success("Success", {
                description: "Welcome"
                
            });
        }
    };
    return <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow space-y-5">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Join Mystery Message 
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to start your anonymous adventure!
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email or Usearname</FormLabel>
                                    <FormControl>
                                        <Input  placeholder="email or username" {...field} 
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
                                ) : ('Login')
                            } 
                        </Button>
                            </div>
                    </form>
                </Form>

                <div className="text-center mt-4">
                    <p>
                        Have not any account?
                        <Link href="/sign-up" className="text-blue-600 hover:text-blue-600"> Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>;
};

export default Page;