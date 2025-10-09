'use client'

import { Button } from "@/components/ui/button";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react"
import Link from "next/link";

const Navbar = () => {
    const {data: session } = useSession();
    const user = session?.user as User;
    const handleLogOut = ()=> {
        signOut({callbackUrl:'/'})
    }
    // console.log(session?'er':'sdf')
  return (
   <nav className="p-4 lg:px-[10%] md:p-6 shadow-md bg-gray-900 text-white">
      <div className={`container mx-auto flex ${session?"":"flex-row justify-between"} flex-col md:flex-row justify-between items-center`}>
        <a href="#" className="text-xl lg:text-2xl font-bold mb-4 md:mb-0">
          True Feedback
        </a>

        <div className={`flex items-center  justify-between ${session?"lg:w-1/2 w-full":"w-fit "}`}>

        {session ? (
            <>
            <span className="mr-4 lg: mb-2.5">
               {user.username || user.email}
            </span>
            <Button  onClick={handleLogOut}  className="w-fit cursor-pointer text-[14px] md:w-auto bg-slate-100 text-black" variant={'outline'} >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto bg-slate-100 cursor-pointer text-black" variant={'outline'}>Login</Button>
          </Link>
        )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar;