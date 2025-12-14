'use client'
import messages from "@/app/messages.json"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react";
import Autoplay from 'embla-carousel-autoplay'
import { useEffect, useState } from "react";
import Link from "next/link";
export default function Home() {
    const [year, setYear] = useState<number | null>(null);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);
    return (
        <>

            <section className="flex flex-col justify-center items-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-[calc(92.25vh-80px)]">
                <div className="max-w-7xl w-full mx-auto px-4 text-center">
                    {/* Hero */}
                    <h1 className="lg:text-4xl text-2xl font-bold text-white mb-4">
                        Share Your Thoughts Freely — Stay 100% Anonymous
                    </h1>
                    <p className="lg:text-lg text-sm text-gray-300 max-w-2xl mx-auto">
                        True Feedback lets you express your honest opinions, compliments, or confessions
                        without revealing your identity. A safe space to connect, reflect, and grow.
                    </p>

                    {/* Carousel for Messages */}
                    <Carousel
                        plugins={[Autoplay({ delay: 2000 })]}
                        className="w-full max-w-[95%] sm:max-w-[80%] md:max-w-lg mx-auto mt-8"
                    >
                        <CarouselContent className="px-4 md:px-4">

                            {messages.map((message, index) => (
                                <CarouselItem
                                    key={index}
                                    className=" lg:p-5 "
                                >
                                    <Card className="bg-white rounded-xl  shadow-md p-3 flex flex-col gap-2">
                                        <CardHeader className="p-0">
                                            <CardTitle className="text-base sm:text-lg font-semibold">
                                                Message from {message.title}
                                            </CardTitle>
                                        </CardHeader>

                                        <CardContent className="flex flex-row items-start gap-2 sm:gap-4">
                                            <Mail size={18} className="text-gray-600 flex-shrink-0 mt-1" />
                                            <div className="text-left flex-1">
                                                <p className="text-sm sm:text-base text-gray-800 leading-snug break-words">
                                                    {message.content}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {message.received}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>


                    {/* CTA */}
                    <div className="text-center mt-8">
                        <Link href={'/sign-in'} className="px-6 py-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition">
                            Start Receiving Feedback
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="w-full py-4 border-t border-gray-700 text-center text-gray-400 text-sm bg-gray-900">
                © {year ?? "---"} True Feedback — Built for Real, Honest Conversations.
            </footer>



        </>
    );
}
