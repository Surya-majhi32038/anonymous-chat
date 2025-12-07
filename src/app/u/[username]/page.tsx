"use client";
// error on this page, not showing anything D:\new vs code\anonymous-chat\README.md
import { messageSchema } from "@/schemas/messageSchema";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
const Page = () => {
    const params = useParams();
    const [message, setMessage] = useState("");
    const username = params?.username as string;
      console.log(username,'uyhbvuyb');
     const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

    const sendMessage = async () => {
        // console.log('message -> ',message)
        const safeMessage = messageSchema.safeParse({ content:message });
        // console.log(safeMessage)
        if (!safeMessage.success) {
            toast.warning("Message must 10 to 300 words");
            return;
        }

        try {
            const result = await axios.post(`/api/send-message`, {
                username: username,
                content: message,
            });
            console.log("result from send message ",result.data)
    
            if (!result.data.success || result.data.message == "User-not-found") {
                if (result.data.message == "User-not-found") {
                    toast.info("User not found");
                } else if (result.data.message == "not-accepting") {
                    toast.info("User not accepting message");
                }
            } else {
                toast.success(" Message send successfully");
                setMessage("");
            }
        
        } catch (error) {
            console.log("error happing when anonomys user send message ",error)
            toast.error("Internal Error happen");
        }}
    const messages = [
        "What's a hobby you’ve recently started?",
        "If you could have dinner with any historical figure, who would it be?",
        "What’s a simple thing that makes you happy?",
    ];

    return (
        <div className="min-h-screen flex flex-col  items-center justify-between bg-gradient-to-b from-[#0b1120] via-[#111a2d] to-[#1e253a] text-white lg:px-0 lg:py-3 px-6 pt-3 pb-3">
            {/* Main Container */}
            <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-3 lg:p-6 text-center">
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    Send Anonymous Message
                </h1>

                <p className="text-sm sm:text-base text-gray-300 mb-2 lg:mb-4 ">
                    to <span className="font-semibold text-white">@{username}</span>
                </p>

                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your anonymous message here..."
                    className="lg:w-full w-[90%] border border-white/20 bg-white/10 text-gray-100 rounded-lg p-3 text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none resize-none lg:h-24 h-20 placeholder-gray-400 transition-all"
                />

                <button
                    onClick={sendMessage}
                    className="mt-4 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-semibold cursor-pointer rounded-lg shadow-md transition-all px-6 py-2.5"
                >
                    Send It
                </button>
            </div>

            {/* Message List */}
            <div className="w-full max-w-md mt-10">
                <p className="text-sm text-gray-300 mb-3 text-center">
                    Click on any message below to select it.
                </p>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-md">
                    <div className="bg-white/10 text-center border-b border-white/20 py-2 rounded-t-2xl">
                        <p className="font-medium text-center text-white">Messages</p>
                    </div>

                    <div className="divide-y divide-white/10">
                        {messages.map((msg, i) => (
                            <button
                                onClick={()=>setMessage(msg)}
                                key={i}
                                className="w-full text-left px-4 py-3 hover:bg-white/10 text-gray-100 text-sm transition-all cursor-pointer"
                            >
                                {msg}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-center">
                    <p className="text-sm text-gray-300 mb-2">
                        Get Your Own Message Board
                    </p>
                    <button className="bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md transition-all cursor-pointer">
                        <Link href="/sign-in">Create Your Account</Link>
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-5 text-xs text-gray-400 text-center bottom-0">
                © {year?? '----'} True Feedback • All Rights Reserved
            </footer>
        </div>
    );
};

export default Page;
