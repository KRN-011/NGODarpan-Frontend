"use client"

import { verifyUser } from "@/lib/api"
import axios from "axios"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import Cookies from "js-cookie"
import { cn } from "@/lib/utils"

export default function VerifyPage() {

    // non-state variables
    const searchParams = useSearchParams()
    const router = useRouter()

    // state variables
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const [error, setError] = useState("")
    
    useEffect(() => {
        const email = searchParams.get("email")
        if (email) {
            setEmail(email)
        }
    }, [])

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const value = e.target.value.replace(/\D/g, "")
        if (!value) return
        const newOtp = [...otp]
        newOtp[idx] = value[0]
        setOtp(newOtp)
        if (value.length > 1 && idx < 5) {
            // If user pasted or typed multiple digits, fill next fields
            for (let i = 1; i < value.length && idx + i < 6; i++) {
                newOtp[idx + i] = value[i]
            }
            setOtp(newOtp)
            const nextIdx = Math.min(idx + value.length, 5)
            inputRefs.current[nextIdx]?.focus()
        } else if (idx < 5) {
            inputRefs.current[idx + 1]?.focus()
        }
    }

    const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === "Backspace") {
            if (otp[idx]) {
                const newOtp = [...otp]
                newOtp[idx] = ""
                setOtp(newOtp)
            } else if (idx > 0) {
                inputRefs.current[idx - 1]?.focus()
            }
        } else if (e.key === "ArrowLeft" && idx > 0) {
            inputRefs.current[idx - 1]?.focus()
        } else if (e.key === "ArrowRight" && idx < 5) {
            inputRefs.current[idx + 1]?.focus()
        }
    }

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const paste = e.clipboardData.getData("text").replace(/\D/g, "")
        if (paste.length === 6) {
            setOtp(paste.split(""))
            inputRefs.current[5]?.focus()
        }
        e.preventDefault()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await verifyUser(otp.join(""), Cookies.get("token") as string)

            if (response.success) {
                toast.success("OTP verified successfully", {
                    onClose: () => {
                        router.push("/auth/login")
                    }
                })
            }
        } catch (error: any) {
            toast.error(error.response.data.message)
            setError(error.response.data.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center w-full h-full items-center py-32">
            <div className="bg-secondary-light dark:bg-muted-darker w-1/4 p-10 rounded-3xl">
                <h1 className="text-2xl font-bold text-center">Verify</h1>
                <p className="text-center text-tertiary text-sm mt-4">Enter the OTP sent to your email : <Link href={`mailto:${email}`} className="font-semibold text-muted-dark dark:text-muted-light">{email ? email : "-"}</Link></p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-10">
                    <div className="flex flex-col gap-1">
                        <div className="flex gap-2 justify-center">
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    ref={el => { inputRefs.current[idx] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleOtpChange(e, idx)}
                                    onKeyDown={e => handleOtpKeyDown(e, idx)}
                                    onPaste={handleOtpPaste}
                                    className={cn(
                                        "w-12 h-12 text-center text-xl border-2 border-muted rounded-lg focus:outline-none focus:border-quaternary transition-all duration-300",
                                        "dark:border-muted-dark"
                                    )}
                                    autoComplete="one-time-code"
                                />
                            ))}
                        </div>
                        <button type="submit" className={cn(
                            "p-2 w-3/4 mx-auto rounded-md bg-primary text-tertiary cursor-pointer hover:bg-primary-light transition-all duration-300 hover:text-quaternary mt-10",
                            "dark:bg-muted-dark dark:text-primary hover:bg-muted dark:hover:text-quinary",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                        )} disabled={loading}>
                            {loading ? <div className="flex items-center min-h-6 gap-2 justify-center w-full"><div className="w-4 h-4 border-2 border-tertiary dark:border-quaternary rounded-full animate-spin"></div></div> : "Verify"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}