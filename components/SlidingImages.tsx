'use client'

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, useTransform } from "framer-motion"
import { useLenisScroll } from "@/components/LenisProvider";

const images = [
    { image: "/home-page-images/1.jpg", position: { x: 750, y: 0, rotate: 10, width: 400, height: 400 } },
    { image: "/home-page-images/2.jpg", position: { x: -700, y: 300, rotate: -30, width: 400, height: 400 } },
    { image: "/home-page-images/3.jpg", position: { x: 700, y: -350, rotate: 20, width: 300, height: 300 } },
    { image: "/home-page-images/4.jpg", position: { x: -750, y: -250, rotate: -5, width: 300, height: 300 } },
    { image: "/home-page-images/5.jpg", position: { x: 550, y: 400, rotate: 20, width: 350, height: 350 } },
    { image: "/home-page-images/6.jpg", position: { x: 300, y: -300, rotate: 3, width: 200, height: 200 } },
    { image: "/home-page-images/7.jpg", position: { x: -350, y: -300, rotate: -5, width: 250, height: 250 } },
]

export default function SlidingImages() {

    const scrollY = useLenisScroll();

    const yScroll = useTransform(scrollY, [0, 1000], [0, -1000]);
    const yOpacity = useTransform(scrollY, [0, 450], [1, 0]);

    return (
        <div className="h-screen w-full relative  z-10">
            {
                images.map((image, index) => (
                    <div
                        key={index}
                        className="absolute w-full h-full flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, x: 0, y: 0, rotate: 0 }}
                            animate={{ opacity: 1, scale: 1, x: image.position.x, y: image.position.y, rotate: image.position.rotate }}
                            exit={{ opacity: 0, scale: 0.5, x: image.position.x, y: image.position.y, rotate: image.position.rotate }}
                            transition={{ duration: 0.5, opacity: { delay: 1 }, scale: { delay: 1 }, x: { delay: 1, duration: 0.75 }, y: { delay: 1, duration: 0.75 }, rotate: { delay: 1, duration: 0.75 }, ease: "easeOut" }}
                            style={{
                                // This is the key: add the scroll-based y to the base y position
                                y: useTransform(yScroll, scrollY => image.position.y + scrollY),
                                opacity: yOpacity,
                            }}
                            className="relative flex items-center justify-center overflow-hidden">
                            <Image src={image.image} alt="slider" width={image.position.width} height={image.position.height} className={`object-cover dark:grayscale-100`} />
                        </motion.div>
                    </div>
                ))
            }
        </div>
    );
}