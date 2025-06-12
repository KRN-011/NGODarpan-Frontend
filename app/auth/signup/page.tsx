"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import Image from "next/image"
import { redirect } from "next/navigation"

export default function SignUpPage() {

    const { data: session } = useSession()

    if (session) {
        redirect("/")
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const email = formData.get("email") as string
        signIn("email", { email })
    }

    return (
        <div className="flex justify-center w-full h-full items-center py-40">
            <div className="bg-secondary-light w-1/4 p-10 rounded-3xl">
                <div className="flex flex-col gap-4 w-full items-center">
                    <h1 className="text-3xl font-bold">SignUp</h1>
                    <p className="text-muted-dark">Create an account to get started</p>
                    <div className="flex flex-col w-full gap-4">
                        <button onClick={() => signIn("google")} className="p-2 px-8 rounded-md bg-primary text-tertiary cursor-pointer max-w-fit flex mx-auto items-center justify-center gap-2 hover:bg-primary-light transition-all duration-300 hover:text-quaternary">
                            <Image src="/icons/google-logo.png" alt="Google" width={30} height={30} />
                            Signup with Google
                        </button>
                        <button onClick={() => signIn("github")} className="p-2 px-8 rounded-md bg-primary text-tertiary cursor-pointer max-w-fit flex mx-auto items-center justify-center gap-2 hover:bg-primary-light transition-all duration-300 hover:text-quaternary">
                            <Image src="/icons/github-logo.png" alt="Github" width={30} height={30} />
                            Signup with Github
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-full h-[1px] bg-muted-dark"></div>
                            <p className="text-muted-dark">or</p>
                            <div className="w-full h-[1px] bg-muted-dark"></div>
                        </div>
                        <form onSubmit={handleSubmit} className="w-3/4 mx-auto">
                            <div className="flex flex-col w-full gap-4">
                                <input type="email" placeholder="Enter your email" className="w-full p-2 rounded-md border-2 border-muted" />
                                <button type="submit" className="p-2 rounded-md bg-primary text-tertiary cursor-pointer hover:bg-primary-light transition-all duration-300 hover:text-quaternary">Signup with Email</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}