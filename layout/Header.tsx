"use client"

// IMPORTS

// React
import React, { useEffect, useState, useRef } from "react";

// Next Features
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// React Icons
import { FiAlignRight } from "react-icons/fi";
import { IoMdMoon, IoMdSunny, IoIosArrowDown, IoMdPerson } from "react-icons/io";

// Framer Motion
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

// Next Auth
import { signOut, useSession } from "next-auth/react";

// API imports
import { logoutUser } from "@/lib/api";

// Contexts
import { useTheme } from "@/context/ThemeContext";

// Packages
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";









export default function Header() {

    // non-state variables
    const { data: session } = useSession()
    const authRoutes = ["/auth/login", "/auth/signup"]
    const pathname = usePathname()
    const isLoggedIn = Cookies.get('token')
    const { scrollY } = useScroll();
    const lastScrollY = useRef(0);
    const headerRef = useRef<HTMLDivElement>(null);

    // state variables
    const [menuOpen, setMenuOpen] = useState(false)
    const { theme, setTheme } = useTheme();
    const [showHeader, setShowHeader] = useState(true);
    const [user, setUser] = useState<any>(null)

    // handle Theme
    const handleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light")
    }

    // handle Logout
    const handleLogout = async () => {
        const token = Cookies.get('token')
        if (token) {
            try {
                const response = await logoutUser(token)
                if (response.success) {
                    Cookies.remove('token')
                    Cookies.remove('user')
                    toast.success(response.message)
                    signOut({ callbackUrl: '/auth/login?redirect=true&from=logout' })
                }
            } catch (error: any) {
                toast.error(error.response.data.message)
            }
        }
    }

    // check if the current path is an auth route
    const isAuthRoute = authRoutes.includes(pathname)

    // auto hide animation logic
    useEffect(() => {
        if (headerRef.current) {
            const unsubscribe = scrollY.on("change", (latest) => {
                if(latest < 0) return;
                if(latest < lastScrollY.current) {
                    setShowHeader(true);
                } else if (latest > lastScrollY.current) {
                    setShowHeader(false);
                }
                lastScrollY.current = latest;
            });
            return unsubscribe;
        }
    }, [scrollY]);

    // get user profile
    useEffect(() => {
        const user = Cookies.get('user')
        if (user) {
            setUser(JSON.parse(user))
        }
    }, [isLoggedIn])
    
    return (
        <motion.div
            ref={headerRef}
            className="fixed top-0 left-0 w-full z-[99]"
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: showHeader ? 0 : -100, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            exit={{ y: -100, opacity: 0 }}
        >
            <div className="w-full bg-secondary dark:bg-muted-darker relative transition-all duration-300 min-h-16 z-[99]">
                <div className="flex justify-between px-20 py-4 items-center max-md:hidden">
                    <div>
                        <Image src="/logo.png" alt="NGO Darpan Logo" width={100} height={100} className="dark:invert dark:brightness-50" />
                    </div>
                    <div className="flex gap-6">
                        <Link href="/">Home</Link>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="flex">
                            <motion.div
                                onClick={handleTheme}
                                transition={{ duration: 0.3 }}
                                className="rounded-3xl h-7 w-12 bg-secondary-dark dark:bg-muted-light transition-all duration-300 flex items-center p-1 cursor-pointer"
                            >
                                <motion.div
                                    animate={{ x: theme === "light" ? 0 : "100%", rotate: theme === "dark" ? 0 : 60 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="w-5 h-full bg-primary dark:bg-muted-darker rounded-full flex items-center justify-center"
                                >
                                    {
                                        theme === "light" ? (
                                            <IoMdSunny className="text-yellow-600" />
                                        ) : (
                                            <IoMdMoon className="text-white" />
                                        )
                                    }
                                </motion.div>
                            </motion.div>
                        </div>
                        {
                            isLoggedIn || session ? (
                                <div className="flex items-center gap-4">
                                    <Link href="/profile" className="relative">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            className={cn(`
                                                flex items-center rounded-full  cursor-pointer p-1 peer`, 
                                                user?.profile?.profileImage ? "bg-muted-dark" : "bg-secondary-dark dark:bg-muted-light"
                                            )}
                                        >
                                            {
                                                user?.profile?.profileImage ? (
                                                    <Image src={user?.profile?.profileImage} alt="Profile" width={23} height={23} className="rounded-full object-cover" />
                                                ) : (
                                                    <IoMdPerson className="text-primary dark:text-muted-darker z-0" size={23} />
                                                )
                                            }
                                        </motion.div>
                                        <div className="absolute inset-0 -z-10 flex items-center justify-center peer-hover:translate-y-6 transition-all duration-300">
                                            <IoIosArrowDown className="text-secondary-dark dark:text-muted-light" size={18} />
                                        </div>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className={`cursor-pointer z-10 px-3 transition-all duration-300 hover:text-primary dark:hover:text-muted-dark relative before:content-[''] before:w-full before:h-0 before:bg-tertiary dark:before:bg-muted-light before:absolute before:bottom-0 before:left-0 before:transition-all before:duration-300 before:ease-in-out hover:before:h-6 before:-z-10 ${isAuthRoute ? "hidden" : ""}`}>Logout</button>
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
                </div>

                {/* Mobile Menu */}
                <div className="flex justify-between px-5 py-5 items-center md:hidden">
                    <div>
                        <Image src="/logo.png" alt="NGO Darpan Logo" width={100} height={100} className="max-sm:w-16" />
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="flex">
                            <motion.div
                                onClick={handleTheme}
                                transition={{ duration: 0.3 }}
                                className="rounded-3xl h-6 w-10 bg-secondary-dark dark:bg-muted-light transition-all duration-300 flex items-center p-1 cursor-pointer"
                            >
                                <motion.div
                                    animate={{ x: theme === "light" ? 0 : "100%", rotate: theme === "dark" ? 0 : 60 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="w-4 h-full bg-primary dark:bg-muted-darker rounded-full flex items-center justify-center"
                                >
                                    {
                                        theme === "light" ? (
                                            <IoMdSunny style={{ fontSize: "12px" }} className="text-yellow-600" />
                                        ) : (
                                            <IoMdMoon style={{ fontSize: "12px" }} className="text-white" />
                                        )
                                    }
                                </motion.div>
                            </motion.div>
                        </div>
                        <FiAlignRight className="text-tertiary" size={20} onClick={() => setMenuOpen(!menuOpen)} />
                    </div>
                </div>

                {/* Mobile Menu Content */}
                <AnimatePresence>
                    {
                        menuOpen && (
                            <div className="absolute origin-bottom mt-7 w-full z-50 md:hidden">
                                <motion.div
                                    initial={{ opacity: 0, y: -20, scale: 0.95, borderRadius: 0 }}
                                    animate={{ opacity: 1, y: 0, scale: 1, borderRadius: 15 }}
                                    transition={{ duration: 0.3 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.95, borderRadius: 0 }}
                                    className="min-w-3xs py-4 bg-secondary-light dark:bg-muted-light place-self-end mr-5"
                                >
                                    <div className="flex flex-col gap-4 p-4 items-center text-sm md:text-base text-primary dark:text-muted-darker">
                                        <Link href="/">Home</Link>
                                        <div className="h-[1px] w-1/3 mx-auto bg-tertiary dark:bg-muted-darker"></div>
                                        <Link href="/profile">Profile</Link>
                                        <div className={`h-[1px] w-1/2 mx-auto bg-tertiary dark:bg-muted-darker ${isAuthRoute ? "hidden" : ""}`}></div>
                                        {
                                            isLoggedIn || session ? (
                                                <div className={`flex gap-4 items-center ${isAuthRoute ? "hidden" : ""}`}>
                                                    <button
                                                        onClick={() => {
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
        </motion.div>
    )
}