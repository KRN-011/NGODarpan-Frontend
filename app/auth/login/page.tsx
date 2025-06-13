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

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    remember: z.boolean().optional(),
})

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {

    // non-state variables
    const router = useRouter()

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
                reset();
                toast.success(response.message, {
                    onClose: () => {
                        router.push("/")
                    }
                })
            }
        } catch (error: any) {
            toast.error(error.response.data.message)
            setError("root", { message: error.response.data.message || "Something went wrong" })
        }
    }

    return (
        <div className="flex justify-center w-full h-full items-center py-40">
            <div className="bg-secondary-light dark:bg-muted-darker w-1/4 p-10 rounded-3xl">
                <h1 className="text-2xl font-bold text-center">Login</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-10">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email">Email</label>
                        <input type="email" {...register("email")}
                            className={cn(
                                "w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300",
                                "dark:border-muted-dark"
                            )} autoComplete="email" />
                    </div>
                    {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="password">Password</label>
                        <input type="password" {...register("password")}
                            className={cn(
                                "w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300",
                                "dark:border-muted-dark"
                            )} autoComplete="current-password" />
                        {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
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
                    {errors.root && <span className="text-red-500 text-xs">{errors.root.message}</span>}
                    <button
                        type="submit"
                        className={cn(
                            "p-2 w-3/4 mx-auto rounded-md bg-primary text-tertiary cursor-pointer hover:bg-primary-light transition-all duration-300 hover:text-quaternary mt-4",
                            "dark:bg-muted-dark dark:text-primary hover:bg-muted dark:hover:text-quinary",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <div className="flex items-center min-h-6 gap-2 justify-center w-full"><div className="w-4 h-4 border-2 border-tertiary dark:border-quaternary rounded-full animate-spin"></div></div> : "Login"}
                    </button>
                </form>
                <div className="flex flex-col gap-2 mt-5">
                    <p className="text-center">Don't have an account? <Link href="/auth/signup" className="text-quinary relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-quaternary hover:before:w-full before:transition-all before:duration-300 transition-all duration-300">SignUp</Link></p>
                </div>
            </div>
        </div>
    )
}