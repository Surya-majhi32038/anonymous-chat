"use client";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SkeletonCard } from "@/components/SkeletonCard";
import { ProfileSkeleton } from "@/components/ProfileSkeleton";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setisSwitchLoading] = useState(false);

  // create a local array to store all the messages, take id delete from array
  const handleDeleteMessage = (messageId: string) => {
    setMessages(
      messages.filter((message) => message._id.toString() !== messageId)
    );
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  // console.log("form-> ",form)

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessage");
  // console.log("acceptMessages: ", acceptMessages);
  //
  const fetchAcceptMessage = async () => {
    setisSwitchLoading(true);
    try {
      const response = await axios.get("/api/accept-messages");
      setValue("acceptMessage", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Faild", {
        description:
          axiosError.response?.data.message || " Failed to fetch message ",
        action: {
          label: "Try again",
          onClick: () => toast.dismiss(),
        },
      });
    } finally {
      setisSwitchLoading(false);
    }
  };

  // for preventing the twise issue of react (two time render)
  
  //   useEffect(() => {
    //     if (hasRun.current) return;
    //     hasRun.current = true;
    
//     fetchMessages();
//   }, []);

const fetchMessages = async () => {
    setIsLoading(true);
    setisSwitchLoading(false);

    try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
      // console.log('fetch message ', response)

      setMessages(response.data.messages || []);

      // if (refresh) {
        
      toast.success("Refresh", {
        description: "Showing Latest Messages",
      });
      console.log("toast after fetchMesages ");
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error("Failed", {
        description:
        axiosError.response?.data.message || "Failed to fetch message ",
        action: {
            label: "Try agai",
            onClick: () => toast.dismiss(),
        },
    });
} finally {
    setIsLoading(false);
    setisSwitchLoading(false);
}
};


    const hasRun = useRef(false); // this is only use for to prevent the two time rendering by the react strick mode 


  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    function runFunctions() {
      if ((!session || !session.user) ) return;
      if(hasRun.current) return;
      hasRun.current = true;
      fetchMessages();
      // console.log('use effect run');
      fetchAcceptMessage();
    }

    // Run on first load
    runFunctions();

    // Run when tab becomes active again
    const handleFocus = () => {
      runFunctions();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [session]);

  const handleSwitch = async () => {
    // console.log('handle switch run, acceptMessages:',acceptMessages);
    // 7:51:00
    try {
      await axios.post("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });

      setValue("acceptMessage", !acceptMessages);
      // toast.success("",result.data.messages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Failed", {
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
        action: {
          label: "Try again",
          onClick: () => toast.dismiss(),
        },
      });
    }
  };

  // find out the url
  if (!session || !session.user)
    return (
      <div className="flex h-screen justify-center items-center">
        <ProfileSkeleton />
      </div>
    );
  // console.log(session);
  const { username } = session?.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  // clipboard
  const copyUrl = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Copy Url", {
      description: "Profile URL has been copied to clipboard",
      action: {
        label: "ok",
        onClick: () => toast.dismiss(),
      },
    });
  };
  /**
     * 
     * toast.success("✅ Message sent successfully!", {
                        description: `Your message: "${message}"`,
                        action: {
                            label: "OK", // text on the button
                            onClick: () => toast.dismiss(), // closes the toast when clicked
                        },
                    });
     */
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <Input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button className="cursor-pointer" onClick={copyUrl}>
            Copy
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessage")}
          checked={acceptMessages}
          onCheckedChange={handleSwitch}
          disabled={isSwitchLoading}
          className="cursor-pointer"
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4 cursor-pointer"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages();
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid overflow-x-hidden grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[38vh] overflow-y-auto">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              //  key={message._id}
              key={index}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : messages.length === 0 && !isLoading ? (
          <p className="flex   w-[60vw] h-[30vh] justify-center items-center">
            No messages received yet.
          </p>
        ) : (
          <SkeletonCard />
        )}
      </div>
    </div>
  );
};

export default Page;
