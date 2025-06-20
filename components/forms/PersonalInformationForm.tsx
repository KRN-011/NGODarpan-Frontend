'use client'

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { FiCheck } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { registerUser, resendOtp, verifyUser } from "@/lib/api";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";


const personalInfoSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
    username: z.string().min(1, { message: "Username is required" }).min(3, { message: "Username must be at least 3 characters long" }),
    password: z.string().min(1, { message: "Password is required" }).min(8, { message: "Password must be at least 8 characters long" }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" }),
    remember: z.boolean().optional(),
});

type PersonalInfoForm = z.infer<typeof personalInfoSchema>;

export default function PersonalInformationForm() {

    const router = useRouter();

    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const subStep = searchParams.get('subStep');

    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<PersonalInfoForm>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            email: "",
            username: "",
            password: "",
            remember: false,
        }
    });

    const onSubmit = async (data: PersonalInfoForm) => {
        try {
            if (subStep === "details") {
                const reponse = await registerUser(data);
                if (reponse.success) {
                    toast.success(reponse.message);
                    router.push("/auth/signup/ngo?redirect=true&from=signup&email=" + data.email + "&step=personal&subStep=verification");
                }
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            if (subStep === "verification") {
                const token = Cookies.get('token');
                if (!token) {
                    toast.error("Token not found");
                    return;
                }
                const reponse = await verifyUser(otp.join(''), token);
                if (reponse.success) {
                    toast.success(reponse.message);
                    router.push("/auth/signup/ngo?redirect=true&from=signup&step=ngoInfo&subStep=requirements");
                }
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message);
        }
    }

    const handleResendOtp = async () => {
        const token = Cookies.get('token');

        if (!token) {
            toast.error("Token not found");
            return;
        }

        const response = await resendOtp(token);
        if (response.success) {
            toast.success(response.message);
        } else {
            toast.error(response.message);
        }
    }

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const value = e.target.value;
        if (value.length > 1) {
            e.target.value = value.slice(0, 1);
        }
        setOtp(prev => {
            const newOtp = [...prev];
            newOtp[idx] = value;
            return newOtp;
        });
    };

    const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === "Backspace" && idx > 0) {
            e.preventDefault();
            if (inputRefs.current[idx - 1]) {
                inputRefs.current[idx - 1]!.focus();
            }
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text');
        if (pasteData.length > 6) {
            setOtp(prev => prev.slice(0, 6));
        } else {
            setOtp(pasteData.split(''));
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {
                subStep === "details" && (
                    <div className="flex flex-col gap-4 w-md px-5">
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
                            "p-2 w-3/4 mx-auto rounded-md bg-secondary text-secondary-dark cursor-pointer hover:bg-secondary-dark transition-all duration-300 hover:text-secondary mt-4",
                            "dark:bg-muted-dark dark:text-primary dark:hover:text-quinary",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            "max-md:text-sm max-md:px-4"
                        )} disabled={isSubmitting}>
                            {isSubmitting ? <div className="flex items-center min-h-6 gap-2 justify-center w-full"><div className="w-4 h-4 border-2 border-tertiary dark:border-quaternary rounded-full animate-spin"></div> </div> : "Submit"}
                        </button>
                    </div>
                )
            }
            {
                subStep === "verification" && (
                    <div className="flex flex-col gap-4 max-w-md px-5">
                        <div className="flex flex-col gap-5">
                            <h1 className="text-xl md:text-2xl font-bold text-center">Verify</h1>
                            <p className="text-center text-tertiary text-sm mb-10">Enter the OTP sent to your email : <Link href={`mailto:${email}`} className="font-semibold text-muted-dark dark:text-muted-light">{email ? email : "-"}</Link></p>
                            <div className="flex gap-2 justify-center max-sm:gap-1">
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
                                            "w-8 h-8 sm:w-12 sm:h-12 text-center text-lg md:text-xl border-2 border-muted rounded-lg focus:outline-none focus:border-quaternary transition-all duration-300",
                                            "dark:border-muted-dark",
                                            "max-md:text-sm max-md:px-4"
                                        )}
                                        autoComplete="one-time-code"
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col w-full h-full">
                            <button type="button" onClick={handleVerifyOtp} className={cn(
                                "p-2 w-3/4 mx-auto rounded-md bg-primary text-tertiary cursor-pointer hover:bg-primary-light transition-all duration-300 hover:text-quaternary mt-10",
                                "dark:bg-muted-dark dark:text-primary hover:bg-muted dark:hover:text-quinary",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "max-md:text-sm max-md:px-4"
                            )}>
                                Verify
                            </button>
                            <button type="button" onClick={handleResendOtp} className={cn(
                                "p-2 w-3/4 mx-auto rounded-md bg-primary text-tertiary cursor-pointer hover:bg-primary-light transition-all duration-300 hover:text-quaternary mt-3",
                                "dark:bg-muted-dark dark:text-primary hover:bg-muted dark:hover:text-quinary",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "max-md:text-sm max-md:px-4"
                            )}>
                                Resend OTP
                            </button>
                        </div>
                    </div>
                )
            }
        </form>
    );
}