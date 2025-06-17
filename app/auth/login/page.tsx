'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { loginUser } from "@/lib/api"
import { toast } from "react-toastify"
import { FiCheck } from "react-icons/fi"
import { cn } from "@/lib/utils"
import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { IoEye, IoEyeOff } from "react-icons/io5"

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    remember: z.boolean().optional(),
})

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {

    // non-state variables
    const router = useRouter()

    // state variables
    const [showPassword, setShowPassword] = useState(false)

    // form variables
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError, reset } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            remember: true,
        }
    })

    const onSubmit = async (data: LoginForm) => {
        try {
            const response = await loginUser(data);

            if (response.success) {
                toast.success(response.message)
                router.push("/")
            }
        } catch (error: any) {
            toast.error(error.response.data.message)
            setError("root", { message: error.response.data.message || "Something went wrong" })
        }
    }

    return (
        <div className="flex w-full h-full items-center py-20 md:py-40 px-5">
            <div className="bg-secondary-light dark:bg-muted-darker w-full max-w-md p-7 md:p-10 rounded-3xl mx-auto">
                <h1 className="text-xl md:text-2xl font-bold text-center">Login</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-10">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm md:text-base" htmlFor="email">Email</label>
                        <input type="email" {...register("email")}
                            className={cn(
                                "w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300",
                                "dark:border-muted-dark text-sm md:text-base"
                            )} autoComplete="email" />
                    </div>
                    {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm md:text-base" htmlFor="password">Password</label>
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} {...register("password")}
                                className={cn(
                                    "w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300",
                                    "dark:border-muted-dark text-sm md:text-base"
                                )} autoComplete="current-password" />
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
                        {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="flex items-center cursor-pointer text-sm md:text-base">
                            <input
                                type="checkbox"
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
                            <span className="ml-2">Remember me</span>
                        </label>
                    </div>
                    {errors.root && <span className="text-red-500 text-xs">{errors.root.message}</span>}
                    <button
                        type="submit"
                        className={cn(
                            "p-2 w-3/4 mx-auto rounded-md bg-primary text-tertiary cursor-pointer hover:bg-primary-light transition-all duration-300 hover:text-quaternary mt-4 text-sm md:text-base",
                            "dark:bg-muted-dark dark:text-primary hover:bg-muted dark:hover:text-quinary",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <div className="flex items-center min-h-6 gap-2 justify-center w-full"><div className="w-4 h-4 border-2 border-tertiary dark:border-quaternary rounded-full animate-spin"></div></div> : "Login"}
                    </button>
                </form>
                <div className="flex flex-col gap-2 mt-5">
                    <p className="text-center text-sm md:text-base">Don't have an account? <Link href="/auth/signup" className="text-quinary relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-quaternary hover:before:w-full before:transition-all before:duration-300 transition-all duration-300">SignUp</Link></p>
                </div>
            </div>
        </div>
    )
}