'use client'

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginUser } from "@/lib/api"
import { toast } from "react-toastify"
import { FiCheck } from "react-icons/fi"
import { cn } from "@/lib/utils"

export default function LoginPage() {

    // non-state variables
    const router = useRouter()

    // state variables
    const [form, setForm] = useState({
        email: "",
        password: "",
        remember: true,
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setLoading(true)

        try {
            const response = await loginUser(form)

            if (response.success) {
                form.email = ""
                form.password = ""
                form.remember = true
                setError("")
                toast.success("Login successful", {
                    onClose: () => {
                        router.push("/")
                    }
                })

            }
        } catch (error: any) {
            toast.error(error.response.data.message)
            setError(error.response.data.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center w-full h-full items-center py-40">
            <div className="bg-secondary-light dark:bg-muted-darker w-1/4 p-10 rounded-3xl">
                <h1 className="text-2xl font-bold text-center">Login</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-10">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email">Email</label>
                        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className={cn(
                                "w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300",
                                "dark:border-muted-dark"
                            )} autoComplete="email" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="password">Password</label>
                        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className={cn(
                                "w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary transition-all duration-300",
                                "dark:border-muted-dark"
                            )} autoComplete="current-password" />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="remember"
                                id="remember"
                                className="sr-only peer"
                                checked={form.remember}
                                onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                            />
                            <span className={cn(
                                "w-4 h-4 border border-muted flex items-center justify-center ml-2 peer-checked:bg-primary peer-checked:border-quaternary transition-colors rounded",
                                "dark:border-muted-dark dark:peer-checked:bg-muted"
                            )}>
                                <FiCheck className={`text-tertiary dark:text-muted-darker ${form.remember ? 'block' : 'hidden'} transition-all duration-300`} />
                            </span>
                            <span className="ml-2">Remember me</span>
                        </label>
                    </div>
                    <button type="submit" className={cn(
                        "p-2 w-3/4 mx-auto rounded-md bg-primary text-tertiary cursor-pointer hover:bg-primary-light transition-all duration-300 hover:text-quaternary mt-4",
                        "dark:bg-muted-dark dark:text-primary hover:bg-muted dark:hover:text-quinary",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                    )} disabled={loading}>
                        {loading ? <div className="flex items-center min-h-6 gap-2 justify-center w-full"><div className="w-4 h-4 border-2 border-tertiary rounded-full animate-spin"></div></div> : "Login"}
                    </button>
                </form>
                <div className="flex flex-col gap-2 mt-5">
                    <p className="text-center">Don't have an account? <Link href="/auth/signup" className="text-quinary relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-quaternary hover:before:w-full before:transition-all before:duration-300 transition-all duration-300">SignUp</Link></p>
                </div>
            </div>
        </div>
    )
}