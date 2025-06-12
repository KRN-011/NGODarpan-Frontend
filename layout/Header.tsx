"use client"

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiAlignRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {

    const [menuOpen, setMenuOpen] = useState(false)

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
                <div className="flex items-center">
                    <Link href="/auth/login" className="px-3 relative hover:text-primary transition-all duration-300 z-10 before:content-[''] before:w-0 before:h-6 before:bg-tertiary before:absolute before:rounded-tl-0 before:rounded-bl-0 hover:before:rounded-tl-10 hover:before:rounded-bl-10 before:right-0 before:top-0 before:transition-all before:duration-300 before:ease-in-out hover:before:w-full before:-z-10">Login</Link>
                    <div className="h-6 w-[1px] bg-tertiary"></div>
                    <Link href="/auth/signup" className="px-3 relative hover:text-primary transition-all duration-300 z-10 before:content-[''] before:w-0 before:h-6 before:bg-tertiary before:absolute before:left-0 before:top-0 before:transition-all before:duration-300 before:ease-in-out hover:before:w-full before:-z-10">Signup</Link>
                </div>
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
                                    <div className="flex gap-4 items-center">
                                        <Link href="/login">Login</Link>
                                        <div className="h-10 w-[1px] bg-tertiary"></div>
                                        <Link href="/signup">Signup</Link>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )
                }
            </AnimatePresence>
        </div>
    )
}