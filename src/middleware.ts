import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export {default} from 'next-auth/middleware' 
import { getToken } from "next-auth/jwt";

// Ai code 

// export function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname

//   const isPublicPath = path === '/' || path === '/login' || path === '/signup' || path === '/verifyemail'

//   const token = request.cookies.get('token')?.value || ''

//   if (isPublicPath && token && path !== '/') {
//     // If user is logged in but trying to access login/signup/verify (not root)
//     return NextResponse.redirect(new URL('/profile', request.nextUrl))
//   }

//   if (!isPublicPath && !token) {
//     // Protect routes except root
//     return NextResponse.redirect(new URL('/login', request.nextUrl))
//   }
// }

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request }) 
    const url = request.nextUrl 
    if (token && (
        url.pathname.startsWith('/sign-in') || 
        url.pathname.startsWith('/sign-up') || 
        url.pathname === '/' || 
        url.pathname.startsWith('/verify'))) 
        { 
            return NextResponse.redirect(new URL('/dashboard', request.url)) 
        }

    if(!token && (
        url.pathname.startsWith('/dashboard')))
        {
            return NextResponse.redirect(new URL('/sign-in', request.url))
        }   
        return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/',
        '/profile',
        '/login',
        '/signup',
        '/verifyemail'
    ]
}