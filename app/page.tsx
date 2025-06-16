'use client'

import { motion } from "framer-motion";

export default function Home() {
    return (
        <div className="relative select-nonem min-h-screen">
            <div className="h-screen w-full absolute top-0 left-0 z-0">
                <div className="h-full w-full flex items-center justify-center max-w-4xl mx-auto">
                    <motion.div className="flex flex-col items-center justify-center"
                        initial={{ opacity: 0, scale: 0.9, y: 100 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 100 }}
                        transition={{ duration: 0.5, opacity: { delay: 2.25, duration: 0.4 }, scale: { delay: 3.75, duration: 0.25 }, y: { delay: 2.25, duration: 0.4 }, ease: "easeOut" }}
                    >
                        <div className="flex overflow-hidden">
                            <h1 className="text-6xl font-bold dark:text-muted-light">
                                {
                                    "Welcome to NGO Darpan".split(/(\s+)/).map((part, index) => (
                                        part.trim() === "" ? part : (
                                            <motion.span
                                                key={index}
                                                className="inline-block"
                                                initial={{ y: "100%" }}
                                                animate={{ y: 0 }}
                                                exit={{ y: "100%" }}
                                                transition={{ duration: index * 1.5 + 0.5, y: { delay: index * 0.08 + 2.75, duration: 0.5 }, ease: "easeOut" }}
                                            >
                                                {part}
                                            </motion.span>
                                        )
                                    ))
                                }
                            </h1>
                        </div>
                        <p className="text-2xl text-center mt-5 text-secondary-dark dark:text-muted">
                            We are a team of dedicated volunteers who are committed to making a difference in the lives of those in need.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
