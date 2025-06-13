import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <div className="bg-secondary dark:bg-muted-darker transition-all duration-300 w-full">
            <div className="flex w-7xl mx-auto py-6 justify-between">
                <div className="flex justify-between px-20 py-4 items-center">
                    <div>
                        <Image src="/logo.png" alt="NGO Darpan Logo" width={100} height={100} className="dark:invert dark:brightness-50"/>
                    </div>
                </div>
                <div className="flex gap-20">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-md font-semibold">Useful Links</h1>
                        <div className="flex flex-col gap-2">
                            <Link href="/">Home</Link>
                            <Link href="/">About</Link>
                            <Link href="/">Contact</Link>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h1 className="text-md font-semibold">Useful Links</h1>
                        <div className="flex flex-col gap-2">
                            <Link href="/">Home</Link>
                            <Link href="/">About</Link>
                            <Link href="/">Contact</Link>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h1 className="text-md font-semibold">Useful Links</h1>
                        <div className="flex flex-col gap-2">
                            <Link href="/">Home</Link>
                            <Link href="/">About</Link>
                            <Link href="/">Contact</Link>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h1 className="text-md font-semibold">Useful Links</h1>
                        <div className="flex flex-col gap-2">
                            <Link href="/">Home</Link>
                            <Link href="/">About</Link>
                            <Link href="/">Contact</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}