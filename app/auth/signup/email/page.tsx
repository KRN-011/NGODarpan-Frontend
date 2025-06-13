'use client'

import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { registerUser } from "@/lib/api"
import { FiCheck } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const signupEmailSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    remember: z.boolean().optional(),
})

type SignupEmailForm = z.infer<typeof signupEmailSchema>;


export default function SignUpEmailPage() {

    // non-state variables
    const router = useRouter()
    const searchParams = useSearchParams()

    // form variables
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError, reset, setValue } = useForm<SignupEmailForm>({
        resolver: zodResolver(signupEmailSchema),
        defaultValues: {
            email: "",
            username: "",
            password: "",
            remember: false,
        }
    })

    useEffect(() => {
        if (searchParams.get("email")) {
            setValue("email", decodeURIComponent(searchParams.get("email") as string))
        }
    }, [])

    const onSubmit = async (data: SignupEmailForm) => {
        try {
            const response = await registerUser(data)

            if (response.success) {
                toast.success("OTP sent to your email", {
                    onClose: () => {
                        router.push("/auth/signup/email/verify?email=" + encodeURIComponent(data.email));
                    },
                    autoClose: 1500,
                });
            }
        } catch (error: any) {
            toast.error(error.response.data.message)
            setError("root", { message: error.response.data.message || "Something went wrong" })
        }
    }

    return (
        <div className="flex justify-center w-full h-full items-center py-32">
            <div className="bg-secondary-light dark:bg-muted-darker w-1/4 p-10 rounded-3xl">
                <h1 className="text-2xl font-bold text-center">SignUp with Email</h1>
                <form action="" className="flex flex-col gap-4 mt-10" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email">Email</label>
                        <input type="email" {...register("email")} className={cn(
                            "w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300",
                            "dark:border-muted-dark"
                        )} autoComplete="email" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="username">Username</label>
                        <input type="text" {...register("username")} className={cn(
                            "w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300",
                            "dark:border-muted-dark"
                        )} autoComplete="username" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="password">Password</label>
                        <input type="password" {...register("password")} className={cn(
                            "w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300",
                            "dark:border-muted-dark"
                        )} autoComplete="new-password" />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                id="remember"
                                className="sr-only peer"
                                {...register("remember")}
                                defaultChecked
                            />
                            <span className={cn(
                                "w-4 h-4 border border-muted flex items-center justify-center ml-2 peer-checked:bg-primary peer-checked:border-quaternary transition-colors rounded",
                                "dark:border-muted-dark dark:peer-checked:bg-muted"
                            )}>
                                <FiCheck className={`text-tertiary dark:text-muted-darker`} />
                            </span>
                            <span className="ml-2">Remember me</span>
                        </label>
                    </div>
                    <button type="submit" className={cn(
                        "p-2 w-3/4 mx-auto rounded-md bg-primary text-tertiary cursor-pointer hover:bg-primary-light transition-all duration-300 hover:text-quaternary mt-4",
                        "dark:bg-muted-dark dark:text-primary hover:bg-muted dark:hover:text-quinary",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                    )} disabled={isSubmitting}>
                        {isSubmitting ? <div className="flex items-center min-h-6 gap-2 justify-center w-full"><div className="w-4 h-4 border-2 border-tertiary dark:border-quaternary rounded-full animate-spin"></div> </div> : "SignUp"}
                    </button>
                </form>
                <div className="flex flex-col gap-2 mt-5">
                    <p className="text-center">Already have an account? <Link href="/auth/login" className="text-quinary relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-quaternary hover:before:w-full before:transition-all before:duration-300 transition-all duration-300">Login</Link></p>
                </div>
            </div>
        </div>
    )
}