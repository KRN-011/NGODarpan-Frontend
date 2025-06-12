'use client'

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginUser } from "@/lib/api"
import { toast } from "react-toastify"
import { FiCheck } from "react-icons/fi"

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

            console.log(response);

            if (response.success) {
                toast.success("Login successful")
                router.push("/")
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
            <div className="bg-secondary-light w-1/4 p-10 rounded-3xl">
                <h1 className="text-2xl font-bold text-center">Login</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-10">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email">Email</label>
                        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary" autoComplete="email" />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full p-2 rounded-md border-2 border-muted focus:outline-none focus:border-quaternary" autoComplete="current-password" />
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
                            <span className="w-4 h-4 border border-muted flex items-center justify-center ml-2 peer-checked:bg-primary peer-checked:border-quaternary transition-colors rounded">
                                <FiCheck className={`text-tertiary ${form.remember ? 'block' : 'hidden'} transition-all duration-300`} />
                            </span>
                            <span className="ml-2">Remember me</span>
                        </label>
                    </div>
                    <button type="submit" className="p-2 w-3/4 mx-auto rounded-md bg-primary text-tertiary cursor-pointer hover:bg-primary-light transition-all duration-300 hover:text-quaternary mt-4" disabled={loading}>
                        {loading ? <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-tertiary rounded-full animate-spin"></div> <span>Loading...</span></div> : "Login"}
                    </button>
                </form>
                <div className="flex flex-col gap-2 mt-5">
                    <p className="text-center">Don't have an account? <Link href="/auth/signup" className="text-quinary relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-quaternary hover:before:w-full before:transition-all before:duration-300 transition-all duration-300">SignUp</Link></p>
                </div>
            </div>
        </div>
    )
}