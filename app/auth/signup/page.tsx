"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import Image from "next/image"
import Cookies from "js-cookie"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const signupSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
})

type SignupForm = z.infer<typeof signupSchema>;

export default function SignUpPage() {

    const { data: session, status } = useSession()
    
    // form variables
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupForm>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
        }
    })

    useEffect(() => {
        if (status === "authenticated" && session) {
            Cookies.set("token", (session as any).accessToken);
            Cookies.set("user", JSON.stringify(session.user));
            redirect("/");
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
            <div className="flex items-center gap-2 justify-center w-full h-screen">
                <div className="w-4 h-4 border-2 border-tertiary rounded-full animate-spin"></div>
            </div>
        )
    }

    const onSubmit = (data: SignupForm) => {
        redirect(`/auth/signup/email?redirect=true&from=signup&email=${encodeURIComponent(data.email)}`)
    }

    return (
        <div className="flex justify-center w-full h-full items-center py-40">
            <div className="bg-secondary-light dark:bg-muted-darker w-1/4 p-10 rounded-3xl">
                <div className="flex flex-col gap-4 w-full items-center">
                    <h1 className="text-3xl font-bold">SignUp</h1>
                    <p className="text-muted-dark dark:text-muted-light">Create an account to get started</p>
                    <div className="flex flex-col w-full gap-4">
                        <button onClick={() => signIn("google")} 
                        className={cn(
                            "p-2 px-8 rounded-md bg-primary text-tertiary cursor-pointer max-w-fit flex mx-auto items-center justify-center gap-2 hover:bg-primary-light transition-all duration-300 hover:text-quaternary",
                            "dark:bg-muted-dark dark:text-primary hover:bg-muted dark:hover:text-quinary"
                        )}>
                            <Image src="/icons/google-logo.png" alt="Google" width={30} height={30} />
                            Signup with Google
                        </button>
                        <button onClick={() => signIn("github")} 
                        className={cn(
                            "p-2 px-8 rounded-md bg-primary text-tertiary cursor-pointer max-w-fit flex mx-auto items-center justify-center gap-2 hover:bg-primary-light transition-all duration-300 hover:text-quaternary",
                            "dark:bg-muted-dark dark:text-primary hover:bg-muted dark:hover:text-quinary"
                        )}>
                            <Image src="/icons/github-logo.png" alt="Github" width={30} height={30} />
                            Signup with Github
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-full h-[1px] bg-muted-dark"></div>
                            <p className="text-muted-dark dark:text-muted-light">or</p>
                            <div className="w-full h-[1px] bg-muted-dark"></div>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className="w-3/4 mx-auto">
                            <div className="flex flex-col w-full gap-4">
                                <input type="email" placeholder="Enter your email" className={cn(
                                    "w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300",
                                    "dark:border-muted-dark"
                                )} {...register("email")} />
                                { errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span> }
                                <button type="submit" className={cn(
                                    "p-2 rounded-md bg-primary text-tertiary cursor-pointer hover:bg-primary-light transition-all duration-300 hover:text-quaternary",
                                    "dark:bg-muted-dark dark:text-primary hover:bg-muted dark:hover:text-quinary"
                                )}>Signup with Email</button>
                            </div>
                        </form>
                    </div>
                    <div className="flex flex-col gap-2 mt-5">
                        <p className="text-center">Already have an account? <Link href="/auth/login" className="text-quinary relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-quaternary hover:before:w-full before:transition-all before:duration-300 transition-all duration-300">Login</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}