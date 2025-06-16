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
import { IoEye, IoEyeOff } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

const signupEmailSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" }),
    remember: z.boolean().optional(),
})

type SignupEmailForm = z.infer<typeof signupEmailSchema>;


export default function SignUpEmailPage() {

    // non-state variables
    const router = useRouter()
    const searchParams = useSearchParams()

    // state variables
    const [showPassword, setShowPassword] = useState(false)

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
                if (response?.data?.updatedUser?.verified || response?.data?.user?.verified) {
                    toast.success(response?.message, {
                        onClose: () => {
                            router.push("/auth/login");
                        },
                        autoClose: 1500,
                    })
                } else {
                    toast.success("OTP sent to your email", {
                        onClose: () => {
                            router.push("/auth/signup/email/verify?email=" + encodeURIComponent(data.email));
                        },
                        autoClose: 1500,
                    });
                }
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message)
            setError("root", { message: error.response?.data?.message || "Something went wrong" })
        }
    }

    return (
        <div className="flex justify-center w-full h-full items-center py-20 md:py-40 px-5">
            <div className="bg-secondary-light dark:bg-muted-darker p-7 md:p-10 w-md rounded-3xl">
                <h1 className="text-xl md:text-2xl font-bold text-center">SignUp with Email</h1>
                <form action="" className="flex flex-col gap-4 mt-10" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm md:text-base" htmlFor="email">Email</label>
                        <input type="email" {...register("email")} className={cn(
                            "w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300",
                            "dark:border-muted-dark", 
                            "max-md:text-sm max-md:px-4"
                        )} autoComplete="email" />
                    </div>
                    {errors.email && <span className="text-red-500 text-xs">{errors?.email?.message}</span>}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm md:text-base" htmlFor="username">Username</label>
                        <input type="text" {...register("username")} className={cn(
                            "w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300",
                            "dark:border-muted-dark",
                            "max-md:text-sm max-md:px-4"
                        )} autoComplete="username" />
                    </div>
                    {errors.username && <span className="text-red-500 text-xs">{errors?.username?.message}</span>}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm md:text-base" htmlFor="password">Password</label>
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} {...register("password")} className={cn(
                                "w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300",
                                "dark:border-muted-dark",
                                "max-md:text-sm max-md:px-4"
                            )} autoComplete="new-password" />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer select-none" onClick={() => setShowPassword(!showPassword)}>
                                <AnimatePresence mode="wait" initial={false}>
                                    {showPassword ? (
                                        <motion.span
                                            key="eye"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <IoEye size={20} />
                                        </motion.span>
                                    ) : (
                                        <motion.span
                                            key="eyeoff"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <IoEyeOff size={20} />
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </span>
                        </div>
                    </div>
                    {errors.password && <span className="text-red-500 text-xs">{errors?.password?.message}</span>}
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
                                "w-3 h-3 md:w-4 md:h-4 border border-muted flex items-center justify-center ml-2 peer-checked:bg-primary peer-checked:border-quaternary transition-colors rounded",
                                "dark:border-muted-dark dark:peer-checked:bg-muted"
                            )}>
                                <FiCheck className={`text-tertiary dark:text-muted-darker`} />
                            </span>
                            <span className="ml-2 text-sm md:text-base">Remember me</span>
                        </label>
                    </div>
                    {errors.root && <span className="text-red-500 text-xs">{errors?.root?.message}</span>}
                    <button type="submit" className={cn(
                        "p-2 w-3/4 mx-auto rounded-md bg-primary text-tertiary cursor-pointer hover:bg-primary-light transition-all duration-300 hover:text-quaternary mt-4",
                        "dark:bg-muted-dark dark:text-primary hover:bg-muted dark:hover:text-quinary",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "max-md:text-sm max-md:px-4"
                    )} disabled={isSubmitting}>
                        {isSubmitting ? <div className="flex items-center min-h-6 gap-2 justify-center w-full"><div className="w-4 h-4 border-2 border-tertiary dark:border-quaternary rounded-full animate-spin"></div> </div> : "SignUp"}
                    </button>
                </form>
                <div className="flex flex-col gap-2 mt-5">
                    <p className="text-center text-sm md:text-base">Already have an account? <Link href="/auth/login" className="text-quinary relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-quaternary hover:before:w-full before:transition-all before:duration-300 transition-all duration-300">Login</Link></p>
                </div>
            </div>
        </div>
    )
}