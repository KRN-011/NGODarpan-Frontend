"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import Image from "next/image"
import Cookies from "js-cookie"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"

export default function SignUpPage() {

    const { data: session, status } = useSession()
    const [email, setEmail] = useState("")
    
    useEffect(() => {
        if (status === "authenticated" && session) {
            Cookies.set("token", (session as any).accessToken);
            Cookies.set("user", JSON.stringify(session.user));
            redirect("/auth/login?redirect=true&from=signup");
        }
    }, [status, session])

    if (status === "loading") {
        return (
            <div className="flex justify-center items-center w-full h-screen animate-pulse">
                <Image src="/logo.png" alt="NGO Darpan Logo" width={100} height={100} />
            </div>
        )
    }

    if (status === "authenticated") {
        return (
            <div className="flex justify-center items-center w-full h-screen animate-pulse text-2xl font-bold max-w-md text-balance mx-auto text-center">
                Wait while we redirect you to the login page...
            </div>
        )
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        redirect(`/auth/signup/email?redirect=true&from=signup&email=${encodeURIComponent(email)}`)
    }

    return (
        <div className="flex justify-center w-full h-full items-center py-40">
            <div className="bg-secondary-light w-1/4 p-10 rounded-3xl">
                <div className="flex flex-col gap-4 w-full items-center">
                    <h1 className="text-3xl font-bold">SignUp</h1>
                    <p className="text-muted-dark">Create an account to get started</p>
                    <div className="flex flex-col w-full gap-4">
                        <button onClick={() => signIn("google")} className="p-2 px-8 rounded-md bg-primary text-tertiary cursor-pointer max-w-fit flex mx-auto items-center justify-center gap-2 hover:bg-primary-light transition-all duration-300 hover:text-quaternary">
                            <Image src="/icons/google-logo.png" alt="Google" width={30} height={30} />
                            Signup with Google
                        </button>
                        <button onClick={() => signIn("github")} className="p-2 px-8 rounded-md bg-primary text-tertiary cursor-pointer max-w-fit flex mx-auto items-center justify-center gap-2 hover:bg-primary-light transition-all duration-300 hover:text-quaternary">
                            <Image src="/icons/github-logo.png" alt="Github" width={30} height={30} />
                            Signup with Github
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-full h-[1px] bg-muted-dark"></div>
                            <p className="text-muted-dark">or</p>
                            <div className="w-full h-[1px] bg-muted-dark"></div>
                        </div>
                        <form onSubmit={handleSubmit} className="w-3/4 mx-auto">
                            <div className="flex flex-col w-full gap-4">
                                <input type="email" placeholder="Enter your email" className="w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <button type="submit" className="p-2 rounded-md bg-primary text-tertiary cursor-pointer hover:bg-primary-light transition-all duration-300 hover:text-quaternary">Signup with Email</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}