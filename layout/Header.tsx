"use client"

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiAlignRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";

export default function Header() {

    // non-state variables
    const { data: session } = useSession()
    const authRoutes = ["/auth/login", "/auth/signup"]
    const pathname = usePathname()
    const isLoggedIn = Cookies.get('token')

    // state variables
    const [menuOpen, setMenuOpen] = useState(false)

    // handle Logout
    const handleLogout = () => {
        Cookies.remove('token')
        Cookies.remove('user')
        signOut({ callbackUrl: '/auth/login?redirect=true&from=logout' })
    }

    // check if the current path is an auth route
    const isAuthRoute = authRoutes.includes(pathname)

    return (
        <div className="w-full bg-secondary relative">
            <div className="flex justify-between px-20 py-4 items-center [@media(max-width:768px)]:hidden">
                <div>
                    <Image src="/logo.png" alt="NGO Darpan Logo" width={100} height={100} />
                </div>
                <div className="flex gap-6">
                    <Link href="/">Home</Link>
                    <Link href="/about">About</Link>
                    <Link href="/contact">Contact</Link>
                </div>
                {
                    isLoggedIn || session ? (
                        <div className="flex gap-4 items-center">
                            <button
                                onClick={handleLogout}
                                className={`cursor-pointer z-10 px-3 transition-all duration-300 hover:text-primary relative before:content-[''] before:w-full before:h-0 before:bg-tertiary before:absolute before:bottom-0 before:left-0 before:transition-all before:duration-300 before:ease-in-out hover:before:h-6 before:-z-10 ${isAuthRoute ? "hidden" : ""}`}>Logout</button>
                        </div>
                    ) : (
                        <div className={`flex items-center  ${isAuthRoute ? "hidden" : ""}`}>
                            <Link href="/auth/login" className={`px-3 relative hover:text-primary transition-all duration-300 z-10 before:content-[''] before:w-0 before:h-6 before:bg-tertiary before:absolute  before:right-0 before:top-0 before:transition-all before:duration-300 before:ease-in-out hover:before:w-full before:-z-10`}>Login</Link>
                            <div className="h-6 w-[1px] bg-tertiary"></div>
                            <Link href="/auth/signup" className={`px-3 relative hover:text-primary transition-all duration-300 z-10 before:content-[''] before:w-0 before:h-6 before:bg-tertiary before:absolute before:left-0 before:top-0 before:transition-all before:duration-300 before:ease-in-out hover:before:w-full before:-z-10`}>Signup</Link>
                        </div>
                    )
                }
            </div>

            {/* Mobile Menu */}
            <div className="flex justify-between px-10 py-4 items-center md:hidden">
                <div>
                    <Image src="/logo.png" alt="NGO Darpan Logo" width={100} height={100} className="max-sm:w-20" />
                </div>
                <div>
                    <FiAlignRight className="text-tertiary" size={24} onClick={() => setMenuOpen(!menuOpen)} />
                </div>
            </div>

            {/* Mobile Menu Content */}
            <AnimatePresence>
                {
                    menuOpen && (
                        <div className="absolute origin-bottom mt-7 left-0 w-full z-50 md:hidden">
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.95, borderRadius: 0 }}
                                animate={{ opacity: 1, y: 0, scale: 1, borderRadius: 15 }}
                                transition={{ duration: 0.3 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95, borderRadius: 0 }}
                                className="max-w-3xs mx-auto py-4 bg-secondary"
                            >
                                <div className="flex flex-col gap-4 p-4 items-center">
                                    <Link href="/">Home</Link>
                                    <div className="h-[1px] w-1/3 mx-auto bg-tertiary"></div>
                                    <Link href="/about">About</Link>
                                    <div className="h-[1px] w-1/2 mx-auto bg-tertiary"></div>
                                    <Link href="/contact">Contact</Link>
                                    <div className="h-[1px] w-1/2 mx-auto bg-tertiary"></div>
                                    {
                                        isLoggedIn || session ? (
                                            <div className={`flex gap-4 items-center ${isAuthRoute ? "hidden" : ""}`}>
                                                <button
                                                    onClick={() => {
                                                        signOut()
                                                        handleLogout()
                                                    }}>Logout</button>
                                            </div>
                                        ) : (
                                            <div className={`flex gap-4 items-center ${isAuthRoute ? "hidden" : ""}`}>
                                                <Link href="/login">Login</Link>
                                                <div className="h-10 w-[1px] bg-tertiary"></div>
                                                <Link href="/signup">Signup</Link>
                                            </div>
                                        )
                                    }
                                </div>
                            </motion.div>
                        </div>
                    )
                }
            </AnimatePresence>
        </div>
    )
}