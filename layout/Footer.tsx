import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <div className="bg-secondary dark:bg-muted-darker transition-all duration-300 w-full mt-auto">
            <div className="flex flex-col md:flex-row w-full mx-auto py-6 justify-between max-md:gap-5 md:px-20">
                <div className="flex justify-center py-4 items-center">
                    <div>
                        <Image src="/logo.png" alt="NGO Darpan Logo" width={100} height={100} className="max-sm:w-20 dark:invert dark:brightness-50"/>
                    </div>
                </div>
                <div className="flex flex-row gap-16 max-md:items-center max-md:gap-12 max-lg:flex-wrap justify-center max-md:px-10">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-md font-semibold text-primary dark:text-muted-light">Useful Links</h1>
                        <div className="flex flex-col gap-2 text-sm md:text-base text-primary dark:text-muted">
                            <Link href="/">Home</Link>
                            <Link href="/">About</Link>
                            <Link href="/">Contact</Link>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h1 className="text-md font-semibold text-primary dark:text-muted-light">Useful Links</h1>
                        <div className="flex flex-col gap-2 text-sm md:text-base text-primary dark:text-muted">
                            <Link href="/">Home</Link>
                            <Link href="/">About</Link>
                            <Link href="/">Contact</Link>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h1 className="text-md font-semibold text-primary dark:text-muted-light">Useful Links</h1>
                        <div className="flex flex-col gap-2 text-sm md:text-base text-primary dark:text-muted">
                            <Link href="/">Home</Link>
                            <Link href="/profile">Profile</Link>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h1 className="text-md font-semibold text-primary dark:text-muted-light">Useful Links</h1>
                        <div className="flex flex-col gap-2 text-sm md:text-base text-primary dark:text-muted">
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