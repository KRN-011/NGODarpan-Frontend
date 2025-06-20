import NGOInformationForm from "@/components/forms/NGOInformationForm";
import PersonalInformationForm from "@/components/forms/PersonalInformationForm";
import { cn } from "@/lib/utils";
import Link from "next/link";



export default async function SignupNGO({ searchParams }: { searchParams: { step: string, subStep: string } }) {

    const { step, subStep } = await searchParams;

    return (
        <div className="flex w-full h-full rounded-2xl bg-primary dark:bg-muted-darker">
            <div className="w-full md:w-7xl mx-auto h-full flex flex-col">
                <div className="flex flex-col md:flex-row max-md:w-fit max-md:mx-auto md:justify-evenly gap-4 py-7">
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "text-2xl font-bold bg-secondary dark:bg-muted-dark rounded-full w-8 h-8 sm:w-10 sm:h-10 flex justify-center items-center",
                            step === "personal" ? "bg-quaternary text-primary dark:bg-quaternary-dark" : "bg-secondary dark:bg-muted-dark/50 text-muted-dark dark:text-muted"
                        )}>1</span>
                        <h1 className={cn(
                            "text-lg sm:text-xl font-bold",
                            step === "personal" ? "text-quaternary" : "text-primary-dark dark:text-muted"
                        )}>Personal Information</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "text-2xl font-bold bg-secondary dark:bg-muted-dark rounded-full w-8 h-8 sm:w-10 sm:h-10 flex justify-center items-center",
                            step === "ngoInfo" ? "bg-quaternary text-primary dark:bg-quaternary-dark" : "bg-muted dark:bg-muted-dark/50 text-muted-dark dark:text-muted"
                        )}>2</span>
                        <h1 className={cn(
                            "text-lg sm:text-xl font-bold",
                            step === "ngoInfo" ? "text-quaternary" : "text-primary-dark dark:text-muted"
                        )}>NGO Information</h1>
                    </div>
                </div>
                <div className="h-[1px] bg-tertiary flex" />
                <div className="flex flex-col md:w-md mx-auto px-5 mt-10">
                    {
                        step === "personal" && (
                            <div className="flex flex-col md:flex-row max-md:w-fit max-md:mx-auto md:justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "text-lg font-semibold bg-secondary dark:bg-muted-dark rounded-full w-5 h-5 sm:w-6 sm:h-6 flex justify-center items-center",
                                        subStep === "details" ? "bg-quaternary text-primary dark:bg-quaternary-dark" : "bg-muted dark:bg-muted-dark/50 text-muted-dark dark:text-muted"
                                    )}>1</span>
                                    <h1 className={cn(
                                        "text-base sm:text-md font-bold",
                                        subStep === "details" ? "text-quaternary" : "text-primary-dark dark:text-muted"
                                    )}>Details</h1>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "text-lg font-semibold bg-secondary dark:bg-muted-dark rounded-full w-5 h-5 sm:w-6 sm:h-6 flex justify-center items-center",
                                        subStep === "verification" ? "bg-quaternary text-primary dark:bg-quaternary-dark" : "bg-muted dark:bg-muted-dark/50 text-muted-dark dark:text-muted"
                                    )}>2</span>
                                    <h1 className={cn(
                                        "text-base sm:text-md font-bold",
                                        subStep === "verification" ? "text-quaternary" : "text-primary-dark dark:text-muted"
                                    )}>Verification</h1>
                                </div>
                            </div>
                        )
                    }
                    {
                        step === "ngoInfo" && (
                            <div className="flex flex-col md:flex-row max-md:w-fit max-md:mx-auto md:justify-between gap-4">
                                <Link href={`/auth/signup/ngo?step=ngoInfo&subStep=requirements`} className="flex items-center gap-2 cursor-pointer">
                                    <span className={cn(
                                        "text-lg font-semibold bg-secondary dark:bg-muted-dark rounded-full w-5 h-5 sm:w-6 sm:h-6 flex justify-center items-center",
                                        subStep === "requirements" ? "bg-quaternary text-primary dark:bg-quaternary-dark" : "bg-muted dark:bg-muted-dark/50 text-muted-dark dark:text-muted"
                                    )}>1</span>
                                    <h1 className={cn(
                                        "text-base sm:text-md font-bold",
                                        subStep === "requirements" ? "text-quaternary" : "text-primary-dark dark:text-muted"
                                    )}>Requirements</h1>
                                </Link>
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "text-lg font-semibold bg-secondary dark:bg-muted-dark rounded-full w-5 h-5 sm:w-6 sm:h-6 flex justify-center items-center",
                                        subStep === "taxation" ? "bg-quaternary text-primary dark:bg-quaternary-dark" : "bg-muted dark:bg-muted-dark/50 text-muted-dark dark:text-muted"
                                    )}>2</span>
                                    <h1 className={cn(
                                        "text-base sm:text-md font-bold",
                                        subStep === "taxation" ? "text-quaternary" : "text-primary-dark dark:text-muted"
                                    )}>Taxation</h1>
                                </div>
                            </div>
                        )
                    }
                </div>
                {
                    step === "personal" && (
                        <div className="flex justify-center items-center w-full h-full">
                            <PersonalInformationForm />
                        </div>
                    )
                }
                {
                    step === "ngoInfo" && (
                        <div className="flex justify-center items-center w-full h-full">
                            <NGOInformationForm />
                        </div>
                    )
                }
            </div>
        </div>
    )
}